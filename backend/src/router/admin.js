const express = require("express");
const database = require("../database");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const router = express();
router.use(express.json());
router.use(morgan("common"));
router.use(cookieParser());

router.get("/listallstands", (req, res) => {  // Check user
  console.log('lista')
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      database('kenjinkais')
        .select('kenjinkai', 'kenjinkaiID', "principal")
        .orderBy('kenjinkaiID', 'asc')
        .then(kenjinkais => {
          if (kenjinkais.length > 0) {
            database('stands')
              .select('standID', 'observation', 'kenjinkaiID')
              .orderBy('kenjinkaiID', 'asc')
              .then(stands => {
                if (stands.length > 0){
                  res.json({kenjinkais: kenjinkais, stands: stands}); 
                } else {
                  res.json({kenjinkais: kenjinkais, stands: []});
                }
              })
            } else {
              res.json({kenjinkais: [], stands: []});
            }
          })
    }
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
})

router.post("/newkenjinkai", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      const data = req.body;
      database('kenjinkais')
        .insert(data)
        .then(() => {
          console.log(`successful created kenjinkai: ${data.kenjinkai}`);
          res.json({message: `successful created kenjinkai: ${data.kenjinkai}`});
        })
        .catch(error => {
          console.error(error)
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            if (column === "kenjinkai"){
              return res.status(409).json({error: `error on sing-up kenjinkai '${data.kenjinkai}'. Kenjinkai '${data.kenjinkai}' already exist`, column: column, value: data.kenjinkai});
            }
          } else {
            return res.status(501).json({ error: {error}});
          }
        })
    }
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
})

router.post("/newstand", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.suerperuser) {
      const data = req.body;
      database('stands')
        .insert(data)
        .then(() => {
          console.log(`successful created stand: ${data.observation}`);
          res.json({message: `successful created kenjinkai: ${data.observation}`});
        })
    }
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
})

module.exports = router;