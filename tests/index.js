const os = require('os');
const path = require('path');
const { TestSession, logVersions } = require('../testUtils');

describe('tests', () => {
  const databases = process.env.DATABASES.split(',').map((it) => it.trim());

  const testDatabaseConfigs = [
    {
      client: 'sqlite3',
      useNullAsDefault: true,

      connection: {
        filename: path.join(os.tmpdir(), 'db_errors_test.db'),
      },

      pool: {
        afterCreate: (conn, cb) => {
          conn.run('PRAGMA foreign_keys = ON', cb);
        },
      },
    },
    {
      client: 'mysql',
      connection: {
        host: '127.0.0.1',
        user: 'db_errors',
        port: 3307,
        password: 'db_errors',
        database: 'db_errors_test',
      },

      pool: {
        afterCreate: (conn, cb) => {
          conn.query(`SET sql_mode = 'STRICT_ALL_TABLES'`, cb);
        },
      },
    },
    {
      client: 'postgres',
      connection: {
        host: '127.0.0.1',
        port: 5433,
        user: 'db_errors',
        database: 'db_errors_test',
      },
    },
    {
      client: 'mssql',
      connection: {
        host: '127.0.0.1',
        user: 'sa',
        // MSSQL Requires a sufficiently complex password.
        password: 'eioC9vvCZzQSy4S9g37i',
        port: 1433,
      },
    },
  ];

  testDatabaseConfigs
    .filter((it) => databases.includes(it.client))
    .forEach((knexConfig) => {
      const session = new TestSession({
        knexConfig,
      });

      describe(knexConfig.client, () => {
        before(() => logVersions(session));

        require('./UniqueViolationError')(session);
        require('./NotNullViolationError')(session);
        require('./ForeignKeyViolationError')(session);
        require('./CheckViolationError')(session);
        require('./DataError')(session);

        after(() => session.destroy());
      });
    });
});
