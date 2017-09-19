'use strict';

const Promise = require('bluebird');
const sortBy = require('lodash/sortBy');

function tables(session, tables) {
  const knex = session.knex;
  const schema = knex.schema;

  before(() => {
    return Promise.mapSeries(sortBy(tables, 'deleteIndex'), table => {
      return schema.dropTableIfExists(table.name);
    }).then(() => {
      return Promise.mapSeries(tables, table => {
        return schema.createTable(table.name, table.build);
      })
    });
  });

  beforeEach(() => {
    return Promise.mapSeries(sortBy(tables, 'deleteIndex'), table => {
      return knex(table.name).delete();
    });
  });

  after(() => {
    return Promise.mapSeries(sortBy(tables, 'deleteIndex'), table => {
      return schema.dropTableIfExists(table.name);
    });
  });
}

module.exports = {
  tables
};