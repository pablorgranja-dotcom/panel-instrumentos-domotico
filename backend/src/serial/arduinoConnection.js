const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const measurementService = require('../services/measurementService');

const PORT_NAME = 'COM4'; // Cambia si es necesario
const BAUD_RATE = 9600;

let latestSensorData = { temperature: 0, humidity: 0 };
let port = null;

function openSerialPort() {
  try {
    if (port) port.close();

    port = new SerialPort({ path: PORT_NAME, baudRate: BAUD_RATE, autoOpen: false });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.open((err) => {
      if (err) {
        console.error('❌ Error abriendo puerto:', err.message);
        setTimeout(openSerialPort, 5000);
        return;
      }
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

        // Guardar usando el servicio
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
      setTimeout(openSerialPort, 5000);
    });

  } catch (error) {
    console.error('❌ No se pudo abrir el puerto:', error.message);
    setTimeout(openSerialPort, 5000);
  }
}

module.exports = { openSerialPort, getLatestData: () => latestSensorData };