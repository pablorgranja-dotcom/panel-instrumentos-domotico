const express = require('express');
const cors = require('cors');
const measurementRoutes = require('./routes/measurementRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/measurements', measurementRoutes);
app.use('/api/measurements/export', exportRoutes); // Ruta para el Excel

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ mensaje: 'API Domótica funcionando correctamente' });
});

module.exports = app;