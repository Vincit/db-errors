const expect = require('expect.js');
const Bluebird = require('bluebird');

const { tables, logError } = require('../testUtils');
const { wrapError, DBError, CheckViolationError, ConstraintViolationError } = require('../');

module.exports = (session) => {
  if (session.isMySql()) {
    // mysql doesn't have check constraints.
    return;
  }

  const knex = session.knex;
  const table = 'theTable';

  describe('check constraint violation error', () => {
    tables(session, [
      {
        name: table,
        raw: [
          {
            postgresql: `
          CREATE TABLE "${table}" (
            id         serial PRIMARY KEY,
            value1     integer,
            "theValue" integer,

            CHECK (value1 < 10),
            CHECK ("theValue" < 20)
          );
        `,

            sqlite3: `
          CREATE TABLE ${table} (
            id       integer PRIMARY KEY,
            value1   integer,
            theValue integer,

            CHECK (value1 < 10),
            CHECK (theValue < 20)
          );
        `,
            // Primary key cannot be null in MSSQL
            mssql: `
          CREATE TABLE "${table}" (
            id         int,
            value1     integer,
            "theValue" integer,
      
            CONSTRAINT ${table}_value1_check CHECK (value1 < 10),
            CONSTRAINT ${table}_theValue_check CHECK ("theValue" < 20)
        );`,
          },
        ],
      },
    ]);

    describe('insert', () => {
      it('snake_case column', () => {
        return Bluebird.resolve(knex(table).insert({ value1: 11 }))
          .reflect()
          .then((res) => {
            logError(res);

            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(DBError);
            expect(error).to.be.a(ConstraintViolationError);
            expect(error).to.be.a(CheckViolationError);

            if (session.isPostgres()) {
              expect(error.table).to.equal(table);
              expect(error.constraint).to.equal('theTable_value1_check');
            }
          });
      });

      it('camelCase column', () => {
        return Bluebird.resolve(knex(table).insert({ theValue: 21 }))
          .reflect()
          .then((res) => {
            logError(res);

            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(CheckViolationError);

            if (session.isPostgres()) {
              expect(error.table).to.equal(table);
              expect(error.constraint).to.equal('theTable_theValue_check');
            }
          });
      });
    });

    describe('update', () => {
      it('snake_case column', () => {
        return Bluebird.resolve(
          knex(table)
            .insert({ value1: 9 })
            .returning('id')
            .then((id) => {
              return knex(table).update({ value1: 10 }).where('id', id[0]);
            })
        )
          .reflect()
          .then((res) => {
            logError(res);

            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(CheckViolationError);

            if (session.isPostgres()) {
              expect(error.table).to.equal(table);
              expect(error.constraint).to.equal('theTable_value1_check');
            }
          });
      });

      it('camelCase column', () => {
        return Bluebird.resolve(
          knex(table)
            .insert({ theValue: 19 })
            .returning('id')
            .then((id) => {
              return knex(table).update({ theValue: 20 }).where('id', id[0]);
            })
        )
          .reflect()
          .then((res) => {
            logError(res);

            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(CheckViolationError);

            if (session.isPostgres()) {
              expect(error.table).to.equal(table);
              expect(error.constraint).to.equal('theTable_theValue_check');
            }
          });
      });
    });
  });
};
