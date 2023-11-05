const readline = require('readline');
const database = require("../src/database");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Digite o usuario para mudar a senha: ', (answer) => {
  database('users')
    .where({'username': answer})
    .update({ password: "$2a$10$EvPe8vrcVcE6fdXarQ1F1uJOghkZHuZwU.1gfpVbPi8Edm1WT73fO",
              salt: "$2a$10$EvPe8vrcVcE6fdXarQ1F1u"})
    .then(() => {
      console.log(`User ${answer} redefined password para changeme123`);
      database.destroy();
    })
    .catch((error) => {
      console.error('Error redefining password: ', error);
      database.destroy();
    });
  rl.close();
});