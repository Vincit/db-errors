'use strict';

const UniqueViolationError = require('../../../../errors/UniqueViolationError');

const CODE = 'ER_DUP_ENTRY';
const CONSTRAINT_REGEX = /Duplicate entry (.+) for key '(.+)'/;

module.exports = {
  error: UniqueViolationError,

  parse: (err) => {
    if (err.code !== CODE) {
      return null;
    }

    const constraintMatch = CONSTRAINT_REGEX.exec(err.sqlMessage);

    if (!constraintMatch) {
      return null;
    }

    // No way to reliably get `table` and `columns` from mysql error.
    return {
      constraint: constraintMatch[2]
    };
  },

  children: []
};