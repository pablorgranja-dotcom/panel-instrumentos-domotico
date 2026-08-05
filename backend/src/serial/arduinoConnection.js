const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const measurementService = require('../services/measurementService');

const PORT_NAME = 'COM4';
const BAUD_RATE = 9600;

let latestSensorData = { temperature: 0, humidity: 0 };
let port = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 10000;

// Cola de comandos pendientes para Arduino
let pendingCommand = null;
let commandResolve = null;

function openSerialPort() {
  try {
    if (port && port.isOpen) {
      port.close();
    }

    port = new SerialPort({ path: PORT_NAME, baudRate: BAUD_RATE, autoOpen: false });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.open((err) => {
      if (err) {
        reconnectAttempts++;
        console.error(`❌ Error abriendo puerto (intento ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}):`, err.message);
        
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.error('⚠️ Límite de reintentos alcanzado.');
          return;
        }
        setTimeout(openSerialPort, RECONNECT_DELAY);
        return;
      }
      
      reconnectAttempts = 0;
      console.log('🔌 Puerto serial abierto correctamente');
    });

    parser.on('data', async (line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // Si es respuesta a un comando pendiente
      if (commandResolve && (trimmedLine.includes('LED_ENCENDIDO') || trimmedLine.includes('LED_APAGADO'))) {
        commandResolve(trimmedLine);
        commandResolve = null;
        pendingCommand = null;
        return;
      }

      // Si es dato del sensor
      if (trimmedLine.includes('Temperatura:')) {
        const match = trimmedLine.match(/Temperatura:\s*([\d.]+)\s*°C\s*y\s*Humedad:\s*([\d.]+)%/);
        if (match) {
          const temp = parseFloat(match[1]);
          const hum = parseFloat(match[2]);
          latestSensorData = { temperature: temp, humidity: hum };
          console.log(`✅ Arduino: Temp ${temp}°C | Hum ${hum}%`);

          try {
            await measurementService.create({ temperature: temp, humidity: hum });
          } catch (dbError) {
            console.error('❌ Error en base de datos:', dbError.message);
          }
        }
      }
    });

    port.on('error', (err) => {
      console.error('❌ Error en puerto serial:', err.message);
      if (commandResolve) {
        commandResolve('ERROR');
        commandResolve = null;
      }
      reconnectAttempts++;
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        setTimeout(openSerialPort, RECONNECT_DELAY);
      }
    });

    port.on('close', () => {
      console.log('⚠️ Puerto cerrado');
      reconnectAttempts = 0;
    });

  } catch (error) {
    console.error('❌ No se pudo abrir el puerto:', error.message);
  }
}

// Función para enviar comandos al Arduino
function sendCommandToArduino(comando) {
  return new Promise((resolve, reject) => {
    if (!port || !port.isOpen) {
      return reject(new Error('Puerto serial no está abierto'));
    }

    commandResolve = resolve;
    pendingCommand = comando;

    port.write(comando + '\n', (err) => {
      if (err) {
        commandResolve = null;
        pendingCommand = null;
        reject(err);
      } else {
        console.log(` Comando enviado al Arduino: ${comando}`);
      }
    });

    // Timeout de 5 segundos
    setTimeout(() => {
      if (commandResolve) {
        commandResolve('TIMEOUT');
        commandResolve = null;
        pendingCommand = null;
      }
    }, 5000);
  });
}

module.exports = { openSerialPort, getLatestData: () => latestSensorData, sendCommandToArduino };