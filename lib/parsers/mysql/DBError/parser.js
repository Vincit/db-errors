'use strict';

const DBError = require('../../../errors/DBError');
const errorCodes = require('../../../errorCodes').mysql;

module.exports = {
  error: DBError,

  parse: (err) => {
    if (typeof err.code === 'string'
      && errorCodes.has(err.code)
      && typeof err.errno === 'number'
      && 'sqlMessage' in err) {

      return {
        nativeError: err,
        client: 'mysql'
      };
    }

    return null;
  },

  subclassParsers: [
    require('./ConstraintViolationError/parser'),
    require('./DataError/parser')
  ]
};