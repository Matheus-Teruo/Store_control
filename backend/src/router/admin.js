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
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      database('kenjinkais')
        .select('kenjinkai', 'kenjinkaiID', "principal")
        .orderBy('kenjinkaiID', 'asc')
        .then(kenjinkais => {
          if (kenjinkais.length > 0) {
            database('stands')
              .select('standID', 'stand', 'kenjinkaiID')
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

router.post("/editkenjinkai", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      const data = req.body;
      database('kenjinkais')
        .where({kenjinkaiID: data.kenjinkaiID})
        .update({kenjinkai: data.kenjinkai, principal: data.principal})
        .then(() => {
          console.log(`successful edited kenjinkai: ${data.kenjinkai}`);
           return res.json({message: `successful edited kenjinkai: ${data.kenjinkai}`});
        })
        .catch(error => {
          console.error(error)
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            if (column === "kenjinkai"){
              return res.status(409).json({error: `error on edit kenjinkai '${data.kenjinkai}'. Kenjinkai '${data.kenjinkai}' already exist`, column: column, value: data.kenjinkai});
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

router.post("/delkenjinkai", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      const data = req.body;
      database('kenjinkais')
        .where({kenjinkaiID: data.kenjinkaiID})
        .del()
        .then(() => {
          console.log(`successful deleted kenjinkai`);
          return res.json({message: `successful deleted kenjinkai`});
        })
        .catch(error => {
          console.error(error)
          return res.status(501).json({ error: {error}});
        })
    }
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
})

router.post("/newstand", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      const data = req.body;
      database('stands')
        .insert(data)
        .then(() => {
          console.log(`successful created stand: ${data.stand}`);
          res.json({message: `successful created kenjinkai: ${data.stand}`});
        })
        .catch(error => {
          console.error(error)
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            if (column === "stand"){
              return res.status(409).json({error: `error on sing-up stand '${data.stand}'. Stand '${data.stand}' already exist`, column: column, value: data.stand});
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

router.post("/editstand", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      const data = req.body;
      database('stands')
        .where({standID: data.standID})
        .update({stand: data.stand, kenjinkaiID: data.kenjinkaiID})
        .then(() => {
          console.log(`successful edited stand: ${data.stand}`);
          res.json({message: `successful edited kenjinkai: ${data.stand}`});
        })
        .catch(error => {
          console.error(error)
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            if (column === "stand"){
              return res.status(409).json({error: `error on edited stand '${data.stand}'. Stand '${data.stand}' already exist`, column: column, value: data.stand});
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

router.post("/delstand", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      const data = req.body;
      database('stands')
        .where({standID: data.standID})
        .del()
        .then(() => {
          console.log(`successful deleted stand`);
          return res.json({message: `successful deleted kenjinkai`});
        })
        .catch(error => {
          console.error(error);
          return res.status(501).json({ error: {error}});
        })
    }
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
})

module.exports = router;