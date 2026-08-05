const express = require('express');
const cors = require('cors');
const measurementRoutes = require('./routes/measurementRoutes');
const exportRoutes = require('./routes/exportRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/measurements', measurementRoutes);
app.use('/api/measurements/export', exportRoutes);
app.use('/api/devices', deviceRoutes);

app.get('/api/test', (req, res) => {
  res.json({ mensaje: 'API Domótica funcionando correctamente' });
});

module.exports = app;