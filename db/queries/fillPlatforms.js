const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Read the JSON file
const filePath = './files/json/Platforms.json';
const jsonData = fs.readFileSync(filePath, 'utf-8');

// Parse the JSON data into an object
const dataObject = JSON.parse(jsonData);

// Extract the platforms array from the object
const platforms = dataObject.LaunchBox.Platform;

// Check if the platforms array is undefined or empty
if (!platforms || platforms.length === 0) {
  console.error('No platforms found in the JSON data.');
  return;
}

// Open a connection to the database
const db = new sqlite3.Database('database.db');

// Clear the Platform table
db.run('DELETE FROM Platform', function (err) {
  if (err) {
    console.error('Error clearing the table:', err);
    db.close();
    return;
  }
  console.log('Table cleared.');

  // Insert each platform into the Platform table
  platforms.forEach(platform => {
    console.log('Processing platform:', platform);

    const insertQuery = `INSERT INTO Platform (Name, Emulated, ReleaseDate, Developer, Manufacturer, Cpu, Memory, Graphics, Sound, Display, Media, MaxControllers, Notes, Category, UseMameFiles) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Check if a specific row is present in the platform object
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

    console.log('Inserting values:', values);

    db.run(insertQuery, values, function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log(`Platform ${this.lastID} inserted into the database.`);
      }
    });
  });

  // Close the database connection
  db.close();
});
