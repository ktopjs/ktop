const application = require('../../config/application')
const { User } = application.models
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(async function () {
      // Inserts seed entries
      // return knex('users').insert([
      //   {id: 1, mobile: '12312312311', created_at: new Date(), updated_at: new Date()},
      //   {id: 2, mobile: '12312312312', created_at: new Date(), updated_at: new Date()},
      // ]);
      await User.create({mobile: '12312312311'})
      await User.create({mobile: '12312312312'})
    });
};
