'use strict';

class DBError extends Error {

  constructor(args) {
    super(args.nativeError.message);

    this.nativeError = args.nativeError;
    this.client = args.client;
  }
}

module.exports = DBError;