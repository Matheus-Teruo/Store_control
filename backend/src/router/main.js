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

async function Goods(parameter) {  // {saleID: int,items: [{itemID: int, standID: int, amount: int, price: int}]}
  return new Promise((resolve, reject) => {
    const promise = parameter.items.map(item => {
      return database('items')
        .where({itemID: item.itemID})
        .select()
        .then(stockitem => {
          const stock = stockitem[0].stock;
          if (stock >= item.amount){
            database("goods")
            .insert({itemID: item.itemID, saleID: parameter.saleID, quantity: item.amount, unit_p: item.price})
            .then(() => {
              database('items')
                .where({itemID: item.itemID})
                .decrement({stock: item.amount})
                .catch((error) => {
                  console.error((`Error update item with itemID ${item.itemID}:`, error));
                });
            })
            .catch((error) => {
              console.error((`Error inserting item with itemID ${item.itemID}:`, error));
            });
          } else {
            console.error((`Error: no item on stocktaking, itemID ${item.itemID}:`))
          }
        })
        .catch((error) => {
          console.error((`Error taking item with itemID ${item.itemID}:`, error));
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

async function Items(parameter) {  // [{itemID: int, standID: int, amount: int, price: int}]
  return new Promise((resolve, reject) => {
    const promise = parameter.map(item => {
      return database('items')
        .where({itemID: item.itemID})
        .increment({stock: item.quantity})
        .catch((error) => {
          console.error((`Error update item with itemID ${item.itemID}:`, error));
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
          .insert({recharge: data.recharge, recharge_t: card.time, payment: data.payment, cardID: data.cardID, userID: decoded.userID})
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
              .catch(() => {  // Error on register customer
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
          if (data.finalization === "donation"){
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
                  .catch(() => {  // Error on register customer
                    return res.status(500).json({message: "error on update customers", error: "customers"})
                  })
              })
              .catch(() => {  // Error on register recharge
                return res.status(500).json({message: "error on register donation", error: "donations"})
              })
          } else {  // Refund the money
            database('recharges')
              .select('rechargeID', 'recharge', 'payment')
              .where({cardID: data.cardID})
              .orderBy('recharge_t', 'desc')
              .limit(1)
              .then((rowsRecharges) => {
                const recharge = rowsRecharges[0];
                if (recharge.payment === "cash"){
                  const aux = recharge.recharge - card.debit;
                  database('recharges')
                    .where({rechargeID: recharge.rechargeID})
                    .update({recharge: aux})
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
                        .catch(() => {  // Error on register customer
                          return res.status(500).json({message: "error on update customers", error: "customers"})
                        })
                    })
                    .catch(() => {  // Error on register customer
                      return res.status(500).json({message: "error on update recharge", error: "recharge"})
                    })
                } else {
                  return res.status(500).json({message: "error on recharge not possible refund", error: "recharges"})
                }
              })
              .catch((error) => {  // Error on register recharge
                console.error(error)
                return res.status(500).json({message: "error on take recharge", error: "recharges"})
              })
          }
        } else {
          Customer({card: data.cardID, valid: false, time: card.time}) 
            .then(() => {
              return res.json({message: "successful reset card", cardID: data.cardID});   
            })
            .catch(() => {  // Error on register customer
              return res.status(500).json({message: "error on update customers", error: "customers"})
            })
        }
      })
      .catch((error) => {  // No card resgistred
        console.error(error)
        return res.status(406).json({message: "error no card registred", error: "cards"})
      })
  }
})
// Seller
router.get("/listitemsperstand", (req, res) => {  // Request items by stand
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
                    .catch(() => {
                      res.json({message: "error: item with no stock", error: "items"})
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
      database('recharges')
        .select('rechargeID', 'payment')
        .where({cardID: data.cardID})
        .orderBy('recharge_t', 'desc')
        .limit(1)
        .then((rowsRecharges) => {
          if (rowsRecharges.length > 0) {
            const recharge = rowsRecharges[0];
            database('customers')
              .select('in_use')
              .where({cardID: data.cardID})
              .orderBy('control_t', 'desc')
              .limit(1)
              .then((customers) => {
                const customer = customers[0];
                return res.json({card: data.cardID, value: card.debit, payment: recharge.payment, customer: customer.in_use, code: true})
              })
              .catch((err) => {
                console.error(err)
                return res.json({card: "error: customer", value: 0, payment: "", customer: 0, code: false})
              })
          } else {
            return res.json({card: data.cardID, value: card.debit, payment: "", customer: 0, code: true})
          }
        })
        .catch((err) => {
          console.error(err)
          return res.json({card: "error: recharge", value: 0, payment: "", customer: 0, code: false})
        })
    })
    .catch((err) => {
      console.error(err)
      return res.json({card: "error: card not found", value: 0, payment: "", customer: 0, code: false})
    })
})

router.get('/checklastsales', (req, res) => {  // Request card debit
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    database('sales')
      .select()
      .where({userID: decoded.userID})
      .orderBy('sale_t', 'desc')
      .limit(3)
      .then((sales) => {
        if (sales.length > 0){
        const saleIDs = sales.map(sale => sale.saleID);
        database('goods')
          .select()
          .whereIn('saleID', saleIDs)
          .then((goods) => {
            const sale = sales[0];
            database('customers')
              .select()
              .where({cardID: sale.cardID})
              .orderBy('control_t', 'desc')
              .limit(1)
              .then((customers) => {
                if (customers[0].in_use === 1 && sale.sale_t > customers[0].control_t){
                  return res.json({sales: sales,goods: goods, customer: sale.saleID});
                } else {
                  return res.json({sales: sales,goods: goods, customer: false});
                }
              })
              .catch((err) => {
                console.error(err)
                return res.status(501).json({message: "customers error"});
              })
          })
          .catch((err) => {
            console.error(err)
            return res.status(501).json({message: "goods error"}); 
          })
        }
      })
      .catch((err) => {
        console.error(err)
        return res.status(501).json({message: "sales error"}); 
      })
  }
})

router.post('/deletesale', (req, res) => {  // Request card debit
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    database('goods')
      .select()
      .where({saleID: data.saleID})
      // .select(database.raw('SUM(unit_p * quantity) as totalPrice'))
      // .groupBy("saleID")
      .then(goods => {
        let totalSum = 0;
        console.log(goods)
        goods.forEach(good => {
          const product = good.quantity * good.unit_p;
          totalSum += product;
        });
        Items(goods)
          .then(() => {
            database('goods')
              .where({saleID: data.saleID})
              .delete()
              .then(() => {
                database('sales')
                .where({saleID: data.saleID})
                .delete()
                .then(() => {
                  database('cards')
                    .where({cardID: data.cardID})
                    .increment({debit: totalSum})
                    .then(() => {
                      return res.json({message: "undone purchase"})
                    })
                    .catch((err) => {
                      console.error(err)
                      return res.status(501).json({message: "card debit error"}); 
                    })
                })
                .catch((err) => {
                  console.error(err)
                  return res.status(501).json({message: "sales delete error"}); 
                })
              })
              .catch((err) => {
                console.error(err)
                return res.status(501).json({message: "goods delete error"}); 
              })
          })
          .catch((err) => {
            console.error(err)
            return res.status(501).json({message: "item error"}); 
          })
      })
  }
})
// Stocktaking
router.get("/stocktaking", (req, res) => {  // Request items from a standID
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    database('users')
      .select('stands.standID', 'stands.stand')
      .join('stands', 'users.standID', 'stands.standID')
      .where({userID: decoded.userID})
      .then((rowsUsers) => {
        if (rowsUsers.length > 0){
          const user = rowsUsers[0];
          database('items')
            .select()
            .where({standID: user.standID})
            .then((items) => {
              return res.json({stand: {standID: user.standID, stand: user.stand}, items: items})
            })
            .catch(() => {
              return res.status(501).json({message: "user are in diferent stand, error table"}); 
            })
        } else {  // User without stand
          return res.json({stand: {standID:0, stand:""}, items: []})
        }
      })
      .catch(() => {
        return res.status(501).json({message: "user are in diferent stand, error table"}); 
      })
  }
})

router.get("/stocktakingall", (req, res) => {  // Request all items and standID
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser === 1){
      database('items')
        .select()
        .then((items) => {
          return res.json({items: items})
        })
        .catch(() => {
          return res.status(501).json({message: "items error"}); 
        })
    } else {
      return res.status(501).json({message: "Not superuser"}); 
    }
  }
})

router.get("/salesitems", (req, res) => {  // Request item sales and total
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser) {
      database('goods')
        .select('itemID')
        .sum('quantity as totalQuantity')
        .groupBy('itemID')
        .then((goods) => {
          return res.json({goods: goods})
        })
        .catch((err) => {
          console.error(err)
          return res.status(501).json({message: "goods error"}); 
        })
    } else {
      return res.status(501).json({message: "Not superuser"}); 
    }
  }
})

