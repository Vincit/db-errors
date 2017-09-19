'use strict';

const NotNullViolationError = require('../../../../../errors/NotNullViolationError');

const CODE = '23502';

module.exports = {
  error: NotNullViolationError,

  parse: (err) => {
    if (err.code !== CODE) {
      return null;
    }

    return {
      table: err.table,
      column: err.column
    };
  },

  subclassParsers: []
};