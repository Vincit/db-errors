const NotNullViolationError = require('../../../../errors/NotNullViolationError');
const { isCode } = require('../util');

const REGEX = /Cannot insert the value NULL into column '(.+)', table '(.+)'; column does not allow nulls. (?:INSERT|UPDATE) fails./;

module.exports = {
  error: NotNullViolationError,

  parse: (err) => {
    if (isCode(err, 16, 515)) {
      const match = REGEX.exec(err.originalError.message);

      if (!match) {
        return null;
      }

      return {
        table: match[2],
        column: match[1],
      };
    } else {
      return null;
    }
  },

  subclassParsers: []
};