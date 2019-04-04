const knex = require('knex');

const mysql = knex({
  client: 'mysql',

  connection: {
    user: 'root',
    password: 'root',
    host: 'localhost'
  }
});

[
  mysql.raw('DROP DATABASE IF EXISTS db_errors_test'),
  mysql.raw('DROP USER IF EXISTS db_errors'),
  mysql.raw('CREATE USER db_errors'),
  mysql.raw('GRANT ALL PRIVILEGES ON *.* TO db_errors'),
  mysql.raw('CREATE DATABASE db_errors_test')
].reduce((promise, query) => {
  return promise.then(() => query);
}, Promise.resolve()).then(() => {
  return Promise.all([
    mysql.destroy()
  ]);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
