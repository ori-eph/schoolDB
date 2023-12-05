const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mysql = require("mysql");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "z10mz10m",
});

function createDataBase() {
  con.connect(function (err) {
    if (err) throw err;
    console.log("connected!");
    const dropSql = "DROP DATABASE IF EXISTS moshSchool";
    con.query(dropSql, function (err, result) {
      if (err) throw err;
      console.log("database dropped if existed");
      const createSql = "CREATE DATABASE moshSchool";
      con.query(createSql, function (err, result) {
        if (err) throw err;
        console.log("database created");
      });
    });
  });
}

// createDataBase();
