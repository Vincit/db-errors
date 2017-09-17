'use strict';

const UniqueViolationError = require('../../../../errors/UniqueViolationError');

const CODE = 'SQLITE_CONSTRAINT';
const UNIQUE_COLUMNS_REGEX = /SQLITE_CONSTRAINT: UNIQUE constraint failed: (.*)$/;

module.exports = {
  error: UniqueViolationError,

  parse: (err) => {
    if (err.code !== CODE) {
      return null;
    }

    const colsMatch = UNIQUE_COLUMNS_REGEX.exec(err.message);

    if (!colsMatch) {
      return null;
    }

    const cols = colsMatch[1]
      .split(',')
      .map(it => it.trim())
      .map(it => it.split('.'))
      .map(it => it.map(it => it.trim()))

    return {
      table: cols[0][0],
      columns: cols.map(it => it[1])
    };
  },

  children: []
};