const express = require("express");
const database = require("../database");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const router = express();
router.use(express.json());
router.use(morgan("common"));
router.use(cookieParser());

const maxAge = 3 * 24 * 60 * 60;

const createToken = (payload) => {
  return jwt.sign({payload}, process.env.SECRET_TOKEN, {expiresIn: maxAge})
}

router.post("/signup", (req, res) => {  // Sign up request
  const data = req.body;
  database('users')
    .insert(data)
    .then(() => {
      console.log(`successful user register as: ${data.username}`);
      res.cookie("jwt", createToken({ID: data.username, fullname: data.fullname, superuser: false}), { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ message: `successful sing-up as user: ${data.username}`});
    })
    .catch(error => {
      console.error(error)
      if (error.errno === 1062){  // Duplication error
        const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
        if (column === "username"){
          res.status(409).json(
            { error: `error on sing-up user '${data.username}'. Username '${data.username}' already exist`, column: column, value: data.username});
        } else {
          res.status(409).json(
            { error: `error on sing-up user: '${data.username}'. Fullname '${data.fullname}' already exist`, column: column, value: data.fullname});
        }
      } else{
        res.status(501).json({ error: {error}});
      }
    })
})

router.post("/prelogin", (req, res) => {  // Username check
  const data = req.body;
  database('users')
    .select('salt')
    .where(data)
    .then(rows => {
      if (rows.length !== 0) {
        const row  = rows[0];
        res.json({ salt: row.salt })
      } else {
        console.log(`User not found: ${data.username}`);
        res.status(401).json({message: "user not found"});
      }
    })
    .catch(error => {
      console.error(error);
      res.status(501).json(error);
    })
})

router.post("/login", (req, res) => {  // Log in request
  const data = req.body;
  database('users')
    .select('password', 'fullname', 'superuser')
    .where({ username: data.username })
    .then(rows => {
      const row  = rows[0];
      if (row.password === data.password) {
        console.log(`successful user log-in as: ${data.username}`);
        res.cookie("jwt", createToken({ID: data.username, fullname: row.fullname, superuser: row.superuser}), { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({message: `successful log-in as user: ${data.username}`, fullname: row.fullname});
      } else {
        res.status(401).json({message: "password incorrect"})
      }
    })
    .catch(error => {
      console.error(error);
      res.status(501).json(error);
    })
})

module.exports = router;