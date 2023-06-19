const { connectToDatabase } = require('./connect');
const { fillFiles } = require('./queries/fillFiles');
const { fillGame } = require('./queries/fillGame');
const { fillPlatforms } = require('./queries/fillPlatforms');
const { fillGameAlternate } = require('./queries/fillGameAlternate');
const { fillGameImage } = require('./queries/fillGameImage');
const { fillMame } = require('./queries/fillMame');
const { fillPlatformAlternate } = require('./queries/fillPlatformAlternate');

console.log('Starting Import');

connectToDatabase()
  .then(db => {
    return fillFiles(db)
      .then(() => fillGame(db))
      .then(() => fillGameImage(db))
      .then(() => fillGameAlternate(db))
      .then(() => fillPlatforms(db))
      .then(() => fillPlatformAlternate(db))
      .then(() => fillMame(db))
      .then(() => {
        console.log('Finished Import');

        return new Promise((resolve, reject) => {
          db.run('VACUUM;', [], err => {
            if (err) {
              reject(err);
            } else {
              console.log('Database vacuumed successfully.');
              resolve();
            }
          });
        });
      });
  })
  .then(() => {
    console.log('All Done!');
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
