const express = require("express");
const database = require("../database");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const router = express();
router.use(express.json());
router.use(cookieParser());

const decodeJWT = (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN).payload;
    return decoded;
  } catch (error) {
    return false
  }
}

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

async function checkStandAssociation(array) {  //
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
router.get("/liststands", (req, res) => {  // Request all stands and associations
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser) {
      database('associations')
        .select()
        .orderBy('associationID', 'asc')
        .then(associations => {
          if (associations.length > 0) {
            database('stands')
              .select()
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
    } else {
      return res.status(401).end();
    }
  }
})

router.post("/newassociation", (req, res) => {  // Create new association
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser) {
      const data = req.body;
      database('associations')
        .insert(data)
        .then(() => {
          console.log(`successful created association: ${data.association}`);
          res.json({message: `successful created association: ${data.association}`});
        })
        .catch(error => {
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            return res.status(409).json({error: `error on sing-up association '${data.association}'. Association '${data.association}' already exist`, column: column, value: data.association});
          } else {
            console.error(error)
            return res.status(501).json({ error: {error}});
          }
        })
    } else {
      return res.status(401).end();
    }
  }
})

router.post("/editassociation", (req, res) => {  // Change association property
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
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
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            return res.status(409).json({error: `error on edit association '${data.association}'. Assiciation '${data.association}' already exist`, column: column, value: data.association});
          } else {
            console.error(error)
            return res.status(501).json({ error: {error}});
          }
        })
    } else {
      return res.status(401).end();
    }
  }
})

router.post("/delassociation", (req, res) => {  // Delete association
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
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
    } else {
      return res.status(401).end();
    }
  }
})

router.post("/newstand", (req, res) => {  // Create new stand
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser) {
      const data = req.body;
      database('stands')
        .insert(data)
        .then(() => {
          console.log(`successful created stand: ${data.stand}`);
          res.json({message: `successful created association: ${data.stand}`});
        })
        .catch(error => {
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            return res.status(409).json({error: `error on sing-up stand '${data.stand}'. Stand '${data.stand}' already exist`, column: column, value: data.stand});
          } else {
            console.error(error)
            return res.status(501).json({ error: {error}});
          }
        })
    } else {
      return res.status(401).end();
    }
  }
})

router.post("/editstand", (req, res) => {  // Change stands property
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
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
          if (error.errno === 1062){  // Duplication error
            const [ table , column ] = error.sqlMessage.match(/[^']\w+[.]\w+[^']/)[0].split(".");
            return res.status(409).json({error: `error on edited stand '${data.stand}'. Stand '${data.stand}' already exist`, column: column, value: data.stand});
          } else {
            console.error(error)
            return res.status(501).json({ error: {error}});
          }
        })
    } else {
      return res.status(401).end();
    }
  }
})

router.post("/delstand", (req, res) => {  // Delete stand
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
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
    } else {
      return res.status(401).end();
    }
  }
})
// Cards
router.get("/allcards", (req, res) => {  //  Request all cards
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser) {
      database('cards')
      .select()
      .then((rowsCards) => {
        if (rowsCards.length > 0){
          checkCardUse(rowsCards)
            .then(newrows => {
              return res.json(newrows)
            })
            .catch(error => {
              console.error('Error updating array with "in_use" values:', error);
            })
        } else { // User without stand
          return res.json([])
        }
      })
    } else {
      return res.status(401).end();
    }
  }
})

router.post("/newcard", (req, res, next) => {  // Create new item
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
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
            console.error(error) 
            return res.status(501).json({ error: {error}});
          }
        })
    } else {
      return res.status(401).end();
    }
  }
})
// AllUsers
router.get("/allusers", (req, res) => {  // Request all users
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser){
      database('users')
        .select('userID', 'username', 'fullname', 'standID', 'superuser')
        .then((rowsUsers) => {
          checkStandAssociation(rowsUsers)
            .then(newrows => {
              return res.json(newrows)
            })
            .catch(error => {
              console.error('Error updating array with "associationID" values:', error);
            })
        })
    } else {
      return res.status(401).end();
    }
  }
})

router.get("/liststand", (req, res) => {  // Request user stands
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
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
      return res.status(401).end();
    }
  }
})

router.post("/changestandid", (req, res) => {  // Change user stand
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser) {
      database('users')
        .where({userID: data.userID})
        .update({standID: data.standID})
        .then(() => {
          return res.json({message: `userID: ${data.userID} successfull update standID  to: ${data.standID}`, standID: data.standID});
        })
      }
  }
})
//Statistics
router.get("/listsales", (req,res) =>{  // Request list of sales
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser) {
      database('stands')
        .select()
        .orderBy('associationID', 'asc')
        .then(stands => {
          if (stands.length > 0){
            database('items')
              .select()
              .then(items => {
                if (items.length > 0){
                  database('sales')
                    .innerJoin('stands', 'sales.standID', 'stands.standID')
                    .select()
                    .orderBy('saleID', 'asc')
                    .then(sales => {
                      if (sales.length > 0) {
                        database('goods')
                          .innerJoin('items', 'goods.itemID', 'items.itemID')
                          .select()
                          .orderBy('saleID', 'asc')
                          .then(goods => {
                            if (goods.length > 0){
                              res.json({stands: stands, items: items, sales: sales, goods: goods}); 
                            }
                          })
                      } else {
                        res.json({stands: stands, items: items, sales: [], goods: []});
                      }
                    })   
                } else {
                  res.json({stands: stands, items: items, sales: [], goods: []});
                }
              })   
          } else {
            res.json({stands: [], items: [], sales: [], goods: []});
          }
        })
    } else {
      return res.status(401).end();
    }
  }
})

router.get("/listrecharges", (req,res) =>{  // Request list of recharges
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser) {
      database('recharges')
        .select()
        .then(recharges => {
          if (recharges.length > 0){
            database('customers')
              .select()
              .then(customers => {
                database('donations')
                  .select()
                  .then(donations => {
                    if (donations.length > 0) {
                      res.json({recharges: recharges, customers: customers, donations: donations}); 
                    } else {
                      res.json({recharges: recharges, customers: customers, donations: []});
                    }
                  })  
              })    
          } else {
            res.json({recharges: [], customers: [], donations: []});
          }
        })
    } else {
      return res.status(401).end();
    }
  }
})

module.exports = router;