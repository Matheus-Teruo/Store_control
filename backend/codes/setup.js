const database = require("../src/database");

database('users')
  .insert({
    'username': "root",
    'password': '$2a$10$w4e5kK3mZfbbVFJWGFO/ruZCNlHm0oeqvlPDYrf0DaGDJ2B0ifR8u',
    'salt': '$2a$10$w4e5kK3mZfbbVFJWGFO/ru',
    'fullname': "root user",
    'superuser': 1
  })
  .then(() => {
    console.log('Create SuperUser:');
    console.log('Username: root');
    console.log('Password: root5007');
    database.destroy();
  })
  .catch((error) => {
    console.error('Error updating superuser value:', error);
    database.destroy();
  });