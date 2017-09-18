'use strict';

const NotNullViolationError = require('../../../../errors/NotNullViolationError');

const CODE = 'SQLITE_CONSTRAINT';
const NOT_COLUMN_REGEX = /SQLITE_CONSTRAINT: NOT NULL constraint failed: (.+)$/;

module.exports = {
  error: NotNullViolationError,

  parse: (err) => {
    if (err.code !== CODE) {
      return null;
    }

    const colMatch = NOT_COLUMN_REGEX.exec(err.message);

    if (!colMatch) {
      return null;
    }

    const cols = colMatch[1]
      .split(',')
      .map(it => it.trim())
      .map(it => it.split('.'))
      .map(it => it.map(it => it.trim()))

    const parts = colMatch[1]
      .trim()
      .split('.')
      .map(it => it.trim());

    return {
      table: parts[0],
      column: parts[1]
    };
  },

  subclassParsers: []
};