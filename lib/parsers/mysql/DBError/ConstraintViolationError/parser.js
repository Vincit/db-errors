'use strict';

const ConstraintViolationError = require('../../../../errors/ConstraintViolationError');

module.exports = {
  error: ConstraintViolationError,

  parse: (err) => {
    if (err.sqlState.substr(0, 2) === '23') {
      return {};
    } else {
      return null;
    }
  },

  subclassParsers: [
    require('./UniqueViolationError/parser'),
    require('./NotNullViolationError/parser'),
    require('./ForeignKeyViolationError/parser')
  ]
};