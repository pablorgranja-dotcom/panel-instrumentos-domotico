exports.seed = async function(knex) {
  await knex('devices').del();
  await knex('devices').insert([
    { name: 'Foco Principal', type: 'LED', status: false }
  ]);
};