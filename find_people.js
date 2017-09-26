const pg = require('pg');
const settings = require('./settings');

const client = new pg.Client({
  user: settings.user,
  password: settings.password,
  database: settings.database,
  host: settings.hostname,
  port: settings.port,
  ssl: settings.ssl
});

const name = process.argv[2];

function getPeopleByName(client) {
  return (name, cb) => {
    client.query('SELECT * FROM famous_people WHERE (first_name=$1) OR (last_name=$1)', [name], (err, result) => {
      if(err) {
        return console.error('error running query', err);
      }
      let people = [];
      result.rows.forEach(person => {
        person.birthdate = new Date(person.birthdate).toISOString().split('T')[0];
        people.push(person);
      });
      cb(name, people);
    });
  };
}

function printPeopleByName(name, people) {
  console.log(`Found ${people.length} person(s) by the name '${name}'`);
  people.forEach((person) => {
    console.log(`- ${person.id}: ${person.first_name} ${person.last_name}, born ${person.birthdate}`);
  });
  client.end();
}

client.connect((err) => {
  if(err) {
    return console.error('Connection Error', err);
  }
  getPeopleByName(client)(name, printPeopleByName);
});