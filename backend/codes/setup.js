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
              'stand': "Caixa Entrega",
              'associationID': 1
            })
            .then(() => {
              console.log(`Created stand: Cashier Delivery`);
              database.destroy();
            })
            .catch(error => {
              console.error('Error on create cashier stand value:', error);
              database.destroy();
            })

          database.destroy();
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