const express = require("express");
const database = require("../database");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../../images")
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${req.body.nameimage}${path.extname(file.originalname)}`)
//   }
// })

const router = express();
router.use(express.json());
router.use(morgan("common"));
router.use(cookieParser());
const upload = multer({storage: storage})

//  Database
router.get("/listallstands", (req, res) => {  // Request all stands and kenjinkais
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

router.post("/newkenjinkai", (req, res) => {  // Create new kenjinkai
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

router.post("/editkenjinkai", (req, res) => {  // Change kenjinkai property
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

router.post("/delkenjinkai", (req, res) => {  // Delete kenjinkai
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

router.post("/newstand", (req, res) => {  // Create new stand
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

router.post("/editstand", (req, res) => {  // Change stands property
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

router.post("/delstand", (req, res) => {  // Delete stand
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
// Inventory
router.get("/inventory", (req, res) => {
  try{
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    const data = req.body;
    database('users')
      .select('stands.standID', 'stands.stand')
      .join('stands', 'users.standID', 'stands.standID')
      .where({userID: decoded.userID})
      .then((rows) => {
        if (rows.length > 0){
          const row = rows[0];
          database('items')
            .select()
            .where({standID: row.standID})
            .then((items) => {
              return res.json({stand: {standID:row.standID ,stand:row.stand}, items: items})
            })
        } else {  // User without stand
          return res.json({stand: {standID:0 ,stand:""}, items: []})
        }
      })
  } catch {  // Error of authenticated
    return res.status(401).json({authenticated: false});
  }
})

router.post("/newitem", (req, res, next) => {  // Create new item
  try{
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    const data = req.body;
      if (decoded.superuser === 1) {
        database('items')
          .insert(data)
          .then(() => {
            console.log(`new item created: ${data.item}`)
            return res.json({message: "new item created"})
          })
          .catch(error => {
            if (error.errno === 1062){  // Duplication error
              const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
              if (column === "stand"){
                return res.status(409).json({error: `error on create item '${data.item}'. Stand '${data.item}' already exist`, column: column, value: data.item});
              }
            } else {
              return res.status(501).json({ error: {error}});
            }
          })
      } else {
        database('users')
          .select('standID')
          .where({userID: decoded.userID})
          .then((rows) => {
            const row = rows[0];
            if (row.standID === data.standID){
              database('items')
                .insert(data)
                .then(() => {
                  console.log(`new item created: ${data.item}`)
                  return res.json({message: "new item created"})
                })
                .catch(error => {
                  if (error.errno === 1062){  // Duplication error
                    const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
                    if (column === "stand"){
                      return res.status(409).json({error: `error on create item '${data.item}'. Stand '${data.item}' already exist`, column: column, value: data.item});
                    }
                  } else {
                    return res.status(501).json({ error: {error}});
                  }
                })
            } else {
              return res.status(401).json({authenticated: false});
            }
          })
      }
  } catch {
    return res.status(401).json({authenticated: false});
  }
})

router.post("/edititem", (req, res, next) => {  // Create new item
  try{
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    const data = req.body;
    database('items')
      .where({itemID: data.itemID})
      .update({item: data.item, price: data.price, stock: data.stock})
      .then(() => {
        console.log(`item edited: ${data.item}`)
        return res.json({message: "item edited"})
      })
      .catch(error => {
        console.error(error)
        if (error.errno === 1062){  // Duplication error
          const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
          if (column === "item"){
            return res.status(409).json({error: `error on create item '${data.item}'. Stand '${data.item}' already exist`, column: column, value: data.item});
          }
        } else {
          return res.status(501).json({ error: {error}});
        }
      })
  } catch {
    return res.status(401).json({authenticated: false});
  }
})

// router.use((err, req, res, next) => {  // Cancel the upload of image
//   if (err) {
//     // Handle the error appropriately
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
//   next();
// });

module.exports = router;