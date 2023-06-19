const fs = require('fs');

const fillGameAlternate = db => {
  return new Promise((resolve, reject) => {
    const filePath = '../files/json/Metadata.json';
    const jsonData = fs.readFileSync(filePath, 'utf-8');

    const dataObject = JSON.parse(jsonData);

    const gameAlternates = dataObject.LaunchBox.GameAlternateName;

    if (!gameAlternates || gameAlternates.length === 0) {
      console.error('No Game Alternate Names found in the JSON data.');
      reject(new Error('No Game Alternate Names found in the JSON data.'));
      return;
    }

    db.run('DELETE FROM GameAlternateName', function (err) {
      if (err) {
        console.error('Error clearing the table:', err);
        reject(err);
        return;
      }
      console.log('Table cleared.');

      const insertPromises = gameAlternates.map(alternate => {
        const insertQuery = `INSERT INTO GameAlternateName (AlternateName, DatabaseID, Region) VALUES (?, ?, ?)`;

        const getValue = row => {
          return alternate[row] ? alternate[row][0] : null;
        };

        const values = [
          getValue('AlternateName'),
          getValue('DatabaseID'),
          getValue('Region'),
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

module.exports = { fillGameAlternate };
