declare namespace DbTypes {
  type DBErrorClient = 'postgres' | 'mysql' | 'mssql' | 'sqlite';

  interface DBErrorArgs {
    nativeError: Error;
    client: DBErrorClient;
  }

  class DBError extends Error {
    constructor(args: DBErrorArgs);

    name: string;
    nativeError: Error;
    client: DBErrorClient;
  }

  interface CheckViolationErrorArgs extends DBErrorArgs {
    table: string;
    constraint: string;
  }

  class CheckViolationError extends DBError {
    constructor(args: CheckViolationErrorArgs);

    table: string;
    constraint: string;
  }

  class ConstraintViolationError extends DBError {}

  class DataError extends DBError {}

  interface ForeignKeyViolationErrorArgs extends DBErrorArgs {
    table: string;
    constraint: string;
    schema?: string;
  }

  class ForeignKeyViolationError extends ConstraintViolationError {
    constructor(args: ForeignKeyViolationErrorArgs);

    table: string;
    constraint: string;
    schema?: string;
  }

  interface NotNullViolationErrorArgs extends DBErrorArgs {
    table: string;
    column: string;
    database?: string;
    schema?: string;
  }

  class NotNullViolationError extends ConstraintViolationError {
    constructor(args: NotNullViolationErrorArgs);

    table: string;
    column: string;
    database?: string;
    schema?: string;
  }

  interface UniqueViolationErrorArgs extends DBErrorArgs {
    table: string;
    columns: string[];
    constraint: string;
    schema?: string;
  }

  class UniqueViolationError extends ConstraintViolationError {
    constructor(args: UniqueViolationErrorArgs);

    table: string;
    columns: string[];
    constraint: string;
    schema?: string;
  }

  function wrapError(err: Error): DBError;

  export {
    wrapError,
    DBError,
    CheckViolationError,
    ConstraintViolationError,
    DataError,
    ForeignKeyViolationError,
    NotNullViolationError,
    UniqueViolationError,
  };
}

export = DbTypes;
