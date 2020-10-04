// http://knexjs.org/#Migrations
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id')
      table.string('mobile', 11).notNullable()
      // timestamps
      table.timestamps()
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable("users")
}

exports.config = { transaction: true }
