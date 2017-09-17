# Unified error API for node.js SQL DB drivers

This project is an attempt to create a unified API for node.js SQL DB driver errors. Currently each
driver throws their own kind of errors and libraries like knex, Bookshelf and objection.js simply
pass these errors through. It's usually very difficult to reason with these errors.

WARNING: This project is still in very early alpha stage and should not be used in production.

## API

### Usage

```js
const { wrapError, DBError, UniqueViolationError } = require('db-errors');

function errorHandler(err) {
  const dbError = wrapError(err);

  if (dbError instanceof UniqueViolationError) {
    console.log(`Unique constraint violation for table ${dbError.table} and columns ${dbError.columns}`);
  } else if (dbError instanceof DBError) {
    console.log(`Some unknown DB error ${dbError.nativeError}`);
  }
}
```

### Errors

#### DBError

```ts
class DBError extends Error {
  // The error thrown by the database client.
  nativeError: Error
}
```

Base class for all errors.

#### ConstraintViolationError

```ts
class ConstraintViolationError extends DBError {
  // The constraint that was violated.
  //
  // Available for: postgres, mysql
  constraint: string
}
```

A base class for all constraint violation errors

#### UniqueViolationError

```ts
class UniqueViolationError extends ConstraintViolationError {
  // The columns that failed.
  //
  // Available for: postgres, sqlite
  columns: string[]

  // The table that has the colums.
  //
  // Available for: postgres, sqlite
  table: string
}
```

## Development setup

Install mysql and postgres. Then run the following commands.

```shell
psql -U postgres -c "CREATE USER db_errors SUPERUSER"
psql -U postgres -c "CREATE DATABASE db_errors_test"
mysql -u root -e "CREATE USER db_errors"
mysql -u root -e "GRANT ALL PRIVILEGES ON *.* TO db_errors"
mysql -u root -e "CREATE DATABASE db_errors_test"
```

Run the test:

```shell
npm test
```