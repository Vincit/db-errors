'use strict';

const os = require('os');
const path = require('path');
const Promise = require('bluebird');
const TestSession = require('../testUtils').TestSession;

describe('tests', () => {

  const testDatabaseConfigs = [{
    client: 'sqlite3',
    useNullAsDefault: true,

    connection: {
      filename: path.join(os.tmpdir(), 'db_errors_test.db')
    },

    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  }, {
    client: 'mysql',

    connection: {
      host: '127.0.0.1',
      user: 'db_errors',
      database: 'db_errors_test'
    },

    pool: {
      afterCreate: (conn, cb) => {
        conn.query(`SET sql_mode = 'STRICT_ALL_TABLES'`, cb);
      }
    }
  }, {
    client: 'postgres',

    connection: {
      host: '127.0.0.1',
      user: 'db_errors',
      database: 'db_errors_test'
    }
  }];

  testDatabaseConfigs.forEach(knexConfig => {

    const session = new TestSession({
      knexConfig
    });

    describe(knexConfig.client, () => {

      before(() => {
        console.log('==============================================================');
        let promise = null;

        if (session.isMySql()) {
          promise = session.knex.raw('SELECT version()').then(ret => {
            const rows = ret[0];
            const row = rows[0];
            const keys = Object.keys(row);
            console.log('MySQL', row[keys[0]]);
          });
        } else if (session.isPostgres()) {
          promise = session.knex.raw('SELECT version()').then(ret => {
            console.log(ret.rows[0].version.split(' ').slice(0, 2).join(' '));
          });
        } else if (session.isSqlite()) {
          promise = session.knex.raw('SELECT sqlite_version()').then(rows => {
            const row = rows[0];
            const keys = Object.keys(row);
            console.log('sqlite', row[keys[0]]);
          });
        }

        return promise.reflect().then(() => {
          console.log('==============================================================');
        });
      })

      require('./UniqueViolationError')(session);
      require('./NotNullViolationError')(session);
      require('./ForeignKeyViolationError')(session);
      require('./CheckViolationError')(session);
      require('./DataError')(session);

    });
  });

});
