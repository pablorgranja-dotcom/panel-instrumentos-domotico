const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  temperatura: { type: Number, required: true },
  humedad: { type: Number, required: true }
}, {
  timestamps: true // Esto crea automáticamente los campos 'createdAt' y 'updatedAt'
});

module.exports = mongoose.model('SensorData', sensorDataSchema);