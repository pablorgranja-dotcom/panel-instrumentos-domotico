const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig.development);
const { Model } = require('objection');

// Conectar Objection con Knex
Model.knex(knex);

module.exports = knex;