const fs = require('fs');

const fillFiles = db => {
  return new Promise((resolve, reject) => {
    const filePath = '../files/json/Files.json';
    const jsonData = fs.readFileSync(filePath, 'utf-8');

    const dataObject = JSON.parse(jsonData);

    const files = dataObject.LaunchBox.File;

    if (!files || files.length === 0) {
      console.error('No files found in the JSON data.');
      reject(new Error('No files found in the JSON data.'));
      return;
    }

    db.run('DELETE FROM Files', function (err) {
      if (err) {
        console.error('Error clearing the table:', err);
        reject(err);
        return;
      }
      console.log('Table cleared.');

      const insertPromises = files.map(file => {
        const insertQuery = `INSERT INTO Files (Platform, FileName, GameName) VALUES (?, ?, ?)`;

        const getValue = row => {
          return file[row] ? file[row][0] : null;
        };

        const values = [
          getValue('Platform'),
          getValue('FileName'),
          getValue('GameName'),
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

module.exports = { fillFiles };
