const express = require("express");
const router = express.Router();
const fs = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");
const mysql = require("mysql");
const { makeInsertStr, selectTable, compareObjectsKeys } = require("./utilty");

/* 1 - not authorized :(
    2 - did not find 
    3 - problem with req
    4 - problem with server
*/
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "z10mz10m",
  database: "moshSchool",
});

const adminKeyConst = "123ADMIN";

router.get("/", async function (req, res, next) {
  const selectSql = `SELECT s.title, a.full_name FROM admin as a JOIN school as s ON a.school_id = s.id; `;
  con.query(selectSql, function (err, result) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

router.post("/add", async function (req, res, next) {
  const adminKey = req.body.key;
  if (!adminKey || adminKey !== adminKeyConst) {
    return res.status(401).send("1");
  }

  const school = req.body.school;
  let tableFields = await fsPromise.readFile(
    path.join(__dirname, `../entities/school.json`),
    "utf-8"
  );
  tableFields = JSON.parse(tableFields);

  if (!school || !compareObjectsKeys(school, tableFields)) {
    return res.status(401).send("3");
  }

  const insertSql = makeInsertStr(school, "school");
  con.query(insertSql, function (err, result) {
    if (err) throw err;
    const id = result.insertId;
    const selectSql = `SELECT * FROM school WHERE id = ${id}`;
    con.query(selectSql, function (err, result) {
      if (err) throw err;
      res.status(200).send(result[0]);
    });
  });

  selectTable("school");
});

//functions --------------------------------

module.exports = router;
