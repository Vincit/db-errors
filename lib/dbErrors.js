const parsers = require('./parsers');

const DBError = require('./errors/DBError');
const ConstraintViolationError = require('./errors/ConstraintViolationError');
const ForeignKeyViolationError = require('./errors/ForeignKeyViolationError');
const NotNullViolationError = require('./errors/NotNullViolationError');
const UniqueViolationError = require('./errors/UniqueViolationError');
const CheckViolationError = require('./errors/CheckViolationError');
const DataError = require('./errors/DataError');

const dbs = Object.keys(parsers);

function wrapError(err, db) {
  if (db) {
    const parserTree = parsers[db];
    const result = parse(parserTree, err, null);

    if (result !== null) {
      return new result.node.error(result.args);
    }
  } else {
    for (let i = 0; i < dbs.length; ++i) {
      const parserTree = parsers[dbs[i]];
      const result = parse(parserTree, err, null);
  
      if (result !== null) {
        return new result.node.error(result.args);
      }
    }
  }

  return err;
}

function parse(node, err, parentResult) {
  const args = node.parse(err);

  if (args === null) {
    return null;
  }

  const result = {
    node,
    args: Object.assign({}, parentResult && parentResult.args, args)
  };

  for (let i = 0; i < node.subclassParsers.length; ++i) {
    const subResult = parse(node.subclassParsers[i], err, result);

    if (subResult !== null) {
      return subResult;
    }
  }

  return result;
}

module.exports = {
  wrapError,

  DBError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  ConstraintViolationError,
  CheckViolationError,
  DataError
};