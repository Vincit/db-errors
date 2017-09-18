'use strict';

const ConstraintViolationError = require('./ConstraintViolationError');

class UniqueViolationError extends ConstraintViolationError {

  constructor(args) {
    super(args);

    this.table = args.table;
    this.columns = args.columns;
    this.constraint = args.constraint;
  }
}

module.exports = UniqueViolationError;