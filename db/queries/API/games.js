const getAllGames = db => {
  return new Promise((resolve, reject) => {
    const selectQuery = 'SELECT * FROM Game LIMIT 1000';

    db.all(selectQuery, (err, rows) => {
      if (err) {
        console.error('Error retrieving games:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const getGameById = (db, gameId) => {
  return new Promise((resolve, reject) => {
    const selectQuery = 'SELECT * FROM Game WHERE id = ?';
    const params = [gameId];

    db.get(selectQuery, params, (err, row) => {
      if (err) {
        console.error('Error retrieving game:', err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

module.exports = { getAllGames, getGameById };
