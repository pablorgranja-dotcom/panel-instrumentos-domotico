const measurementService = require('../services/measurementService');

class MeasurementController {
  async getLatest(req, res) {
    try {
      const latest = await measurementService.getLatest();
      if (latest) {
        res.json({
          temperature: latest.temperature,
          humidity: latest.humidity,
          created_at: latest.created_at
        });
      } else {
        res.json({ temperature: 0, humidity: 0, created_at: null });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la última medición' });
    }
  }

  async getAll(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const measurements = await measurementService.getAll(limit);
      res.json(measurements);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el historial' });
    }
  }

  async create(req, res) {
    try {
      const measurement = await measurementService.create(req.body);
      res.status(201).json(measurement);
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar la medición' });
    }
  }
}

module.exports = new MeasurementController();