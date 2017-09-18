'use strict';

const NotNullViolationError = require('../../../../errors/NotNullViolationError');

const CODES = ['ER_BAD_NULL_ERROR'];
const COLUMN_REGEX = /Column '(.+)' cannot be null/;

module.exports = {
  error: NotNullViolationError,

  parse: (err) => {
    if (CODES.indexOf(err.code) === -1) {
      return null;
    }

    const columnMatch = COLUMN_REGEX.exec(err.sqlMessage);

    if (!columnMatch) {
      return null;
    }

    // No way to reliably get `table` and `constraint` from mysql error.
    return {
      column: columnMatch[1]
    };
  },

  subclassParsers: []
};