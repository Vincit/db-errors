'use strict';

const tables = require('../testUtils').tables;
const expect = require('expect.js');
const Promise = require('bluebird');
const wrapError = require('../').wrapError;

const DBError = require('../').DBError;
const DataError = require('../').DataError;

module.exports = (session) => {
  const knex = session.knex;
  const table = 'theTable';

  describe('data error', () => {

    tables(session, [{
      name: table,

      build: (table) => {
        table.increments('id');
        table.date('date');
        table.dateTime('date_time');
        table.string('string', 10);
        table.integer('int');
      }
    }]);

    describe('insert', () => {

      it('date (random text)', () => {
        return knex(table).insert({date: 'lol'}).reflect().then(res => {
          if (session.isSqlite()) {
            expect(res.isRejected()).to.equal(false);
            // SQlite is happy with whatever crap.
            return;
          }

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          logError(error);

          expect(error).to.be.a(DBError);
          expect(error).to.be.a(DataError);

          /*
          expect(error).to.be.a(CheckViolationError);

          if (session.isPostgres()) {
            expect(error.table).to.equal(table);
            expect(error.constraint).to.equal('theTable_value1_check');
          }
          */
        });
      });

      it('dateTime (random text)', () => {
        return knex(table).insert({date_time: 'lol'}).reflect().then(res => {
          if (session.isSqlite()) {
            expect(res.isRejected()).to.equal(false);
            // SQlite is happy with whatever crap.
            return;
          }

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          logError(error);

          expect(error).to.be.a(DBError);
          expect(error).to.be.a(DataError);
          /*
          expect(error).to.be.a(CheckViolationError);

          if (session.isPostgres()) {
            expect(error.table).to.equal(table);
            expect(error.constraint).to.equal('theTable_value1_check');
          }
          */
        });
      });

      it('dateTime (invalid date)', () => {
        return knex(table).insert({date_time: '2017-13-04'}).reflect().then(res => {
          if (session.isSqlite()) {
            expect(res.isRejected()).to.equal(false);
            // SQlite is happy with whatever crap.
            return;
          }

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          logError(error);

          expect(error).to.be.a(DBError);
          expect(error).to.be.a(DataError);
          /*
          expect(error).to.be.a(CheckViolationError);

          if (session.isPostgres()) {
            expect(error.table).to.equal(table);
            expect(error.constraint).to.equal('theTable_value1_check');
          }
          */
        });
      });

      it('string (too long)', () => {
        return knex(table).insert({string: '12345678912'}).reflect().then(res => {
          if (session.isSqlite()) {
            expect(res.isRejected()).to.equal(false);
            // SQlite is happy with whatever crap.
            return;
          }

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          logError(error);

          expect(error).to.be.a(DBError);
          expect(error).to.be.a(DataError);
          /*
          expect(error).to.be.a(CheckViolationError);

          if (session.isPostgres()) {
            expect(error.table).to.equal(table);
            expect(error.constraint).to.equal('theTable_value1_check');
          }
          */
        });
      });

      it('integer (invalid)', () => {
        return knex(table).insert({int: 'lol'}).reflect().then(res => {
          if (session.isSqlite()) {
            expect(res.isRejected()).to.equal(false);
            // SQlite is happy with whatever crap.
            return;
          }

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          logError(error);

          expect(error).to.be.a(DBError);
          expect(error).to.be.a(DataError);
          /*
          expect(error).to.be.a(CheckViolationError);

          if (session.isPostgres()) {
            expect(error.table).to.equal(table);
            expect(error.constraint).to.equal('theTable_value1_check');
          }
          */
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