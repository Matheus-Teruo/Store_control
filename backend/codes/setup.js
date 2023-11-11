const database = require("../src/database");

database('users')
  .insert({
    'username': "root",
    'password': '$2a$10$w4e5kK3mZfbbVFJWGFO/ruZCNlHm0oeqvlPDYrf0DaGDJ2B0ifR8u',
    'salt': '$2a$10$w4e5kK3mZfbbVFJWGFO/ru',
    'fullname': "Root User",
    'superuser': 1
  })
  .then(() => {
    console.log('Create SuperUser:');
    console.log('Username: root');
    console.log('Password: root5007');
    database('associations')
    .insert({
      'associationID': 1,
      'association': "Caixa",
      'principal': "Root"
    })
    .then(() => {
      console.log(`Created association: Cashier`);
      database('stands')
        .insert({
          'standID': 1,
          'stand': "Caixa",
          'associationID': 1
        })
        .then(() => {
          console.log(`Created stand: Cashier`);
          database('stands')
            .insert({
              'standID': 2,
              'stand': "Caixa Direto",
              'associationID': 1
            })
            .then(() => {
              console.log(`Created stand: Cashier Direct`);
              database('cards')
                .insert({'cardID': 111111111111, 'debit': 0})
                .then(() => {
                  console.log(`Created card: 111111111111`);
                  database.destroy();
                })
                .catch(error => {
                  console.error('Error on create card value:', error);
                  database.destroy();
                })
            })
            .catch(error => {
              console.error('Error on create cashier direct stand value:', error);
              database.destroy();
            })
        })
        .catch(error => {
          console.error('Error on create cashier stand value:', error);
          database.destroy();
        })
    })
    .catch(error => {
      console.error('Error on create cashier association value:', error)
      database.destroy();
    })
  })
  .catch((error) => {
    console.error('Error on create setup superuser value:', error);
    database.destroy();
  });