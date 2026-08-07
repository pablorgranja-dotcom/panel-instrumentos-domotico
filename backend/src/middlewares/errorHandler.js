function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err.message);

  const status = err.status || 500;
  const mensaje = err.publicMessage || 'Error interno del servidor';

  res.status(status).json({ error: mensaje });
}

module.exports = errorHandler;
