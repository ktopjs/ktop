exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, mobile: '12312312311'},
        {id: 2, mobile: '12312312312'},
        {id: 3, mobile: '12312312313'}
      ]);
    });
};
