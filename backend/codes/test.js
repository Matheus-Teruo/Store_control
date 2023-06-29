const database = require('../src/database');

database('users')
  .join('stands', 'users.standID', 'stands.standID')
  .join('associations', 'stands.associationID', 'associations.associationID')
  .select("users.username", "users.fullname", "associations.association", "stands.stand")
  .where({userID: 1})
  .then(rows => {
    console.log(rows)
    const row  = rows[0];
    console.log(row)})
  .catch((error) => {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  });