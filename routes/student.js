const express = require("express");
const router = express.Router();
const fs = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");
const mysql = require("mysql");
const { makeInsertStr, selectTable, compareObjectsKeys } = require("./utilty");

//add con to exports, ant try catch server error

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

router.get("/", async function (req, res, next) {
  const selectSql = `SELECT * FROM student`;
  con.query(selectSql, function (err, result) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

router.get("/:schoolCode/:classID", async function (req, res, next) {
  const schoolCode = req.params.schoolCode;
  const classID = req.params.classID;

  const selectSql = `SELECT s.full_name as student, sc.title as school, c._index as _index FROM student as s JOIN classroom as c ON c.id = s.classroom_id JOIN school as sc ON sc.id = c.school_id WHERE s.classroom_id = ${classID} AND sc.school_code = ${schoolCode}`;
  con.query(selectSql, function (err, result) {
    if (err) throw err;
    res.status(200).send(result);
  });
});

router.post("/add", async function (req, res, next) {
  const student = req.body;
  let tableFields = await fsPromise.readFile(
    path.join(__dirname, `../entities/student.json`),
    "utf-8"
  );
  tableFields = JSON.parse(tableFields);

  if (!student || !compareObjectsKeys(student, tableFields)) {
    return res.status(401).send("3");
  }

  const insertSql = makeInsertStr(student, "student");
  con.query(insertSql, function (err, result) {
    if (err) throw err;
    const id = result.insertId;
    const selectSql = `SELECT * FROM student WHERE id = ${id}`;
    con.query(selectSql, function (err, result) {
      if (err) throw err;
      res.status(200).send(result[0]);
    });
  });

  selectTable("student");
});

//functions --------------------------------

module.exports = router;
