'use strict';

const DBError = require('./DBError');

class ConstraintViolationError extends DBError {

  constructor(args) {
    super(args);

    this.constraint = args.constraint;
  }
}

module.exports = ConstraintViolationError;