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
// const upload = multer({storage: storage})

async function checkCardUse(array) {  // [{cardID: char(12), debit: int},...]
  const updatedArray = [];
  for (const item of array) {
    const { cardID, debit } = item;
    try {
      const [result] = await database('customers')
        .select('in_use')
        .where({cardID: cardID})
        .orderBy('control_t', 'desc')
        .limit(1);
      const { in_use } = result || {};
      updatedArray.push({ cardID, debit, in_use });
    } catch (error) {
      console.error(`Error retrieving 'in_use' for cardID: ${cardID}`, error);
    }
  }
  return updatedArray
}

async function checkStandAssociation(array) {
  for (const item of array) {
    const { standID } = item;

    if (standID !== null) {
      try {
        const rows = await database('stands')
          .select('associationID')
          .where({standID: standID});
        if (rows.length > 0) {
          const associationID = rows[0].associationID;
          item.associationID = associationID;
        }
      } catch (error) {
        // Handle error
        console.error(`Error retrieving 'associationID' for standID: ${standID}`, error);
        // You can choose to skip or handle the specific error case
      }
    } else {
      item.associationID = null;
    }
  }

  return array;
}
//  Database
router.get("/listallstands", (req, res) => {  // Request all stands and associations
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      database('associations')
        .select('association', 'associationID', "principal")
        .orderBy('associationID', 'asc')
        .then(associations => {
          if (associations.length > 0) {
            database('stands')
              .select('standID', 'stand', 'associationID')
              .orderBy('associationID', 'asc')
              .then(stands => {
                if (stands.length > 0){
                  res.json({associations: associations, stands: stands}); 
                } else {
                  res.json({associations: associations, stands: []});
                }
              })
            } else {
              res.json({associations: [], stands: []});
            }
          })
    }
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
})

router.post("/newassociation", (req, res) => {  // Create new association
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      const data = req.body;
      database('associations')
        .insert(data)
        .then(() => {
          console.log(`successful created association: ${data.association}`);
          res.json({message: `successful created association: ${data.association}`});
        })
        .catch(error => {
          console.error(error)
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            return res.status(409).json({error: `error on sing-up association '${data.association}'. Association '${data.association}' already exist`, column: column, value: data.association});
          } else {
            return res.status(501).json({ error: {error}});
          }
        })
    } else {
      res.status(401).json({message: "user has no authorization"});
    }
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
})

router.post("/editassociation", (req, res) => {  // Change association property
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      const data = req.body;
      database('associations')
        .where({associationID: data.associationID})
        .update({association: data.association, principal: data.principal})
        .then(() => {
          console.log(`successful edited association: ${data.association}`);
           return res.json({message: `successful edited association: ${data.association}`});
        })
        .catch(error => {
          console.error(error)
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            return res.status(409).json({error: `error on edit association '${data.association}'. Assiciation '${data.association}' already exist`, column: column, value: data.association});
          } else {
            return res.status(501).json({ error: {error}});
          }
        })
    }
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
})

router.post("/delassociation", (req, res) => {  // Delete association
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      const data = req.body;
      database('associations')
        .where({associationID: data.associationID})
        .del()
        .then(() => {
          console.log(`successful deleted association`);
          return res.json({message: `successful deleted association`});
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
          res.json({message: `successful created association: ${data.stand}`});
        })
        .catch(error => {
          console.error(error)
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            return res.status(409).json({error: `error on sing-up stand '${data.stand}'. Stand '${data.stand}' already exist`, column: column, value: data.stand});
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
        .update({stand: data.stand, associationID: data.associationID})
        .then(() => {
          console.log(`successful edited stand: ${data.stand}`);
          res.json({message: `successful edited association: ${data.stand}`});
        })
        .catch(error => {
          console.error(error)
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            return res.status(409).json({error: `error on edited stand '${data.stand}'. Stand '${data.stand}' already exist`, column: column, value: data.stand});
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
          return res.json({message: `successful deleted association`});
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

// Stocktaking
router.get("/stocktaking", (req, res) => {
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
    if (data.standID > 1) {
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
                  return res.status(409).json({error: `error on create item '${data.item}'. Stand '${data.item}' already exist`, column: column, value: data.item});
                } else {
                  console.error(error)
                  return res.status(501).json({ error: {error}});
                }
              })
          } else {
            return res.status(401).json({authenticated: false});
          }
        })
    } else {
      return res.status(401).json({message: "StandID === 1"});
    }
  } catch {
    return res.status(401).json({authenticated: false});
  }
})

