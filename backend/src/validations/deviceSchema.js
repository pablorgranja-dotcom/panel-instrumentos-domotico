const Joi = require('joi');

const deviceSchema = Joi.object({
  status: Joi.boolean().required().messages({
    'any.required': 'El estado (status) es obligatorio',
    'boolean.base': 'El estado debe ser true o false'
  })
});

module.exports = deviceSchema;