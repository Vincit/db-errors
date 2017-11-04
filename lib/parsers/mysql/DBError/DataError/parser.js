'use strict';

const DataError = require('../../../../errors/DataError');

const ERROR_CODES = [
  'ER_DATA_TOO_LONG',
  'ER_TRUNCATED_WRONG_VALUE',
  'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD'
];

module.exports = {
  error: DataError,

  parse: (err) => {
    if (ERROR_CODES.includes(err.code)) {
      return {};
    } else {
      return null;
    }
  },

  subclassParsers: []
};