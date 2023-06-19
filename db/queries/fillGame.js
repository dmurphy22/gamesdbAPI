const fs = require('fs');

const fillGame = db => {
  return new Promise((resolve, reject) => {
    const filePath = '../files/json/Metadata.json';
    const jsonData = fs.readFileSync(filePath, 'utf-8');

    const dataObject = JSON.parse(jsonData);

    const games = dataObject.LaunchBox.Game;

    if (!games || games.length === 0) {
      console.error('No Game files found in the JSON data.');
      reject(new Error('No Game files found in the JSON data.'));
      return;
    }

    db.run('DELETE FROM Game', function (err) {
      if (err) {
        console.error('Error clearing the table:', err);
        reject(err);
        return;
      }
      console.log('Table cleared.');

      const insertPromises = games.map(game => {
        const insertQuery = `INSERT INTO Game (Name, ReleaseYear, Overview, MaxPlayers, ReleaseType, Cooperative, DatabaseID, Platform, CommunityRatingCount, Genres, Developer, Publisher) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const getValue = row => {
          return game[row] ? game[row][0] : null;
        };

        const values = [
          getValue('Name'),
          getValue('ReleaseYear'),
          getValue('Overview'),
          getValue('MaxPlayers'),
          getValue('ReleaseType'),
          getValue('Cooperative'),
          getValue('DatabaseID'),
          getValue('Platform'),
          getValue('CommunityRatingCount'),
          getValue('Genres'),
          getValue('Developer'),
          getValue('Publisher'),
        ];

        return new Promise((resolve, reject) => {
          db.run(insertQuery, values, function (err) {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });

      Promise.all(insertPromises)
        .then(() => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};

module.exports = { fillGame };
