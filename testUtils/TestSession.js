'use strict';

const Knex = require('knex');

class TestSession {

  constructor(config) {
    this.knex = Knex(config.knexConfig);
  }

  dialect() {
    return getDialect(this.knex);
  }

  isPostgres() {
    return isPostgres(this.knex);
  }

  isMySql() {
    return isMySql(this.knex);
  }

  isSqlite() {
    return isSqlite(this.knex);
  }
}

function getDialect(knex) {
  return (knex && knex.client && knex.client.dialect) || null;
}

function isPostgres(knex) {
  return getDialect(knex) === 'postgresql';
}

function isMySql(knex) {
  return getDialect(knex) === 'mysql';
}

function isSqlite(knex) {
  return getDialect(knex) === 'sqlite3';
}


module.exports = {
  TestSession
};