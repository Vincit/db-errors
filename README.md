[![Build Status](https://travis-ci.org/Vincit/db-errors.svg?branch=master)](https://travis-ci.org/Vincit/db-errors)

# Unified error API for node.js SQL DB drivers

This project is an attempt to create a unified API for node.js SQL DB driver errors. Each driver 
throws their own kind of errors and libraries like knex, Bookshelf and objection.js simply
pass these errors through. It's usually very difficult to reason with these errors. This
library wraps those errors to error classes that are the same for all drivers. The wrapped
error classes also expose useful information about the errors.

<br>
<br>

## Usage

```js
const {
  wrapError,
  DBError,
  UniqueViolationError,
  NotNullViolationError
} = require('db-errors');

function errorHandler(err) {
  // wrapError function takes any error and returns a DBError subclass instance if
  // the input was an error thrown by the supported database drivers. Otherwise
  // the input error is returned.
  err = wrapError(err);

  if (err instanceof UniqueViolationError) {
    console.log(`Unique constraint ${err.constraint} failed for table ${err.table} and columns ${err.columns}`);
  } else if (err instanceof NotNullViolationError) {
    console.log(`Not null constraint failed for table ${err.table} and column ${err.column}`);
  } else if (err instanceof DBError) {
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

### CheckViolationError

```ts
// This is not available for MySql since MySql doesn't have check constraints.
class CheckViolationError extends ConstraintViolationError {
  // The table that has the check constraint.
  //
  // Available for: postgres
  table: string

  // The constraint that was violated.
  //
  // Available for: postgres
  constraint: string
}
```

<br>
<br>

### DataError

```ts
// Invalid data (string too long, invalid date etc.)
//
// NOTE: SQLite uses dynamic typing and doesn't throw this error.
class DataError extends DBError {
  // There is no easy way to parse data from these kind
  // of errors.
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

Run tests:

```shell
npm test
```
