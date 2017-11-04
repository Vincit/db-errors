'use strict';

const ConstraintViolationError = require('../../../../errors/ConstraintViolationError');

const ERROR_CODES = [
  'ER_NO_REFERENCED_ROW_2',
  'ER_ROW_IS_REFERENCED_2',
  'ER_BAD_NULL_ERROR',
  'ER_DUP_ENTRY',
  'ER_DUP_ENTRY_WITH_KEY_NAME'
];

module.exports = {
  error: ConstraintViolationError,

  parse: (err) => {
    if (ERROR_CODES.includes(err.code)) {
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