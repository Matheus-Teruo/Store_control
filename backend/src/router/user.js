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
// auth_content
router.get("/checkuser", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    return res.json({authenticated: true, firstname: decoded.firstname, superuser: decoded.superuser});
  } catch(err) {
    return res.json({authenticated: false});
  }
})
// Home
router.get("/user", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('users')
      .select("username", "fullname", "standID")
      .where({userID: decoded.userID})
      .then(rows => {
        const row  = rows[0];
        if (row.standID !== null){
          database('stands')
            .select('stands.stand', 'stands.associationID', 'associations.association')
            .join('associations', 'stands.associationID', 'associations.associationID')
            .where({'stands.standID': row.standID})
            .then(stands => {
              const stand = stands[0]
              return res.json({username: row.username, fullname: row.fullname, superuser: decoded.superuser, standID: row.standID, association: stand.association, stand: stand.stand});
            })
        } else {
          return res.json({username: row.username, fullname: row.fullname, superuser: decoded.superuser, standID: row.standID, association: "", stand: ""});
        }
      })
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
})
// Sing up
router.post("/signup", (req, res) => {  // Sign up request
  const data = req.body;
  const firstname = data.fullname.split(' ')[0];
  database('users')
    .insert(data)
    .then(() => {
      console.log(`successful user register as: ${data.username}`);
      database('users')
        .select('userID')
        .where({username: data.username})
        .then(rows => {
          const row  = rows[0];
          res.cookie("jwt", createToken({userID: row.userID, firstname: firstname, superuser: 0}), { httpOnly: true, maxAge: maxAge * 1000 });
          return res.status(201).json({ message: `successful sing-up as user: ${data.username}`});
    })
    })
    .catch(error => {
      console.error(error)
      if (error.errno === 1062){  // Duplication error
        const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
        if (column === "username"){
          return res.status(409).json({error: `error on sing-up user '${data.username}'. Username '${data.username}' already exist`, column: column, value: data.username});
        } else {
          return res.status(409).json({error: `error on sing-up user: '${data.username}'. Fullname '${data.fullname}' already exist`, column: column, value: data.fullname});
        }
      } else{
        return res.status(501).json({ error: {error}});
      }
    })
})
// Login
router.post("/prelogin", (req, res) => {  // Username check
  const data = req.body;
  database('users')
    .select('salt', 'standID')
    .where(data)
    .then(rows => {
      if (rows.length !== 0) {
        const row  = rows[0];
        return res.json({ salt: row.salt })
      } else {
        console.log(`User not found: ${data.username}`);
        return res.status(401).json({message: "user not found"});
      }
    })
    .catch(error => {
      console.error(error);
      return res.status(501).json(error);
    })
})

router.post("/login", (req, res) => {  // Log in request
  const data = req.body;
  database('users')
    .select('userID', 'password', 'fullname', 'superuser')
    .where({username: data.username })
    .then(rows => {
      const row  = rows[0];
      if (row.password === data.password) {
        const firstname = row.fullname.split(' ')[0];
        console.log(`successful user log-in as: ${data.username}`);
        res.cookie("jwt", createToken({userID: row.userID, firstname: firstname, superuser: row.superuser}), { httpOnly: true, maxAge: maxAge * 1000 });
        return res.status(200).json({message: `successful log-in as user: ${data.username}`});
      } else {
        console.log(`Password incorrect from user: ${data.username}`);
        return res.status(401).json({message: "password incorrect"})
      }
    })
    .catch(error => {
      console.error(error);
      return res.status(501).json(error);
    })
})
// auth_content
router.post("/logout", (req, res) => {  // Log out user
  try {
    res.clearCookie('jwt')
    return res.status(200).end()
  } catch(err) {
    return res.status(501).json(error);
  }
})
// User
router.post("/editusername", (req, res) => {  // Edit username
  const data = req.body;
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('users')
      .where({userID: decoded.userID})
      .update({username: data.username})
      .then(() => {
        console.log(`username successfull update to: ${data.username}`)
        return res.json({message: `username successfull update to: ${data.username}`, username: data.username});
      })
      .catch(error => {
        if (error.errno === 1062){  // Duplication error
          const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
          return res.status(409).json({error: `Username '${data.username}' already exist`, column: column, value: data.username});
        } else{
          return res.status(501).json({ error: {error}});
        }
      })
  } catch(err) {
    return res.status(501).json({message: `change error`});
  }
})

router.post("/editfullname", (req, res) => {  // Edit fullname
  const data = req.body;
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('users')
      .where({userID: decoded.userID})
      .update({fullname: data.fullname })
      .then(() => {
        const firstname = data.fullname.split(' ')[0];
        res.cookie("jwt", createToken({userID: decoded.userID, firstname: firstname, superuser: decoded.superuser}), { httpOnly: true, maxAge: maxAge * 1000 });
        return res.json({message: `fullname successfull update to: ${data.fullname}`, fullname: data.fullname});
      })
      .catch(error => {
        if (error.errno === 1062){  // Duplication error
          const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
          return res.status(409).json({error: `Fullname '${data.fullname}' already exist`, column: column, value: data.fullname});
        } else{
          return res.status(501).json({ error: {error}});
        }
      })
  } catch(err) {
    return res.status(501).json({message: `change error`});
  }
})

router.post("/preeditpassword", (req, res) => {  // Take the salt value
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('users')
      .select('salt')
      .where({userID: decoded.userID})
      .then(rows => {
        if (rows.length !== 0) {
          const row  = rows[0];
          return res.json({ salt: row.salt })
        } else {
          console.log(`Server error`);
          return res.status(401).json({message: "user not found"});
        }
      })
  } catch(err) {
    return res.status(401).json({message: `change error`});
  }
})

router.post("/editpassword", (req, res) => {  // Check password and change
  const data = req.body;
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('users')
      .select('password')
      .where({userID: decoded.userID })
      .then(rows => {
        if (rows.length !== 0) {
          const row  = rows[0];
          if (row.password === data.password){
            database('users')
              .where({userID: decoded.userID})
              .update({password: data.newpassword, salt: data.salt})
              .then(() => {
                return res.json({message: `password successfull update`})});
          } else {
            console.log(`Password incorrect`);
            return res.status(401).json({message: "password incorrect"})
          }
        }
      })
  } catch(err) {
    return res.status(401).json({message: `change error`});
  }
})

module.exports = router;