router.post("/salesitemsperstand", (req, res) => {  // Request item sales and total from one stand
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (data.standID > 1) {
      database('items')
        .where({standID: data.standID})
        .select("itemID")
        .then((rows) => {
          database('goods')
            .select('itemID')
            .whereIn({itemID: rows})
            .sum('quantity as totalQuantity')
            .groupBy('itemID')
            .then((goods) => {
              return res.json({goods: goods})
            })
            .catch(() => {
              return res.status(501).json({message: "goods error"}); 
            })
        })
        .catch(() => {
          return res.status(501).json({message: "items error"}); 
        })
    } else {
      return res.status(501).json({message: "No userID"}); 
    }
  }
})

router.post("/newitem", (req, res, next) => {  // Create new item
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (data.standID > 1) {
      database('users')
        .select('standID')
        .where({userID: decoded.userID})
        .then((rowsUsers) => {
          const user = rowsUsers[0];
          if (user.standID === data.standID || decoded.superuser === 1){
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
          return res.status(401).end();
          }
        })
    } else {
    return res.status(401).end();
    }
  }
})

router.post("/edititem", (req, res, next) => {  // Change item property
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (data.standID > 1) {
      database('users')
        .select('standID')
        .where({userID: decoded.userID})
        .then((rowsUsers) => {
          const user = rowsUsers[0];
          if (user.standID === data.standID || decoded.superuser === 1){
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
          } else {
            return res.status(501).json({message: "user are in diferent stand"}); 
          }
        })
        .catch(error => {
          return res.status(501).json({message: "user are in diferent stand, error table"}); 
        })
    } else {
      return res.status(501).json({message: "stand 1 can't have items"});
    }
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