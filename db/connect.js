const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    const projectRoot = process.cwd();
    const dbPath = path.join(projectRoot, 'database.db');
    const db = new sqlite3.Database(
      dbPath,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      err => {
        if (err) {
          reject(err);
        } else {
          console.log('Connected to the SQLite database.');
          resolve(db);
        }
      }
    );
  });
};

module.exports = { connectToDatabase };
