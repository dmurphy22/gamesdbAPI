const fs = require('fs');

const fillPlatforms = db => {
  return new Promise((resolve, reject) => {
    const filePath = '../files/json/Platforms.json';
    const jsonData = fs.readFileSync(filePath, 'utf-8');

    const dataObject = JSON.parse(jsonData);

    const platforms = dataObject.LaunchBox.Platform;

    if (!platforms || platforms.length === 0) {
      console.error('No platforms found in the JSON data.');
      reject(new Error('No platforms found in the JSON data.'));
      return;
    }

    db.run('DELETE FROM Platform', function (err) {
      if (err) {
        console.error('Error clearing the table:', err);
        reject(err);
        return;
      }
      console.log('Table cleared.');

      const insertPromises = platforms.map(platform => {
        const insertQuery = `INSERT INTO Platform (Name, Emulated, ReleaseDate, Developer, Manufacturer, Cpu, Memory, Graphics, Sound, Display, Media, MaxControllers, Notes, Category, UseMameFiles) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const getValue = row => {
          return platform[row] ? platform[row][0] : null;
        };

        const values = [
          getValue('Name'),
          getValue('Emulated') === 'true',
          getValue('ReleaseDate'),
          getValue('Developer'),
          getValue('Manufacturer'),
          getValue('Cpu'),
          getValue('Memory'),
          getValue('Graphics'),
          getValue('Sound'),
          getValue('Display'),
          getValue('Media'),
          platform.MaxControllers ? parseInt(platform.MaxControllers[0]) : null,
          getValue('Notes'),
          getValue('Category'),
          getValue('UseMameFiles') === 'true',
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

module.exports = { fillPlatforms };
