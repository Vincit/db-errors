const NotNullViolationError = require('../../../../../errors/NotNullViolationError');

const COLUMN_REGEX = /Column '(.+)' cannot be null/;

module.exports = {
  error: NotNullViolationError,

  parse: (err) => {
    if (err.code !== 'ER_BAD_NULL_ERROR') {
      return null;
    }

    const columnMatch = COLUMN_REGEX.exec(err.sqlMessage);

    if (!columnMatch) {
      return null;
    }

    // No way to reliably get `table` from mysql error.
    return {
      column: columnMatch[1]
    };
  },

  subclassParsers: []
};