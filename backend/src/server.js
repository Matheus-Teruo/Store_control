const express = require("express");
const morgan = require("morgan");

const routerServer = require("./router/status")
const routerUser = require("./router/user")
const routerMain = require("./router/main")
const routerAdmin = require("./router/admin")

// Appi
const app = express();
app.use(morgan('common'))

app.user
app.use(routerServer)
app.use(routerUser)
app.use(routerMain)
app.use(routerAdmin)

module.exports = app;