const ForeignKeyViolationError = require('../../../../../errors/ForeignKeyViolationError');

const REGEXES = [
  /Key \((.+)\)=\(.+\) is not present in table ".+"\./,
  /Key \((.+)\)=\(.+\) is still referenced from table ".+"\./
];

module.exports = {
  error: ForeignKeyViolationError,

  parse: (err) => {
    if (err.code === '23503') {
      const columnMatch = REGEXES.some(it => it.test(err.detail))

      if (!columnMatch) {
        return null;
      }

      return {
        table: err.table,
        constraint: err.constraint
      };
    } else {
      return null;
    }
  },

  subclassParsers: []
};