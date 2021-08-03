const DBError = require('../../../errors/DBError');
const errorCodes = require('../../../errorCodes').mysql;

module.exports = {
  error: DBError,

  parse: (err) => {
    if (
      typeof err.code === 'string' &&
      typeof err.sqlMessage === 'string' &&
      typeof err.sqlState === 'string' &&
      err.sqlState.length === 5 &&
      errorCodes.has(err.code) &&
      typeof err.errno === 'number'
    ) {
      return {
        nativeError: err,
        client: 'mysql',
      };
    }

    return null;
  },

  subclassParsers: [require('./ConstraintViolationError/parser'), require('./DataError/parser')],
};
