'use strict';

const NotNullViolationError = require('../../../../../errors/NotNullViolationError');

module.exports = {
  error: NotNullViolationError,

  parse: (err) => {
    if (err.code !== '23502') {
      return null;
    }

    return {
      table: err.table,
      column: err.column
    };
  },

  subclassParsers: []
};