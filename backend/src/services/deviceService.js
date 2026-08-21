const Device = require('../models/Device');

class DeviceService {
  async getLight() {
    return await Device.query().where('type', 'LED').first();
  }

  async updateLightStatus(newStatus) {
    const device = await Device.query().where('type', 'LED').first();
    if (!device) {
      throw new Error('Dispositivo LED no encontrado');
    }
    await Device.query().where('id', device.id).patch({ status: newStatus });
    return await Device.query().where('id', device.id).first();
  }
}

module.exports = new DeviceService();