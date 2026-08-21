const deviceService = require('../services/deviceService');
const { sendCommandToArduino } = require('../serial/arduinoConnection');

class DeviceController {
  async getLight(req, res) {
    try {
      const device = await deviceService.getLight();
      if (!device) {
        return res.status(404).json({ error: 'Dispositivo no encontrado' });
      }
      res.json({ id: device.id, name: device.name, type: device.type, status: device.status });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el estado del foco' });
    }
  }

  async updateLight(req, res) {
    try {
      const { status } = req.body;
      
      // 1. Actualizar en la base de datos
      const device = await deviceService.updateLightStatus(status);
      
      // 2. Enviar comando al Arduino
      const comando = status ? 'LIGHT_ON' : 'LIGHT_OFF';
      const respuestaArduino = await sendCommandToArduino(comando);
      
      console.log(`💡 Foco ${status ? 'ENCENDIDO' : 'APAGADO'} | Respuesta Arduino: ${respuestaArduino}`);
      
      res.json({ 
        id: device.id, 
        name: device.name, 
        type: device.type, 
        status: device.status,
        arduinoResponse: respuestaArduino
      });
    } catch (error) {
      console.error(' Error al controlar el foco:', error);
      res.status(500).json({ error: 'Error al controlar el foco' });
    }
  }
}

module.exports = new DeviceController();