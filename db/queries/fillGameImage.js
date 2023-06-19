const fs = require('fs');

const fillGameImage = db => {
  return new Promise((resolve, reject) => {
    const filePath = '../files/json/Metadata.json';
    const jsonData = fs.readFileSync(filePath, 'utf-8');

    const dataObject = JSON.parse(jsonData);

    const gameImages = dataObject.LaunchBox.GameImage;

    if (!gameImages || gameImages.length === 0) {
      console.error('No Game Images found in the JSON data.');
      reject(new Error('No Game Images found in the JSON data.'));
      return;
    }

    db.run('BEGIN TRANSACTION');

    db.run('DELETE FROM GameImage', function (err) {
      if (err) {
        console.error('Error clearing the table:', err);
        reject(err);
        return;
      }

      console.log('Table cleared.');

      const stmt = db.prepare(
        `INSERT INTO GameImage (DatabaseID, FileName, Type, CRC32) VALUES (?, ?, ?, ?)`
      );

      const insertPromises = gameImages.map(image => {
        const getValue = row => {
          return image[row] ? image[row][0] : null;
        };

        const values = [
          getValue('DatabaseID'),
          getValue('FileName'),
          getValue('Type'),
          getValue('CRC32'),
        ];

        return new Promise((resolve, reject) => {
          stmt.run(values, function (err) {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });

      stmt.finalize();

      Promise.all(insertPromises)
        .then(() => {
          db.run('COMMIT', () => {
            resolve();
          });
        })
        .catch(err => {
          db.run('ROLLBACK', () => {
            reject(err);
          });
        });
    });
  });
};

module.exports = { fillGameImage };
