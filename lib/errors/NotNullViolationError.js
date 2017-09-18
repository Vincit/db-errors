'use strict';

const ConstraintViolationError = require('./ConstraintViolationError');

class NotNullViolationError extends ConstraintViolationError {

  constructor(args) {
    super(args);

    this.table = args.table;
    this.column = args.column;
  }
}

module.exports = NotNullViolationError;