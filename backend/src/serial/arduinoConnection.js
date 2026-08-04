const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const measurementService = require('../services/measurementService');

const PORT_NAME = 'COM4'; // Cambia si es necesario
const BAUD_RATE = 9600;

let latestSensorData = { temperature: 0, humidity: 0 };
let port = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10; // Límite de reintentos
const RECONNECT_DELAY = 10000; // 10 segundos entre reintentos (más largo para evitar colapsos)

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
          console.error('⚠️ Límite de reintentos alcanzado. Deteniendo reconexión automática.');
          console.error('💡 Solución: Cierra el Monitor Serial de Arduino IDE y reinicia el backend.');
          return;
        }
        
        setTimeout(openSerialPort, RECONNECT_DELAY);
        return;
      }
      
      // Resetear contador al conectar exitosamente
      reconnectAttempts = 0;
      console.log('🔌 Puerto serial abierto correctamente');
    });

    parser.on('data', async (line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.includes('iniciado')) return;

      console.log('📩 Recibido:', trimmedLine);
      
      const match = trimmedLine.match(/Temperatura:\s*([\d.]+)\s*°C\s*y\s*Humedad:\s*([\d.]+)%/);

      if (match) {
        const temp = parseFloat(match[1]);
        const hum = parseFloat(match[2]);

        latestSensorData = { temperature: temp, humidity: hum };
        console.log(`✅ Arduino: Temp ${temp}°C | Hum ${hum}%`);

        try {
          await measurementService.create({ temperature: temp, humidity: hum });
          console.log('💾 Guardado en SQLite');
        } catch (dbError) {
          console.error('❌ Error en base de datos:', dbError.message);
        }
      }
    });

    port.on('error', (err) => {
      console.error('❌ Error en puerto serial:', err.message);
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
    console.error(' No se pudo abrir el puerto:', error.message);
    reconnectAttempts++;
    
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      setTimeout(openSerialPort, RECONNECT_DELAY);
    }
  }
}

module.exports = { openSerialPort, getLatestData: () => latestSensorData };