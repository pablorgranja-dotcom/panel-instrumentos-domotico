const Joi = require('joi');

const measurementSchema = Joi.object({
  temperature: Joi.number().required().messages({
    'any.required': 'La temperatura es obligatoria',
    'number.base': 'La temperatura debe ser un número'
  }),
  humidity: Joi.number().min(0).max(100).required().messages({
    'any.required': 'La humedad es obligatoria',
    'number.min': 'La humedad no puede ser menor a 0',
    'number.max': 'La humedad no puede ser mayor a 100'
  })
});

module.exports = measurementSchema;