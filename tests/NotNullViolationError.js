const expect = require('expect.js');
const Promise = require('bluebird');

const { tables, logError } = require('../testUtils');
const { wrapError, DBError, NotNullViolationError, ConstraintViolationError } = require('../');

module.exports = (session) => {
  const knex = session.knex;
  const table = 'theTable';

  describe('not null violation error', () => {

    tables(session, [{
      name: table,

      build: (table) => {
        table.increments('id');
        table.integer('not_nullable').notNullable();
        table.string('notNullableString').notNullable();
      }
    }]);

    describe('insert', () => {

      it('snake_case column', () => {
        return knex(table)
          .insert({not_nullable: null, notNullableString: 'foo'})
          .reflect()
          .then(res => {
            logError(res);

            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(DBError);
            expect(error).to.be.a(ConstraintViolationError);
            expect(error).to.be.a(NotNullViolationError);

            expect(error.column).to.eql('not_nullable');

            if (session.isPostgres() || session.isSqlite()) {
              expect(error.table).to.equal(table);
            }
          });
      });

      it('camelCase column', () => {
        return knex(table)
        .insert({notNullableString: null, not_nullable: 1})
        .reflect()
        .then(res => {
          logError(res);

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          expect(error).to.be.a(DBError);
          expect(error).to.be.a(ConstraintViolationError);
          expect(error).to.be.a(NotNullViolationError);

          expect(error.column).to.eql('notNullableString');

          if (session.isPostgres() || session.isSqlite()) {
            expect(error.table).to.equal(table);
          }
        });
      });

    });

    describe('update', () => {

      it('snake_case column', () => {
        return Promise.mapSeries([
          knex(table).insert({not_nullable: 1, notNullableString: 'foo'}),
          knex(table).update({not_nullable: null}).where('not_nullable', 1)
        ], it => it).reflect().then(res => {
          logError(res);

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          expect(error).to.be.a(DBError);
          expect(error).to.be.a(ConstraintViolationError);
          expect(error).to.be.a(NotNullViolationError);

          expect(error.column).to.eql('not_nullable');

          if (session.isPostgres() || session.isSqlite()) {
            expect(error.table).to.equal(table);
          }
        });
      });

      it('camelCase column', () => {
        return Promise.mapSeries([
          knex(table).insert({not_nullable: 1, notNullableString: 'foo'}),
          knex(table).update({notNullableString: null}).where('notNullableString', 'foo')
        ], it => it).reflect().then(res => {
          logError(res);

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          expect(error).to.be.a(DBError);
          expect(error).to.be.a(ConstraintViolationError);
          expect(error).to.be.a(NotNullViolationError);
          expect(error.column).to.eql('notNullableString');

          if (session.isPostgres() || session.isSqlite()) {
            expect(error.table).to.equal(table);
          }
        });
      });

    });

  });
};