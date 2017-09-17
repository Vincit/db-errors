'use strict';

const parsers = require('./parsers');

const DBError = require('./errors/DBError');
const ConstraintViolationError = require('./errors/ConstraintViolationError');
const UniqueViolationError = require('./errors/UniqueViolationError');

function wrapError(err) {
  const dbs = Object.keys(parsers);

  for (let i = 0, l = dbs.length; i < l; ++i) {
    const parserTree = parsers[dbs[i]];
    const result = parse(parserTree, err, null);

    if (result !== null) {
      return new result.node.error(result.args);
    }
  }
}

function parse(node, err, parentResult) {
  const args = node.parse(err);

  if (args === null) {
    return parentResult;
  }

  const result = {
    node,
    args: Object.assign({}, parentResult && parentResult.args, args)
  };

  for (let i = 0; i < node.children.length; ++i) {
    const childResult = parse(node.children[i], err, result);

    if (childResult !== null) {
      return childResult;
    }
  }

  return result;
}

module.exports = {
  wrapError,

  DBError,
  UniqueViolationError,
  ConstraintViolationError
};