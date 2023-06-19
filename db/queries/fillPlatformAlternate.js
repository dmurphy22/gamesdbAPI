const fs = require('fs');

const fillPlatformAlternate = db => {
  return new Promise((resolve, reject) => {
    const filePath = '../files/json/Metadata.json';
    const jsonData = fs.readFileSync(filePath, 'utf-8');

    const dataObject = JSON.parse(jsonData);

    const platformAlternates = dataObject.LaunchBox.PlatformAlternateName;

    if (!platformAlternates || platformAlternates.length === 0) {
      console.error('No Platform Alternate Names found in the JSON data.');
      reject(new Error('No Platform Alternate Names found in the JSON data.'));
      return;
    }

    db.run('DELETE FROM PlatformAlternateName', function (err) {
      if (err) {
        console.error('Error clearing the table:', err);
        reject(err);
        return;
      }
      console.log('Table cleared.');

      const insertPromises = platformAlternates.map(alternate => {
        const insertQuery = `INSERT INTO PlatformAlternateName (Name, AlternateName) VALUES (?, ?)`;

        const getValue = row => {
          return alternate[row] ? alternate[row][0] : null;
        };

        const values = [getValue('Name'), getValue('AlternateName')];

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

module.exports = { fillPlatformAlternate };
