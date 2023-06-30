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

async function Customer(value) { // {card: char(12), valid: boolean, time: datetime}
  return new Promise((resolve, reject) => {
  database('customers')
    .select('in_use')
    .where({cardID: value.card})
    .orderBy('control_t', 'desc')
    .limit(1)
    .then((rows) => {
      if (rows.length > 0 && rows[0].in_use === 1) {
        if (value.valid) {
          resolve(true);
        } else {
          database('customers')
            .insert({cardID: value.card, in_use: false, control_t: value.time})
            .then(() => {resolve(true);})
            .catch((error) => {
              console.error(error)
              reject(false);})
        }
      } else {
        if (value.valid) {
          database('customers')
            .insert({cardID: value.card, in_use: true, control_t: value.time})
            .then(() => {resolve(true);})
            .catch((error) => {
              console.error(error)
              reject(false);})
        } else {
          reject(false);
        }
      }
    }) 
    .catch((error) => {
      console.error(error)
      reject(false);})
  })
}

async function Card(ID) {  // cardID => {debit: int, time: datetime}
  return new Promise ((resolve, reject) => {
    database('cards')
      .select("debit")
      .where({cardID: ID})
      .then((rows) => {
        if (rows.length > 0){
          const row = rows[0];
          const now = new Date();
          const offset = now.getTimezoneOffset();
          now.setMinutes(now.getMinutes() - offset);
          const Datetime = now.toISOString().slice(0, 19).replace('T', ' ');
          resolve({debit: row.debit, time: Datetime})
        } else {
          reject({debit: 0, time: 0})
        }
      })
      .catch(() => {
        reject({debit: 0, time: 0})
      })
  })
}

async function Goods(parameter) {  // {saleID: int,items: [{itemID: int, saleID: int, amount: int, price: int}]}
  return new Promise((resolve, reject) => {
    const promise = parameter.items.map(item => {
      return database("goods")
        .insert({itemID: item.itemID, saleID: parameter.saleID, quantity: item.amount, unit_p: item.price})
        .then(() => {
          database('items')
            .where({itemID: item.itemID})
            .update({
              stock: database.raw('stock - ?', [item.amount])
            })
            .catch((error) => {
              console.error((`Error update item with itemID ${item.itemID}:`, error));
            });
        })
        .catch((error) => {
          console.error((`Error inserting item with itemID ${item.itemID}:`, error));
        });
    })

    Promise.all(promise)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  })
}

// Home
router.get("/main", (req, res) => {  // Get home info
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    database('users')
      .select('standID', 'superuser')
      .where({userID: decoded.userID})
      .then(rowsUsers => {
        const user  = rowsUsers[0];
        res.json(user)
      });
  }
})
// Cashier
router.get("/listitems", (req, res) => {  // Request items and stands
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    database('stands')
      .select("standID", "stand")
      .whereNot({standID: 1})
      .then((rowsStands) => {
        if (rowsStands.length > 0){
          database('items')
            .select()
            .then((rowsItems) =>{
              if (rowsItems.length > 0) {
                return res.json({stands: rowsStands, items: rowsItems})
              } else {
                return res.json({stands: rowsStands, items: []})
              }
            })
        } else { // No stand created
          return res.json({stands: [], items: []})
        }
      })
  }
})

router.post("/recharge", (req, res) => {  // Submit recharge
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    Card(data.cardID)
      .then(card => {
        database('recharges')
          .insert({recharge: data.recharge, recharge_t: card.time, cardID: data.cardID, userID: decoded.userID})
          .then(() => {
            Customer({card: data.cardID, valid: true, time: card.time}) 
              .then(() => {
                const aux = parseInt(parseFloat(card.debit) + parseFloat(data.recharge))
                database('cards')
                  .where({cardID: data.cardID})
                  .update({debit: aux})
                  .then(() => {
                    return res.json({message: "successful recharge"});
                  })
                  .catch(() => {  // Error on update card debit
                    return res.status(500).json({message: "error on update card debit", error: "cards"})
                  })
              })
              .catch(() => {  // Error on register costumer
                return res.status(500).json({message: "error on update customers", error: "customers"})
              })
          })
          .catch(() => {  // Error on register recharge
            return res.status(500).json({message: "error on register recharge", error: "recharges"})
          })
      })
      .catch(() => {  // No card resgistred
        return res.status(406).json({message: "error, no card registred", error: "cards"})
      })
  }
})

