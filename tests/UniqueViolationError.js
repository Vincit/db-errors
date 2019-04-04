const expect = require('expect.js');
const Promise = require('bluebird');

const { tables, logError } = require('../testUtils');
const { wrapError, DBError, UniqueViolationError, ConstraintViolationError } = require('../');

module.exports = (session) => {
  const knex = session.knex;
  const table = 'theTable';

  describe('unique violation error', () => {

    tables(session, [{
      name: table,

      build: (table) => {
        table.increments('id');
        table.integer('i_am_unique_col').unique();
        table.string('uniquePart1');
        table.string('uniquePart2');
        table.unique(['uniquePart1', 'uniquePart2']);
      }
    }]);

    describe('insert', () => {

      it('single column', () => {
        return Promise.mapSeries([
          {i_am_unique_col: 1},
          {i_am_unique_col: 1}
        ], row => {
          return knex(table).insert(row);
        }).reflect().then(res => {
          logError(res);

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          expect(error).to.be.a(DBError);
          expect(error).to.be.a(ConstraintViolationError);
          expect(error).to.be.an(UniqueViolationError);

          if (session.isPostgres() || session.isSqlite()) {
            expect(error.columns).to.eql(['i_am_unique_col']);
            expect(error.table).to.equal(table);
          }

          if (session.isPostgres() || session.isMySql()) {
            expect(error.constraint).to.equal('thetable_i_am_unique_col_unique');
          }

          if (session.isMssql()) {
            expect(error.table).to.equal(table);
            expect(error.constraint).to.equal('thetable_uniquepart1_uniquepart2_unique');
          }
        });
      });

      it('multiple columns', () => {
        return Promise.mapSeries([
          {uniquePart1: 'x', uniquePart2: 'y', i_am_unique_col: 1},
          {uniquePart1: 'x', uniquePart2: 'y', i_am_unique_col: 2}
        ], row => {
          return knex(table).insert(row);
        }).reflect().then(res => {
          logError(res);

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          expect(error).to.be.an(UniqueViolationError);

          if (session.isPostgres() || session.isSqlite()) {
            expect(error.columns).to.eql(['uniquePart1', 'uniquePart2']);
            expect(error.table).to.equal(table);
          }

          if (session.isPostgres() || session.isMySql()) {
            expect(error.constraint).to.equal('thetable_uniquepart1_uniquepart2_unique');
          }

          if (session.isMssql()) {
            expect(error.schema).to.equal('dbo');
            expect(error.table).to.equal(table);
            expect(error.constraint).to.equal('thetable_uniquepart1_uniquepart2_unique');
          }
        });
      });

    });

    describe('update', () => {

      it('single column', () => {
        return Promise.mapSeries([
          knex(table).insert({i_am_unique_col: 1}),
          knex(table).insert({i_am_unique_col: 2}),
          knex(table).update({i_am_unique_col: 1}).where('i_am_unique_col', 2)
        ], it => it).reflect().then(res => {
          logError(res);

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          expect(error).to.be.an(UniqueViolationError);

          if (session.isPostgres() || session.isSqlite()) {
            expect(error.columns).to.eql(['i_am_unique_col']);
            expect(error.table).to.equal(table);
          }

          if (session.isPostgres() || session.isMySql()) {
            expect(error.constraint).to.equal('thetable_i_am_unique_col_unique');
          }

          if (session.isMssql()) {
            expect(error.schema).to.equal('dbo');
            expect(error.table).to.equal(table);
            expect(error.constraint).to.equal('thetable_uniquepart1_uniquepart2_unique');
          }
        });
      });

      it('single column subquery', () => {
        return Promise.mapSeries([
          knex(table).insert({i_am_unique_col: 1}),
          knex(table).insert({i_am_unique_col: 2}),
          knex(table).update({i_am_unique_col: knex.raw('i_am_unique_col - 1')}).where('i_am_unique_col', 2)
        ], it => it).reflect().then(res => {
          logError(res);

          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          expect(error).to.be.an(UniqueViolationError);

          if (session.isPostgres() || session.isSqlite()) {
            expect(error.columns).to.eql(['i_am_unique_col']);
            expect(error.table).to.equal(table);
          }

          if (session.isPostgres() || session.isMySql()) {
            expect(error.constraint).to.equal('thetable_i_am_unique_col_unique');
          }

          if (session.isMssql()) {
            expect(error.schema).to.equal('dbo');
            expect(error.table).to.equal(table);
            expect(error.constraint).to.equal('thetable_uniquepart1_uniquepart2_unique');
          }
        });
      });

    });

  });
};