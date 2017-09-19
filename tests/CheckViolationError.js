'use strict';

const tables = require('../testUtils').tables;
const expect = require('expect.js');
const Promise = require('bluebird');
const wrapError = require('../').wrapError;

const DBError = require('../').DBError;
const CheckViolationError = require('../').CheckViolationError;
const ConstraintViolationError = require('../').ConstraintViolationError;

module.exports = (session) => {
  if (session.isMySql()) {
    // mysql doesn't have check constraints.
    return;
  }

  const knex = session.knex;
  const table = 'theTable';

  describe('check constraint violation error', () => {

    tables(session, [{
      name: table,

      raw: [{
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
        `
      }]
    }]);

    describe('insert', () => {

      it('snake_case column', () => {
        return knex(table).insert({value1: 11}).reflect().then(res => {
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
        return knex(table).insert({theValue: 21}).reflect().then(res => {
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
        return knex(table).insert({value1: 9}).returning('id').then(id => {
          return knex(table).update({value1: 10}).where('id', id[0]);
        }).reflect().then(res => {
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
        return knex(table).insert({theValue: 19}).returning('id').then(id => {
          return knex(table).update({theValue: 20}).where('id', id[0]);
        }).reflect().then(res => {
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

function logError(err) {
  if (err.nativeError) {
    const msg = err.nativeError.message;
    delete err.nativeError.message;
    err.nativeError.message = msg;
  } else {
    const msg = err.message;
    delete err.message;
    err.message = msg;
  }

  console.log(JSON.stringify(err, null, 2));
}