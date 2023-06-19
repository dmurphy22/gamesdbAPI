const fs = require('fs');

const fillMame = db => {
  return new Promise((resolve, reject) => {
    const filePath = '../files/json/Mame.json';
    const jsonData = fs.readFileSync(filePath, 'utf-8');

    const dataObject = JSON.parse(jsonData);

    const mame = dataObject.LaunchBox.MameFile;

    if (!mame || mame.length === 0) {
      console.error('No MAME files found in the JSON data.');
      reject(new Error('No MAME files found in the JSON data.'));
      return;
    }

    db.run('DELETE FROM MameFile', function (err) {
      if (err) {
        console.error('Error clearing the table:', err);
        reject(err);
        return;
      }
      console.log('Table cleared.');

      const insertPromises = mame.map(m => {
        const insertQuery = `INSERT INTO MameFile (FileName, Name, Status, Developer, Publisher, Year, IsMechanical, IsBootleg, IsPrototype, IsHack, IsMature, IsQuiz, IsFruit, IsCasino, IsRhythm, IsTableTop, IsPlayChoice, IsMahjong, IsNonArcade, Genre, PlayMode, Language, Source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const getValue = row => {
          return m[row] ? m[row][0] : null;
        };

        const values = [
          getValue('FileName'),
          getValue('Name'),
          getValue('Status'),
          getValue('Developer'),
          getValue('Publisher'),
          getValue('Year'),
          getValue('IsMechanical'),
          getValue('IsBootleg'),
          getValue('IsPrototype'),
          getValue('IsHack'),
          getValue('IsMature'),
          getValue('IsQuiz'),
          getValue('IsFruit'),
          getValue('IsCasino'),
          getValue('IsRhythm'),
          getValue('IsTableTop'),
          getValue('IsPlayChoice'),
          getValue('IsMahjong'),
          getValue('IsNonArcade'),
          getValue('Genre'),
          getValue('PlayMode'),
          getValue('Language'),
          getValue('Source'),
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

module.exports = { fillMame };
