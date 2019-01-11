declare namespace DbTypes {

    interface DbErrorOpts {
        nativeError: {
            message: string
        }
    }

    class DBError extends Error {
        name: string;
        nativeError: Error;
        client: any;

        constructor(args?: DbErrorOpts);
    }

    class CheckViolationError extends DBError {
        table: string
        constraint: string
    }

    class ConstraintViolationError extends DBError {}

    class DataError extends DBError {}

    class ForeignKeyViolationError extends ConstraintViolationError {
        table: string
        constraint: string
    }

    class NotNullViolationError extends ConstraintViolationError {
        table: string
        constraint: string
    }

    class UniqueViolationError extends ConstraintViolationError {
        table: string
        columns: string[]
        constraint: string
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
