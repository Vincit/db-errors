# Unified error API for node.js SQL DB drivers

This project is an attempt to create a unified API for node.js SQL DB driver errors. Currently each
driver throws their own kind of errors and libraries like knex, Bookshelf and objection.js simply
pass these errors through. It's usually very difficult to reason with these errors.

WARNING: This project is still in very early alpha stage and should not be used in production.

<br>
<br>

## Usage

```js
const { wrapError, DBError, UniqueViolationError } = require('db-errors');

function errorHandler(err) {
  const dbError = wrapError(err);

  if (dbError instanceof UniqueViolationError) {
    console.log(`Unique constraint ${dbError.constraint} failedf for table ${dbError.table} and columns ${dbError.columns}`);
  } else if (dbError instanceof DBError) {
    console.log(`Some unknown DB error ${dbError.nativeError}`);
  }
}
```

<br>
<br>

## API

<br>
<br>

### DBError

```ts
class DBError extends Error {
  // The error thrown by the database client.
  nativeError: Error
}
```

Base class for all errors.

<br>
<br>

### ConstraintViolationError

```ts
class ConstraintViolationError extends DBError {
  // No own properties.
}
```

A base class for all constraint violation errors

<br>
<br>

### UniqueViolationError

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

  // The constraint that was violated.
  //
  // Available for: postgres, mysql
  constraint: string
}
```

<br>
<br>

### NotNullViolationError

```ts
class NotNullViolationError extends ConstraintViolationError {
  // The column that failed.
  //
  // Available for: postgres, sqlite, mysql
  column: string

  // The table that has the colums.
  //
  // Available for: postgres, sqlite
  table: string
}
```

<br>
<br>

### ForeignKeyViolationError

```ts
class ForeignKeyViolationError extends ConstraintViolationError {
  // The table that has the foreign key.
  //
  // Available for: postgres, mysql
  table: string

  // The constraint that was violated.
  //
  // Available for: postgres, mysql
  constraint: string
}
```

<br>
<br>

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