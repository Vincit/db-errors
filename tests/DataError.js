const expect = require('expect.js');
const Bluebird = require('bluebird');

const { tables, logError } = require('../testUtils');
const { wrapError, DBError, DataError } = require('../');

module.exports = (session) => {
  const knex = session.knex;
  const table = 'theTable';

  describe('data error', () => {
    tables(session, [
      {
        name: table,
        build: (table) => {
          table.increments('id');
          table.date('date');
          table.dateTime('date_time');
          table.string('string', 10);
          table.integer('int');
        },
      },
    ]);

    describe('insert', () => {
      it('date (random text)', () => {
        return Bluebird.resolve(knex(table).insert({ date: 'lol' }))
          .reflect()
          .then((res) => {
            logError(res);

            if (session.isSqlite()) {
              expect(res.isRejected()).to.equal(false);
              // SQlite is happy with whatever crap.
              return;
            }

            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(DBError);
            expect(error).to.be.a(DataError);
          });
      });

      it('dateTime (random text)', () => {
        return Bluebird.resolve(knex(table).insert({ date_time: 'lol' }))
          .reflect()
          .then((res) => {
            logError(res);

            if (session.isSqlite()) {
              expect(res.isRejected()).to.equal(false);
              // SQlite is happy with whatever crap.
              return;
            }

            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(DBError);
            expect(error).to.be.a(DataError);
          });
      });

      it('dateTime (invalid date)', () => {
        return Bluebird.resolve(knex(table).insert({ date_time: '2017-13-04' }))
          .reflect()
          .then((res) => {
            logError(res);

            if (session.isSqlite()) {
              expect(res.isRejected()).to.equal(false);
              // SQlite is happy with whatever crap.
              return;
            }

            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(DBError);
            expect(error).to.be.a(DataError);
          });
      });

      it('string (too long)', () => {
        return Bluebird.resolve(knex(table).insert({ string: '12345678912' }))
          .reflect()
          .then((res) => {
            logError(res);

            if (session.isSqlite()) {
              expect(res.isRejected()).to.equal(false);
              // SQlite is happy with whatever crap.
              return;
            }

            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(DBError);
            expect(error).to.be.a(DataError);
          });
      });

      it('integer (invalid)', () => {
        return Bluebird.resolve(knex(table).insert({ int: 'lol' }))
          .reflect()
          .then((res) => {
            logError(res);

            if (session.isSqlite()) {
              expect(res.isRejected()).to.equal(false);
              // SQlite is happy with whatever crap.
              return;
            }

            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(DBError);
            expect(error).to.be.a(DataError);
          });
      });
    });
  });
};
