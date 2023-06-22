const readline = require('readline');
const database = require("../src/database");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Escolha um usuario para dar permissão super user: ', (answer) => {
  database('users')
    .where({'username': answer})
    .update({ superuser: 1 })
    .then(() => {
      console.log('Superuser value updated successfully');
      database.destroy();
    })
    .catch((error) => {
      console.error('Error updating superuser value:', error);
      database.destroy();
    });
  rl.close();
});