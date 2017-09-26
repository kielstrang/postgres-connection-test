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

const name = process.argv[2];

function getPeopleByName(knex) {
  return (name, cb) => {
    knex.select().from('famous_people').where('first_name', '=', name).orWhere('last_name', '=', name).asCallback((err, rows) => {
      if(err) {
        return console.error('error running query', err);
      }
      let people = [];
      rows.forEach(person => {
        person.birthdate = new Date(person.birthdate).toISOString().split('T')[0];
        people.push(person);
      });
      cb(name, people);
      knex.destroy();
    });
  };
}

function printPeopleByName(name, people) {
  console.log(`Found ${people.length} person(s) by the name '${name}'`);
  people.forEach((person) => {
    console.log(`- ${person.id}: ${person.first_name} ${person.last_name}, born ${person.birthdate}`);
  });
}

getPeopleByName(knex)(name, printPeopleByName);