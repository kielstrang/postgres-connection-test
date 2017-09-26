const pg = require('pg');
const settings = require('./settings');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : settings.hostname,
    user : settings.user,
    password : settings.password,
    database : settings.database
  }
});
function addPerson(knex) {
  return (person) => {
    console.log(person);
    knex.insert(person).into('famous_people').asCallback((err, rows) => {
      if(err) {
        return console.error('error running query', err);
      }
      knex.destroy();
    });
  };
}

const person = {
  first_name: process.argv[2],
  last_name: process.argv[3],
  birthdate: process.argv[4]
};

addPerson(knex)(person);