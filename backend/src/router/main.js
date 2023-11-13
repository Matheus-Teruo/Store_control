const express = require("express");
const database = require("../database");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require('multer');
const path = require('path');

const storageItem = multer.diskStorage({
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg") {
      cb(null, true)
    } else {
      cb(new Error ('Unaccepted file type'))
    }
  },
  destination: (req, file, cb) => {
    const destinationDir = path.join(__dirname, "../../images/items");
    cb(null, destinationDir)
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${req.body.imageName}${extension}`)
  }
})

const router = express();
router.use(express.json());
router.use(cookieParser());
const uploadImage = multer({storage: storageItem})

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
    .orderBy('customerID', 'desc')
    .limit(1)
    .then((rows) => {
      if (rows.length > 0 && rows[0].in_use === 1) {
        if (value.valid) {
          resolve(true);
        } else {
          database('customers')
            .insert({cardID: value.card, in_use: false, control_t: value.time, userID: value.userID})
            .then(() => {resolve(true);})
            .catch((error) => {
              console.error(error)
              reject(false);})
        }
      } else {
        if (value.valid) {
          database('customers')
            .insert({cardID: value.card, in_use: true, control_t: value.time, userID: value.userID})
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
// Auxiliar to increment items stock
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


async function Sales(parameter, user, card) {
  return new Promise((resolve, reject) => {
    const promise = parameter.standIDs.map(standID => {
      const filteredItems = parameter.items.filter(element => element.standID === standID)
      if (filteredItems.length > 0){
        return database('sales')  // Registre Sale
        .insert({userID: user.userID, standID: standID, cardID: parameter.cardID, sale_t: card.time})
        .then((saleID) => {
          
          Goods({saleID: saleID, items: filteredItems})  // Iterate all items to goods table
            .catch(() => {
              res.json({message: "error: item with no stock", error: "items"})
            })
        })
        .catch(() => {  // Error on register sales
          return res.status(500).json({message: "error on register sales", error: "sales"})
        })
      } 
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
// Cashier
router.get("/listitems", (req, res) => {  // Request items and stands
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    database('stands')
      .select("standID", "stand")
      .whereNot({standID: 1})
      .whereNot({standID: 2})
      .then((rowsStands) => {
        if (rowsStands.length > 0){
          database('items')
            .select()
            .where({activated: 1})
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
            Customer({card: data.cardID, valid: true, time: card.time, userID: decoded.userID}) 
              .then(() => {
                const aux = (parseFloat(card.debit) + parseFloat(data.recharge))
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
                Customer({card: data.cardID, valid: false, time: card.time, userID: decoded.userID}) 
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
                      Customer({card: data.cardID, valid: false, time: card.time, userID: decoded.userID})
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
          Customer({card: data.cardID, valid: false, time: card.time, userID: decoded.userID}) 
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
                  .where({standID: user.standID, activated: 1})
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

router.use("/itemimages", express.static(path.resolve(__dirname, "../../images/items")))

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
            .then((saleID) => {
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
          .select('items.item', 'goods.quantity', 'goods.unit_p', 'goods.saleID', 'goods.itemID')
          .innerJoin('items', 'goods.itemID', 'items.itemID')
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
        } else {
          return res.json({sales: [],goods: [], customer: false});
        }
      })
      .catch((err) => {
        console.error(err)
        return res.status(501).json({message: "sales error"}); 
      })
  }
})

router.post('/deletesale', (req, res) => {  // Delete last sale
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    database('goods')
      .select()
      .where({saleID: data.saleID})
      .then(goods => {
        let totalSum = 0;
        // console.log(goods)
        goods.forEach(good => {
          const product = good.quantity * good.unit_p;
          totalSum += product;
        });
        Items(goods)  // Increment stock in items
          .then(() => {
            database('goods')  // Delete goods rows
              .where({saleID: data.saleID})
              .delete()
              .then(() => {
                database('sales')  // Delete sale
                  .where({saleID: data.saleID})
                  .delete()
                  .then(() => {
                    database('cards')  // Return cash to card
                      .where({cardID: data.cardID})
                      .increment({debit: totalSum})
                      .then(() => {
                        return res.json({message: "successfully undone purchase"})
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
// ChashierDirect
router.post("/purchasecustomer", (req, res) => {  // Submit purchase
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    Card(data.cardID)  // Check debit and take now time
      .then(card => {
        database('recharges')
          .insert({recharge: data.recharge, recharge_t: card.time, payment: data.payment, cardID: data.cardID, userID: decoded.userID})
          .then(() => {
            Customer({card: data.cardID, valid: true, time: card.time, userID: decoded.userID}) 
              .then(() => {
                const total = data.items.reduce((sum, item) => {
                  const subtotal = item.price * item.amount;
                  return sum + subtotal;}, 0);
                Sales(data, decoded, card)
                  .then(() => {
                    const aux = parseFloat(data.recharge) - parseFloat(total);
                    if (aux > 0){
                      database('donations')
                        .insert({value: aux, donation_t: card.time, cardID: data.cardID, userID: decoded.userID})
                        .then(() => {
                          Customer({card: data.cardID, valid: false, time: card.time, userID: decoded.userID}) 
                            .then(() => {
                              return res.json({message: "successful purchase customer", cardID: data.cardID});
                            })
                            .catch(() => {  // Error on register customer
                              return res.status(500).json({message: "error on update customers", error: "customers"})
                            })
                        })
                        .catch(() => {  // Error on register recharge
                          return res.status(500).json({message: "error on register donation", error: "donations"})
                        })
                    } else {
                      Customer({card: data.cardID, valid: false, time: card.time, userID: decoded.userID}) 
                        .then(() => {
                          return res.json({message: "successful purshase customer", cardID: data.cardID});   
                        })
                        .catch(() => {  // Error on register customer
                          return res.status(500).json({message: "error on update customers", error: "customers"})
                        })
                    }
                  })
                  .catch(() => {
                    return res.status(500).json({message: "error on sales", error: "sales"})
                  })
              })
              .catch(() => {
                return res.status(500).json({message: "error on customer", error: "sales"})
              })
          })
          .catch(() => {
            return res.status(500).json({message: "error on recharge", error: "sales"})
          })
      })
      .catch(() => {  // No card resgistred
        return res.status(406).json({message: "error no card registred", error: "cards"})
      })
  }
})

router.get('/checklastcustomer', (req, res) => {  // Request card debit
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    database('customers')
      .select()
      .where({userID: decoded.userID, in_use: 1, cardID: 111111111111})
      .orderBy('control_t', 'desc')
      .limit(3)
      .then((customers) => {
        if (customers.length > 0){
          const customer = customers[0];
          const customertime = customers.map(customer => customer.control_t);
          database('sales')
            .select()
            .whereIn('sale_t', customertime)
            .then((sales) => {
              if (sales.length > 0) {
                const saleIDs = sales.map(sale => sale.saleID);
                database('goods')
                  .select('items.item', 'goods.quantity', 'goods.unit_p', 'goods.saleID', 'goods.itemID')
                  .innerJoin('items', 'goods.itemID', 'items.itemID')
                  .whereIn('saleID', saleIDs)
                  .then((goods) => {
                    return res.json({customers: customers,sales: sales,goods: goods, customer: customer.customerID});
                  })
                  .catch((err) => {
                    console.error(err)
                    return res.status(501).json({message: "goods error"});
                  })
              } else {
                return res.json({customers: customers,sales: [],goods: [], customer: 0});
              }
            })
            .catch((err) => {
              console.error(err)
              return res.status(501).json({message: "sales error"}); 
            })
        } else {
          return res.json({customers: [],sales: [],goods: [], customer: 0});
        }
      })
      .catch((err) => {
        console.error(err)
        return res.status(501).json({message: "customer error"}); 
      })
  }
})

router.post("/deletecustomer", (req, res) => {  // Submit recharge
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    database('customers')
      .select()
      .where({customerID: data.customerID})
      .then((customers) => {
        const customer = customers[0];
        database('sales')
          .select()
          .where({userID: decoded.userID, cardID: data.cardID, sale_t: customer.control_t})
          .then((sales) => {
            if (sales.length > 0){
              const saleIDs = sales.map(obj => obj.saleID);
              database('goods')
                .select()  
                .whereIn('saleID', saleIDs)
                .then((goods) => {
                  if (goods.length > 0){
                    Items(goods)  // Increment stock in items
                      .then(() => {
                        database('goods')  // Delete goods rows
                          .whereIn('saleID', saleIDs)
                          .del()
                          .then(() => {
                            database('sales')
                              .where({userID: decoded.userID, cardID: data.cardID, sale_t: customer.control_t})
                              .del()
                              .then(() => {
                                database('customers')
                                  .where({userID: decoded.userID, control_t: customer.control_t})
                                  .del()
                                  .then(() => {
                                    return res.json({message: "successful purchase customer", cardID: data.cardID});
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
                        return res.status(501).json({message: "items reset stock error"}); 
                      })
                  } else {
                    return res.status(501).json({message: "no goods in database"}); 
                  }
                })
                .catch((err) => {
                  console.error(err)
                  return res.status(501).json({message: "take goods error"}); 
                })
            } else {
              return res.status(501).json({message: "no sales in database"}); 
            }
          })
          .catch((err) => {
            console.error(err)
            return res.status(501).json({message: "takes sales error"}); 
          })
      })
      .catch((err) => {
        console.error(err)
        return res.status(501).json({message: "takes customer error"}); 
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
            .where({standID: user.standID, activated: 1})
            .then((items) => {
              if (items.length !== 0){
                database('goods')
                  .select('itemID')
                  .sum('quantity as totalQuantity')
                  .groupBy('itemID')
                  .then((goods) => {
                    const filteredgoods = goods.filter((elements) => {
                      return items.some((item) => item.itemID === elements.itemID);
                    });
                    return res.json({stand: {standID: user.standID, stand: user.stand}, items: items, goods: filteredgoods})
                  })
                  .catch(() => {
                    return res.status(501).json({message: "goods error"}); 
                  })
              } else {
                return res.json({stand: {standID: user.standID, stand: user.stand}, items: items, goods: []}) 
              }
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
    database('users')
      .select('standID')  
      .where({userID:  decoded.userID})
      .then((users) => {
        const user = users[0];
        if (decoded.superuser === 1){
          database('items')
            .select()
            .then((items) => {
              database('goods')
                .select('itemID')
                .sum('quantity as totalQuantity')
                .groupBy('itemID')
                .then((goods) => {
                  return res.json({items: items, goods: goods})
                })
                .catch((err) => {
                  console.error(err)
                  return res.status(501).json({message: "goods error"}); 
                })
            })
            .catch(() => {
              return res.status(501).json({message: "items error"}); 
            })
        }else if(user.standID === 2){
          database('items')
            .select()
            .where({activated: 1})
            .then((items) => {
              database('goods')
                .select('itemID')
                .sum('quantity as totalQuantity')
                .groupBy('itemID')
                .then((goods) => {
                  return res.json({items: items, goods: goods})
                })
                .catch((err) => {
                  console.error(err)
                  return res.status(501).json({message: "goods error"}); 
                })
            })
            .catch(() => {
              return res.status(501).json({message: "items error"}); 
            })
        } else {
          return res.status(501).json({message: "Not superuser"}); 
        }
      })
  }
})

router.post("/newitem", (req, res) => {  // Create new item
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser === 1){
      if (data.standID > 2) {
        database('users')
          .select('username')
          .where({userID: decoded.userID})
          .then((rowsUsers) => {
            const user = rowsUsers[0];
            database('items')
              .insert(data)
              .then((rowsItems) => {
                console.log(`new item created: ${data.item}, created by ${user.username}`)
                return res.json({message: "new item created", ID: rowsItems[0]})
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
          })
      } else {
        return res.status(501).end();
      }
    } else {
      return res.status(501).json({message: "Not superuser"}); 
    } 
  }
})

router.post("/edititem", (req, res) => {  // Change item property
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser === 1){
      if (data.standID > 2) {
        database('items')
          .select()
          .where({itemID: data.itemID})
          .then((oldItems) => {
            const oldItem = oldItems[0];
            if (oldItem.standID === data.standID){
              database('items')
                .where({itemID: data.itemID})
                .update({item: data.item, price: data.price, stock: data.stock})
                .then(() => {
                  console.log(`item edited: ${data.item}, changed by ${decoded.userID}`)
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
            } else {  // If change standID
              database('goods')
                .select()
                .where({itemID: data.itemID})
                .then((itemgoods) => {
                  if (itemgoods.length > 0){
                    console.log(`item can't be edited: ${data.item}`)
                    return res.status(406).json({message: "item edited"})
                  } else {  // No sale with this item
                    database('items')
                      .where({itemID: data.itemID})
                      .update({item: data.item, price: data.price, stock: data.stock, standID: data.standID})
                      .then(() => {
                        console.log(`item edited: ${data.item}, changed by ${decoded.userID}`)
                        return res.json({message: "item can't be edited"})
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
                .catch(error => {
                  console.error(error)
                  return res.status(501).json({ error: `error on goods: ${error}`});
                })
            }
          })
          .catch(error => {
            console.error(error)
            return res.status(501).json({ error: `error on items: ${error}`});
          })
      } else {
        return res.status(501).json({message: "stand 1 or 2 can't have items"});
      }
    } else {
      return res.status(501).json({message: "Not superuser"}); 
    }
  }
})

