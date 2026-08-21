const Measurement = require('../models/Measurement');
const Device = require('../models/Device');

class MeasurementService {
  async create(data) {
    // 1. Intentar obtener el estado actual del LED de la base de datos
    let ledStatus = 0; // 0 = Apagado por defecto
    try {
      const device = await Device.query().where('type', 'LED').first();
      if (device) {
        // Si el dispositivo existe y su status es true (o 1), lo marcamos como encendido
        ledStatus = device.status ? 1 : 0;
      }
    } catch (error) {
      console.error('⚠️ No se pudo leer el estado del LED:', error.message);
    }

    // 2. Guardar la medición en la base de datos incluyendo el estado del LED
    try {
      const nuevaMedicion = await Measurement.query().insert({
        temperature: data.temperature,
        humidity: data.humidity,
        led_status: ledStatus // <--- AQUÍ ESTÁ LA CLAVE
      });

      console.log(`💾 Guardado: Temp ${data.temperature}°C | Hum ${data.humidity}% | Foco: ${ledStatus === 1 ? '🟢 ENCENDIDO' : ' APAGADO'}`);
      return nuevaMedicion;
    } catch (dbError) {
      console.error('❌ Error al guardar en BD:', dbError.message);
      throw dbError;
    }
  }

  async getAll() {
    // LIMITADO A 50 REGISTROS PARA NO COLAPSAR EL FRONTEND
    return await Measurement.query()
      .orderBy('created_at', 'desc')
      .limit(50); 
  }

  async getLatest() {
    return await Measurement.query().orderBy('created_at', 'desc').first();
  }

  async getByDateRange(fechaInicio, fechaFin) {
    return await Measurement.query()
      .where('created_at', '>=', fechaInicio)
      .where('created_at', '<=', fechaFin)
      .orderBy('created_at', 'asc');
  }
}

module.exports = new MeasurementService();