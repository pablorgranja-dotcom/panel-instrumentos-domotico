exports.up = function(knex) {
  return knex.schema.createTable('measurements', function(table) {
    table.increments('id').primary(); // ID autoincremental
    table.decimal('temperature', 5, 2).notNullable(); // Temperatura con 2 decimales
    table.decimal('humidity', 5, 2).notNullable();    // Humedad con 2 decimales
    table.timestamps(true, true); // Crea created_at y updated_at automáticamente
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('measurements');
};