router.post("/edititem", (req, res, next) => {  // Create new item
  try{
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    const data = req.body;
    if (data.standID > 1) {
      database('users')
        .select('standID')
        .where({userID: decoded.userID})
        .then((rows) => {
          const row = rows[0];
          if (row.standID === data.standID){
            database('items')
              .where({itemID: data.itemID})
              .update({item: data.item, price: data.price, stock: data.stock})
              .then(() => {
                console.log(`item edited: ${data.item}`)
                return res.json({message: "item edited"})
              })
              .catch(error => {
                if (error.errno === 1062){  // Duplication error
                  const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
                  return res.status(409).json({error: `error on create item '${data.item}'. Stand '${data.item}' already exist`, column: column, value: data.item});
                } else {
                  console.error(error)
                  return res.status(501).json({ error: {error}});
                }
              })
          }
        })
    }
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

router.get("/allcards", (req, res) => {
  try{
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    const data = req.body;
    if (decoded.superuser) {
      database('cards')
      .select()
      .then((rows) => {
        if (rows.length > 0){
          checkCardUse(rows)
            .then(newrows => {
              return res.json(newrows)
            })
            .catch(error => {
              console.error('Error updating array with "in_use" values:', error);
            })
        } else {  // User without stand
          return res.json([])
        }
      })
    } else {
      return res.status(401).json({authenticated: false});
    }
  } catch {  // Error of authenticated
    return res.status(401).json({authenticated: false});
  }
})

router.post("/newcard", (req, res, next) => {  // Create new item
  try{
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    const data = req.body;
    if (decoded.superuser === 1) {
      database('cards')
        .insert(data)
        .then(() => {
          console.log(`new card created: ${data.cardID}`)
          return res.json({message: "new card created"})
        })
        .catch(error => {
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            return res.status(409).json({error: `error on create item '${data.cardID}'. Stand '${data.cardID}' already exist`, column: column, value: data.cardID});
          } else {
            return res.status(501).json({ error: {error}});
          }
        })
    }
  } catch {
    return res.status(401).json({authenticated: false});
  }
})

router.get("/allusers", (req, res) => {
  try{
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    const data = req.body;
    if (decoded.superuser){
      database('users')
        .select('userID', 'username', 'fullname', 'standID', 'superuser')
        .then((rows) => {
          checkStandAssociation(rows)
            .then(newrows => {
              return res.json(newrows)
            })
            .catch(error => {
              console.error('Error updating array with "associationID" values:', error);
            })
        })
    } else {
      return res.status(401).json({authenticated: false});
    } 
  } catch {  // Error of authenticated
    return res.status(401).json({authenticated: false});
  }
})

router.get("/liststand", (req, res) => {  // Check user
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    if (decoded.superuser) {
      database('associations')
      .select('association', 'associationID')
      .orderBy('associationID', 'asc')
      .then(associations => {
        if (associations.length > 0) {
          database('stands')
            .select('standID', 'stand', 'associationID')
            .orderBy('associationID', 'asc')
            .then(stands => {
              if (stands.length > 0){
                return res.json({associations: associations, stands: stands}); 
              } else {
                return res.json({associations: associations, stands: []}); 
              }
            })
        } else {
          return res.json({associations: [], stands: []}); 
        }
      })
    } else {
      return res.status(401).json({message: 'user not allowed'});
    }
  } catch(err) {
    return res.status(401).json({message: 'error on take list'});
  }
})

router.post("/changestandid", (req, res) => {  // Change user stand
  const data = req.body;
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    database('users')
      .where({userID: decoded.userID})
      .update({standID: data.standID})
      .then(() => {
        return res.json({message: `standID successfull update to: ${data.standID}`, standID: data.standID});
      })
  } catch(err) {
    return res.status(401).json({message: `change error`});
  }
})
module.exports = router;