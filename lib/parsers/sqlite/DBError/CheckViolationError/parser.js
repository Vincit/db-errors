'use strict';

const CheckViolationError = require('../../../../errors/CheckViolationError');

const REGEX = /SQLITE_CONSTRAINT: CHECK constraint failed/;

module.exports = {
  error: CheckViolationError,

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