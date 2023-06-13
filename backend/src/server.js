// simple node web server that displays hello world
// optimized for Docker image

const express = require("express");
// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.

const morgan = require("morgan");
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

const database = require("./database");

// Appi
const app = express();

app.use(morgan("common"));

// GET

app.get("/", function(req, res, next) {
  database.raw('select VERSION() version')
    .then(([rows, columns]) => rows[0])
    .then((row) => res.json({ message: `Hello from MySQL ${row.version}` }))
    .catch(next);
});

app.get("/healthz", function(req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send("I am happy and healthy\n");
});

app.get("/db", function(req, res, next) {
  database.raw('show tables')
    .then(([a, b]) => a)
    .then((tables) => res.json({ message: `tables array: ${tables}` }) )
    .catch(next);
});

// POST

app.use(express.json());

app.post("/signup", (req, res) => {
  const data = req.body;
  // console.log(data)
  database('usuarios')
    .insert({ usuario: data.username,
              senha: data.password,
              salt: data.salt,
              nome: data.fullname})
    .then(() => {
      console.log("successful user register")
      res.status(201).json({ message: `successful sing-up as user: ${data.username}`});
    })
    .catch(error => {
      console.error(error)
      if (error.errno === 1062){
        const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
        if (column === "usuario"){
          res.status(409).json({ error: `error on sing-up user: ${data.username}`, column: column});
        } else {
          res.status(409).json({ error: `error on sing-up user: ${data.username}`, column: column});
        }
      } else{
        res.status(501).json({ error: {error}});
      }
    })
})

app.post("/prelogin", (req, res) => {
  const data = req.body;
  // console.log(data)
  database(data.username)
    .select('salt')
    .where({ usuario: data.username })
    .then(rows => {
      if (rows.length !== 0) {
        console.log(row)
        const [ salt ] = rows[0];
        console.log('Salt:', salt);
        res.json({ salt: salt })
      } else {
        console.log('User not found.');
        res.status(401).json({})
      }
    })
    .catch(error => {
      console.error(error);
      res.status(501).json({ error: {error}});
    })
})

module.exports = app;
