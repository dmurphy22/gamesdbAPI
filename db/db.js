const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database.db');
const fs = require('fs');
const sql = fs.readFileSync('./schema/schema.sql', 'utf8');

db.exec(sql, function (err) {
  if (err) {
    console.error(err.message);
  } else {
    console.log('SQL commands executed successfully.');
  }
  db.close();
});
