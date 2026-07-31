// 1. PRIMERO: Cargar variables de entorno
require('dotenv').config();

// 2. SEGUNDO: Inicializar la base de datos (esto vincula Model.knex(knex))
require('./src/config/database');

// 3. TERCERO: Ahora sí, importar app y Arduino
const app = require('./src/app');
const { openSerialPort } = require('./src/serial/arduinoConnection');

// Iniciar la lectura del puerto serial (Arduino)
openSerialPort();

// Definir el puerto
const PORT = process.env.PORT || 3001;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(` Arquitectura modular cargada correctamente`);
});