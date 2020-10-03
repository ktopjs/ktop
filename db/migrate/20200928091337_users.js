// http://knexjs.org/#Migrations
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id')
      table.string('mobile', 11).notNullable()
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable("users")
}
