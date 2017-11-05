const DataError = require('../../../../errors/DataError');

const ERROR_CODES = [
  'ER_DATA_TOO_LONG',
  'ER_TRUNCATED_WRONG_VALUE',
  'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD'
];

module.exports = {
  error: DataError,

  parse: (err) => {
    // MySQL mainly uses the SQLSTATE codes, but some errors don't have
    // an SQLSTATE equivalent.
    if (err.sqlState.substr(0, 2) === '22' || ERROR_CODES.includes(err.code)) {
      return {};
    } else {
      return null;
    }
  },

  subclassParsers: []
};