router.post("/resetcard", (req, res) => {  // Submit reset card
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    Card(data.cardID)
      .then(card => {
        if (card.debit > 0) {
          database('donations')
            .insert({value: card.debit, donation_t: card.time, cardID: data.cardID, userID: decoded.userID})
            .then(() => {
              Customer({card: data.cardID, valid: false, time: card.time}) 
                .then(() => {
                  database('cards')
                    .where({cardID: data.cardID})
                    .update({debit: 0})
                    .then(() => {
                      return res.json({message: "successful reset card", cardID: data.cardID});
                    })
                    .catch(() => {  // Error on update card debit
                      return res.status(500).json({message: "error on update card debit", error: "cards"})
                    })
                })
                .catch(() => {  // Error on register costumer
                  return res.status(500).json({message: "error on update customers", error: "customers"})
                })
            })
            .catch(() => {  // Error on register recharge
              return res.status(500).json({message: "error on register recharge", error: "donations"})
            })
        } else {
          Customer({card: data.cardID, valid: false, time: card.time}) 
            .then(() => {
              return res.json({message: "successful reset card", cardID: data.cardID});   
            })
            .catch(() => {  // Error on register costumer
              return res.status(500).json({message: "error on update customers", error: "customers"})
            })
        }
      })
      .catch(() => {  // No card resgistred
        return res.status(406).json({message: "error no card registred", error: "cards"})
      })
  }
})
// Seller
router.get("/listitemsbystand", (req, res) => {  // Request items by stand
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    database('users')
      .select('standID')
      .where({userID: decoded.userID})
      .then((rowsUsers) => {
        if (rowsUsers.length > 0){
          const user = rowsUsers[0];
          database('stands')
            .select('stand')
            .where({standID: user.standID})
            .then((rowsStands) => {
              if (rowsStands.length > 0) {
                const stand = rowsStands[0];
                database('items')
                  .select()
                  .where({standID: user.standID})
                  .then((rowsItems) =>{
                    if (rowsItems.length > 0) {
                      return res.json({standID: user.standID, stand: stand.stand, items: rowsItems})
                    } else {
                      return res.json({standID: user.standID, stand: stand.stand, items: []})
                    }
                  })
                  .catch((error) => {
                    console.error(error)
                    return res.status(500).json({standID: 0, stand: "", items: []})
                  })
              } else {
                return res.status(401).end();
              }
            })
        } else {// No stand selected
          return res.json({standID: 0, stand: "", items: []})
        }
      })
  }
})

router.post("/purchase", (req, res) => {  // Submit purchase
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    Card(data.cardID)  // Check debit and take now time
      .then(card => {
        const total = data.items.reduce((sum, item) => {
          const subtotal = item.price * item.amount;
          return sum + subtotal;}, 0);
        if (card.debit >= total) {
          database('sales')  // Registre Sale
            .insert({userID: decoded.userID, standID: data.standID, cardID: data.cardID, sale_t: card.time})
            .then(() => {
              database('sales')  // Take sale ID
                .select('saleID')
                .where({sale_t: card.time, userID: decoded.userID, cardID: data.cardID})
                .then(rowsSales => {
                  const saleID = rowsSales[0].saleID;
                  Goods({saleID: saleID, items:data.items})  // Iterate all items to goods table
                    .then(() => {
                      const aux = card.debit - total;
                      database('cards')  // Reduce client debit
                        .where({cardID: data.cardID})
                        .update({debit: aux})
                        .then(() => {
                          res.json({message: "successful purchase", cardID:data.cardID, newdebit: aux})
                        })
                    })
                })
            })
            .catch(() => {  // Error on register sales
              return res.status(500).json({message: "error on register sales", error: "sales"})
            })
        } else {
          return res.json({message: "insuficient debit", error: "card"})
        }
      })
      .catch(() => {  // No card resgistred
        return res.status(406).json({message: "error no card registred", error: "cards"})
      })
  }
})

router.post('/cardcheck', (req, res) => {  // Request card debit
  const data = req.body;
  Card(data.cardID)
    .then((card) => {
      return res.json({card: data.cardID, value: card.debit})
    })
    .catch(() => {
      return res.json({card: "error: card not found", value: "0"})
    })
})

module.exports = router;