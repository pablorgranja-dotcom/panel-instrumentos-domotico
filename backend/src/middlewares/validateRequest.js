const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const mensajes = error.details.map(det => det.message).join(', ');
      return res.status(400).json({ error: 'Error de validación', detalles: mensajes });
    }
    
    next();
  };
};

module.exports = validateRequest;