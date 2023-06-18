const express = require("express");
const database = require("../database");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const router = express();
router.use(express.json());
router.use(morgan("common"));
router.use(cookieParser());

router.get("/main", (req, res) => {  // Get home info
  try {
    var decoded = jwt.verify(req.cookies.jwt, process.env.SECRET_TOKEN);
    database('users')
      .select('standID', 'superuser')
      .where({user: decoded.payload.userID})
      .then(rows => {
        const row  = rows[0];
        res.json(row)
      });
  } catch(err) {
    res.status(401).json({authenticated: false});
  }
  })