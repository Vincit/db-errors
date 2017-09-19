'use strict';

const ForeignKeyViolationError = require('../../../../errors/ForeignKeyViolationError');

const REGEX = /SQLITE_CONSTRAINT: FOREIGN KEY constraint failed/;

module.exports = {
  error: ForeignKeyViolationError,

  parse: (err) => {
    if (err.code === 'SQLITE_CONSTRAINT') {
      const match = REGEX.exec(err.message);

      if (!match) {
        return null;
      }

      // No way to extract anything reliably.
      return {};
    } else {
      return null;
    }
  },

  subclassParsers: []
};