exports.up = function(knex) {
  return knex.schema.createTable('devices', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('type').notNullable();
    table.boolean('status').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('devices');
};