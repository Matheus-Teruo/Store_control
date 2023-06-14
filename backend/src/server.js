const express = require("express");

const routerServer = require("./router/status")
const routerUser = require("./router/user")

// Appi
const app = express();
app.use(routerServer)
app.use(routerUser)
// GET

module.exports = app;