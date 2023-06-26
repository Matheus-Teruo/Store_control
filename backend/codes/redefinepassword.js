const readline = require('readline');
const database = require("../src/database");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Digite o usuario para mudar a senha: ', (answer) => {
  database('users')
    .where({'username': answer})
    .update({ password: "$2a$10$WQIrA4naM1x3cKgxdx.nJ.hh40QFDCPe0YQeWBbfF5LrVzaVYqRlq",
              salt: "$2a$10$WQIrA4naM1x3cKgxdx.nJ."})
    .then(() => {
      console.log(`User ${answer} redefined password`);
      database.destroy();
    })
    .catch((error) => {
      console.error('Error redefining password: ', error);
      database.destroy();
    });
  rl.close();
});