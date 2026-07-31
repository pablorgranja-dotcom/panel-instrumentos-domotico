const Measurement = require('../models/Measurement');

class MeasurementService {
  async getLatest() {
    return await Measurement.query().orderBy('created_at', 'desc').first();
  }

  async getAll(limit = 100) {
    return await Measurement.query().orderBy('created_at', 'desc').limit(limit);
  }

  async create(data) {
    return await Measurement.query().insert(data);
  }

  async getByDateRange(inicioDia, finDia) {
    return await Measurement.query()
      .where('created_at', '>=', inicioDia)
      .where('created_at', '<=', finDia)
      .orderBy('created_at', 'asc');
  }
}

module.exports = new MeasurementService();