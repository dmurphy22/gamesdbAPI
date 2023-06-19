const sqlite3 = require('sqlite3').verbose();

const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(
      '../database.db',
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
