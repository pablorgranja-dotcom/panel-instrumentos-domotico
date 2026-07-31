const { Model } = require('objection');

class Measurement extends Model {
  static get tableName() {
    return 'measurements';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['temperature', 'humidity'],
      properties: {
        id: { type: 'integer' },
        temperature: { type: 'number' },
        humidity: { type: 'number' }
      }
    };
  }
}

module.exports = Measurement;