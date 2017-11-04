'use strict';

const DataError = require('../../../../errors/DataError');

module.exports = {
  error: DataError,

  parse: (err) => {
    if (err.code.substr(0, 2) === '22') {
      return {};
    } else {
      return null;
    }
  },

  subclassParsers: []
};