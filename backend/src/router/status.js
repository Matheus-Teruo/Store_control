const express = require("express");
const database = require("../database");

const router = express();

router.get("/", function(req, res, next) {
  database.raw('select VERSION() version')
    .then(([rows, columns]) => rows[0])
    .then((row) => res.json({ message: `Hello from MySQL ${row.version}` }))
    .catch(next);
});
  
router.get("/healthz", function(req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send("I am happy and healthy\n");
});
  
router.get("/db", function(req, res, next) {
  database.raw('show tables')
    .then(([a, b]) => a)
    .then((tables) => res.json({ message: `tables array: ${tables}` }) )
    .catch(next);
});

module.exports = router;