router.post("/deleteitem", (req, res) => {  // Change item property
  const data = req.body;
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser === 1){
      if (data.standID > 2) {
        database('goods')
          .select()
          .where({itemID: data.itemID})
          .then((itemgoods) => {
            if (itemgoods.length > 0){
              database('items')
                .where({itemID: data.itemID})
                .update({activated: 0})
                .then(() => {
                  console.log(`item deleted: ${data.item}, changed by ${decoded.userID}`)
                  return res.json({message: "item deleted"})
                })
                .catch(error => {
                  console.error(error)
                  return res.status(501).json({ error: {error}});
                })
            } else {
              database('items')
              .where({itemID: data.itemID})
              .del()
              .then(() => {
                console.log(`item true deleted: ${data.item}, changed by ${decoded.userID}`)
                return res.json({message: "item true deleted"})
              })
              .catch(error => {
                console.error(error)
                return res.status(501).json({ error: {error}});
              })
            }
          })
      } else {
        return res.status(501).json({message: "stand 1 or 2 can't have items"});
      }
    } else {
      return res.status(501).json({message: "Not superuser"}); 
    }
  }
})

router.post("/itemimageupload", uploadImage.single("imageItem"), (req, res) => {
  const decoded = decodeJWT(req, res);
  if (!decoded) {
    return res.status(401).end();
  } else {
    if (decoded.superuser === 1){
      if (req.body.standID > 2) {
        database('users')
          .select('username')
          .where({userID: decoded.userID})
          .then((rowsUsers) => {
            const user = rowsUsers[0];
            const imageType = req.body.imageType.split("/")
            database('items')
              .where({itemID: req.body.imageName})
              .update({item_img: imageType[1]})
              .then(() => {
                console.log(`item image: ${req.body.imageName}, changed by ${user.username}`)
                return res.json({message: "item image uploaded"})
              })
              .catch(error => {
                return res.status(501).json({error: error});
              })
          })
          .catch(error => {
            return res.status(501).json({message: "user are in diferent stand, error table"}); 
          })
      } else {
        return res.status(501).json({message: "stand 1 can't have items"});
      }
    } else {
      return res.status(501).json({message: "Not superuser"}); 
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