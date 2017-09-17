'use strict';

const Promise = require('bluebird');

function tables(session, tables) {
  const schema = session.knex.schema;

  beforeEach(() => {
    return Promise.mapSeries(tables, table => {
      return schema.dropTableIfExists(table.name);
    }).then(() => {
      return Promise.mapSeries(tables, table => {
        return schema.createTable(table.name, table.build);
      })
    });
  });

  afterEach(() => {
    return Promise.mapSeries(tables, table => {
      return schema.dropTableIfExists(table.name);
    });
  });
}

module.exports = {
  tables
};