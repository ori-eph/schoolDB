const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "z10mz10m",
  database: "moshSchool",
});

function makeInsertStr(fields, table) {
  let insertSql = `INSERT INTO ${table} `;
  let strKeys =
    "(" +
    Object.keys(fields)
      .map((key) => `${key}`)
      .join(", ") +
    ")";
  let strValues =
    "VALUES (" +
    Object.values(fields)
      .map((value) => `"${value}"`)
      .join(", ") +
    ")";

  insertSql += strKeys + " " + strValues + ";";
  return insertSql;
}

function selectTable(table) {
  const checkSql = `SELECT * FROM ${table};`;
  con.query(checkSql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
}

function compareObjectsKeys(obj1, obj2) {
  const keysObj1 = Object.keys(obj1);
  console.log("keysObj1: ", keysObj1);
  const keysObj2 = Object.keys(obj2);
  console.log("keysObj2: ", keysObj2);

  for (let key of keysObj1) {
    if (key !== "id" && !keysObj2.includes(key)) {
      return false;
    }
  }
  for (let key of keysObj2) {
    if (key !== "id" && !keysObj1.includes(key)) {
      return false;
    }
  }

  return true;
}

module.exports = {
  makeInsertStr,
  selectTable,
  compareObjectsKeys,
};
