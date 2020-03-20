declare namespace DbTypes {

  interface DBErrorArgs {
    nativeError: Error;
    client: 'postgres' | 'mysql' | 'mssql' | 'sqlite';
  }

  class DBError extends Error {
    constructor(args: DBErrorArgs);
    name: string;
    nativeError: Error;
    client: 'postgres' | 'mysql' | 'mssql' | 'sqlite';
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
    constructor(args: ForeignKeyViolationErrorArgs);
    table: string;
    constraint: string;
    schema?: string;
  }

  class ForeignKeyViolationError extends ConstraintViolationError {
    table: string;
    constraint: string;
    schema?: string;
  }

  interface NotNullViolationErrorArgs extends DBErrorArgs {
    table: string;
    column: string;
    schema?: string;
    database?: string;
  }

  class NotNullViolationError extends ConstraintViolationError {
    constructor(args: NotNullViolationErrorArgs);
    table: string;
    column: string;
    schema?: string;
    database?: string;
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

  function wrapError(err: Error): DBError

  export {
    wrapError,
    DBError,
    CheckViolationError,
    ConstraintViolationError,
    DataError,
    ForeignKeyViolationError,
    NotNullViolationError,
    UniqueViolationError,
  }
}

export = DbTypes
