const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mysql = require("mysql");
const fs = require("fs");
const fsPromise = require("fs/promises");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const schoolRouter = require("./routes/school");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/school", schoolRouter);

module.exports = app;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "z10mz10m",
  database: "moshSchool",
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

async function createTables() {
  try {
    let names = await fsPromise.readdir(path.join(__dirname, "/entities"));
    for (const fileName of names) {
      const table = path.basename(fileName, path.extname(fileName));
      const dropSql = `DROP TABLE IF EXISTS ${table}`;

      con.query(dropSql, async function (err, result) {
        if (err) throw err;

        console.log(`${table} dropped if existed`);
        let tableFields = await fsPromise.readFile(
          path.join(__dirname, `/entities/${fileName}`),
          "utf-8"
        );

        tableFields = JSON.parse(tableFields);
        let createSql = `CREATE TABLE ${table} `;
        let fieldsStr =
          "(" +
          Object.entries(tableFields)
            .map(([key, value]) => `${key} ${value}`)
            .join(", ") +
          ")";
        createSql += fieldsStr;

        con.query(createSql, function (err, result) {
          if (err) throw err;
          console.log("table created");
        });

        // const checkSql = `SELECT * FROM ${table};`;
        // con.query(checkSql, function (err, result, fields) {
        //   if (err) throw err;
        //   console.log(fields);
        // });
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function addAdmins() {
  const admins = [
    { full_name: "eyal paz", password: "12345", school_id: 1 },
    { full_name: "dumbledoor", password: "magic", school_id: 2 },
  ];

  for (const obj of admins) {
    let insertSql = `INSERT INTO admin `;
    let adminStrKey =
      "(" +
      Object.keys(obj)
        .map((key) => `${key}`)
        .join(", ") +
      ")";
    let adminStrValues =
      "VALUES (" +
      Object.values(obj)
        .map((value) => `"${value}"`)
        .join(", ") +
      ")";
    insertSql += adminStrKey + " " + adminStrValues + ";";
    con.query(insertSql, function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  }

  const checkSql = `SELECT * FROM admin;`;
  con.query(checkSql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
}

//reset db ---------------

// createDataBase();
// createTables();
// addAdmins();

// ------------------------
