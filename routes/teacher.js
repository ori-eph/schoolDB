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

router.post("/add", async function (req, res, next) {
  const teacher = req.body;
  let tableFields = await fsPromise.readFile(
    path.join(__dirname, `../entities/teacher.json`),
    "utf-8"
  );
  tableFields = JSON.parse(tableFields);

  if (!teacher || !compareObjectsKeys(teacher, tableFields)) {
    return res.status(401).send("3");
  }

  const insertSql = makeInsertStr(teacher, "teacher");
  con.query(insertSql, function (err, result) {
    if (err) throw err;
    const id = result.insertId;
    const selectSql = `SELECT * FROM teacher WHERE id = ${id}`;
    con.query(selectSql, function (err, result) {
      if (err) throw err;
      res.status(200).send(result[0]);
    });
  });

  selectTable("teacher");
});

//functions --------------------------------

module.exports = router;
