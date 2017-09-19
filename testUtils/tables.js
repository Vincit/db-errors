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
        if (table.build) {
          return schema.createTable(table.name, table.build);
        }
      });
    }).then(() => {
      return Promise.mapSeries(tables, table => {
        return Promise.mapSeries(table.raw || [], raw => {
          return schema.raw(raw[session.dialect()]);
        });
      });
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