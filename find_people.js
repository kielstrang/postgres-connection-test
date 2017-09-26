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

client.connect((err) => {
  if(err) {
    return console.error('Connection Error', err);
  }
  client.query('SELECT * FROM famous_people WHERE (first_name=$1) OR (last_name=$1)', [name], (err, result) => {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(`Found ${result.rows.length} person(s) by the name '${name}`);
    result.rows.forEach((person) => {
      const date = new Date(person.birthdate).toISOString().split('T')[0];
      console.log(`- ${person.id}: ${person.first_name} ${person.last_name}, born ${date}`);
    });
    client.end();
  });
});