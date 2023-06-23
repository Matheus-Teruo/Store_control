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

router.get("/checkuser", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    res.json({authenticated: true, firstname: decoded.firstname});
  } catch(err) {
    res.json({authenticated: false});
  }
})

router.get("/user", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('users')
      .select("username", "fullname", "standID")
      .where({userID: decoded.userID})
      .then(rows => {
        const row  = rows[0];
        if (row.standID !== null){
          res.json({username: row.username, fullname: row.fullname, superuser: decoded.superuser, standID: row.standID});
        } else {
          res.json({username: row.username, fullname: row.fullname, superuser: decoded.superuser, standID: null});
        }
      })
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
})

router.get("/liststand", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('kenjinkais')
      .select('kenjinkai', 'kenjinkaiID')
      .orderBy('kenjinkaiID', 'asc')
      .then(kenjinkais => {
        console.log("kenjinkais")
        console.log(kenjinkais)
        if (kenjinkais.length > 0) {
          console.log("kenjinkais")
          console.log(kenjinkais)
          database('stands')
            .select('standID', 'stand', 'kenjinkaiID')
            .orderBy('kenjinkaiID', 'asc')
            .then(stands => {
              if (stands.length > 0){
                console.log("stands")
                console.log(stands)
                const kens = [];
                for (const x of kenjinkais) {
                    const aux1 = [];
                    for (const y of stands) {
                        if (x.kenjinkaiID === y.kenjinkaiID) {
                            aux1.push({"stand": y.stand, "standID": y.standID});
                        }
                    }
                    kens.push({"kenjinkai": x.kenjinkai, "stands": aux1});
                }
                res.json(kens); 
              } else {
                const kens = [];
                for (const x of kenjinkais) {
                    kens.push({"kenjinkai": x.kenjinkai, "stands": []});
                }
                res.json(kens);
              }
            })
        } else {
          res.json([]);
        }
      })
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
})

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
          res.status(201).json({ message: `successful sing-up as user: ${data.username}`});
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

router.post("/prelogin", (req, res) => {  // Username check
  const data = req.body;
  database('users')
    .select('salt', 'standID')
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
    .select('userID', 'password', 'fullname', 'superuser')
    .where({username: data.username })
    .then(rows => {
      const row  = rows[0];
      if (row.password === data.password) {
        const firstname = row.fullname.split(' ')[0];
        console.log(`successful user log-in as: ${data.username}`);
        res.cookie("jwt", createToken({userID: row.userID, firstname: firstname, superuser: row.superuser}), { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({message: `successful log-in as user: ${data.username}`});
      } else {
        console.log(`Password incorrect from user: ${data.username}`);
        res.status(401).json({message: "password incorrect"})
      }
    })
    .catch(error => {
      console.error(error);
      res.status(501).json(error);
    })
})

router.post("/logout", (req, res) => {  // Log out user
  try {
    res.clearCookie('jwt')
    res.status(200).end()
  } catch(err) {
    res.status(501).json(error);
  }
})

router.post("/newusername", (req, res) => {  // Log in request
  const data = req.body;
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('users')
      .where({userID: decoded.userID})
      .update({username: data.username })
      .then(() => {
        res.json({message: `username successfull update to: ${data.username}`, username:data.username});
      })
  } catch(err) {
    res.status(401).json({message: `change error`});
  }
})

router.post("/newfullname", (req, res) => {  // Log in request
  const data = req.body;
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('users')
      .where({userID: decoded.userID})
      .update({fullname: data.fullname })
      .then(() => {
        const firstname = data.fullname.split(' ')[0];
        res.cookie("jwt", createToken({userID: decoded.userID, firstname: firstname, superuser: decoded.superuser}), { httpOnly: true, maxAge: maxAge * 1000 });
        res.json({message: `fullname successfull update to: ${data.fullname}`, fullname: data.fullname});
      })
  } catch(err) {
    res.status(401).json({message: `change error`});
  }
})

router.post("/changestandid", (req, res) => {  // Log in request
  const data = req.body;
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('users')
      .where({userID: decoded.userID})
      .update({standID: data.standID})
      .then(() => {
        res.json({message: `standID successfull update to: ${data.standID}`, standID: data.standID});
      })
  } catch(err) {
    res.status(401).json({message: `change error`});
  }
})

router.post("/prenewpassword", (req, res) => {  // Log in request
  const data = req.body;
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('users')
      .select('salt')
      .where({userID: decoded.userID})
      .then(rows => {
        if (rows.length !== 0) {
          const row  = rows[0];
          res.json({ salt: row.salt })
        } else {
          console.log(`Server error`);
          res.status(401).json({message: "user not found"});
        }
      })
  } catch(err) {
    res.status(401).json({message: `change error`});
  }
})

router.post("/newpassword", (req, res) => {  // Log in request
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
                res.json({message: `password successfull update`})});
          } else {
            console.log(`Password incorrect`);
            res.status(401).json({message: "password incorrect"})
          }
        }
      })
  } catch(err) {
    res.status(401).json({message: `change error`});
  }
})

module.exports = router;