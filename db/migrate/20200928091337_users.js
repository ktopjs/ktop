// http://knexjs.org/#Schema-createTable
// http://knexjs.org/#Migrations
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id').unsigned().primary()
      table.string('mobile', 11).notNullable()
      // http://knexjs.org/#Schema-enum
      table.enum('gender', ['male', 'female'])
      table.text('decription').nullable()
      // timestamps
      table.timestamps()

      table.index([ 'mobile' ])
      // table.dropIndex([ 'mobile' ])
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable("users")
}

exports.config = { transaction: true }
