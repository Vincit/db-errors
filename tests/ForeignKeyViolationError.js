'use strict';

const tables = require('../testUtils').tables;
const expect = require('expect.js');
const Promise = require('bluebird');
const wrapError = require('../').wrapError;

const DBError = require('../').DBError;
const ForeignKeyViolationError = require('../').ForeignKeyViolationError;
const ConstraintViolationError = require('../').ConstraintViolationError;

module.exports = (session) => {
  const knex = session.knex;
  const sourceTable = 'source';
  const targetTable = 'target';

  describe('foreign key violation error', () => {

    tables(session, [{
      name: targetTable,
      deleteIndex: 1,

      build: (table) => {
        table.increments('id');
        table.integer('value');
      }
    }, {
      name: sourceTable,
      deleteIndex: 0,

      build: (table) => {
        table.increments('id');
        table.integer('foreign_key').unsigned().references('target.id');
        table.integer('foreignKey').unsigned().references('target.id');
      }
    }]);

    describe('insert', () => {

      it('snake_case column', () => {
        return knex(sourceTable)
          .insert({foreign_key: 123456})
          .reflect()
          .then(res => {
            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(DBError);
            expect(error).to.be.a(ConstraintViolationError);
            expect(error).to.be.a(ForeignKeyViolationError);

            if (session.isPostgres() || session.isMySql()) {
              expect(error.table).to.equal('source');
              expect(error.constraint).to.equal('source_foreign_key_foreign');
            }
          });
      });

      it('camelCase column', () => {
        return knex(sourceTable)
          .insert({foreignKey: 123456})
          .reflect()
          .then(res => {
            expect(res.isRejected()).to.equal(true);
            const error = wrapError(res.reason());

            expect(error).to.be.a(ForeignKeyViolationError);

            if (session.isPostgres() || session.isMySql()) {
              expect(error.table).to.equal('source');
              expect(error.constraint).to.equal('source_foreignkey_foreign');
            }
          });
      });

    });

    describe('update', () => {

      it('snake_case column', () => {
        return knex(targetTable).insert({value: 1}).returning('id').then(ids => {
          return knex(sourceTable).insert({foreign_key: ids[0]}).returning('id');
        }).then(ids => {
          return knex(sourceTable).update({foreign_key: 123456}).where('id', ids[0]);
        }).reflect().then(res => {
          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          expect(error).to.be.a(ForeignKeyViolationError);

          if (session.isPostgres() || session.isMySql()) {
            expect(error.table).to.equal('source');
            expect(error.constraint).to.equal('source_foreign_key_foreign');
          }
        });
      });

      it('camelCase column', () => {
        return knex(targetTable).insert({value: 1}).returning('id').then(ids => {
          return knex(sourceTable).insert({foreignKey: ids[0]}).returning('id');
        }).then(ids => {
          return knex(sourceTable).update({foreignKey: 123456}).where('id', ids[0]);
        }).reflect().then(res => {
          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          expect(error).to.be.a(ForeignKeyViolationError);

          if (session.isPostgres() || session.isMySql()) {
            expect(error.table).to.equal('source');
            expect(error.constraint).to.equal('source_foreignkey_foreign');
          }
        });
      });

    });

    describe('delete', () => {

      it('snake_case column', () => {
        return knex(targetTable).insert({value: 1}).returning('id').then(ids => {
          return knex(sourceTable).insert({foreign_key: ids[0]}).then(() => ids[0]);
        }).then(foreignKey => {
          return knex(targetTable).delete().where('id', foreignKey);
        }).reflect().then(res => {
          expect(res.isRejected()).to.equal(true);
          const error = wrapError(res.reason());

          expect(error).to.be.a(ForeignKeyViolationError);

          if (session.isPostgres() || session.isMySql()) {
            expect(error.table).to.equal('source');
            expect(error.constraint).to.equal('source_foreign_key_foreign');
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