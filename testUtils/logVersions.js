function logVersions(session) {
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
}

module.exports = {
  logVersions
};