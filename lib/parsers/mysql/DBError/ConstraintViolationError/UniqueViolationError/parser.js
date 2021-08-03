const UniqueViolationError = require('../../../../../errors/UniqueViolationError');

const CODES = ['ER_DUP_ENTRY', 'ER_DUP_ENTRY_WITH_KEY_NAME'];
const CONSTRAINT_REGEX = /Duplicate entry '(.+)' for key '(.+)'/;

module.exports = {
  error: UniqueViolationError,

  parse: (err) => {
    if (CODES.indexOf(err.code) === -1) {
      return null;
    }

    const constraintMatch = CONSTRAINT_REGEX.exec(err.sqlMessage);

    if (!constraintMatch) {
      return null;
    }

    // On mysql 8 the table is in the string.
    const constraintParts = constraintMatch[2].split('.');

    if (constraintParts.length === 2) {
      return {
        constraint: constraintParts[1],
        table: constraintParts[0],
      };
    }

    // No way to reliably get `table` and `columns` from mysql error.
    return {
      constraint: constraintMatch[2],
    };
  },

  subclassParsers: [],
};
