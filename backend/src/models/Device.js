const { Model } = require('objection');

class Device extends Model {
  static get tableName() {
    return 'devices';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'type'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        type: { type: 'string' },
        status: { type: 'boolean' }
      }
    };
  }
}

module.exports = Device;