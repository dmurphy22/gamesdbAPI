const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const xmlFolder = './files/xml';
const jsonFolder = './files/json';

// Read the XML files in the folder
fs.readdir(xmlFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach(file => {
    // Check if the file has a .xml extension
    if (path.extname(file).toLowerCase() === '.xml') {
      // Read the XML file
      const xmlPath = path.join(xmlFolder, file);
      const xml = fs.readFileSync(xmlPath, 'utf-8');

      // Convert XML to JSON
      xml2js.parseString(xml, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          // Convert JSON to string and prettify the output
          const json = JSON.stringify(result, null, 2);

          // Create the output JSON file path
          const jsonFileName = `${path.parse(file).name}.json`;
          const jsonPath = path.join(jsonFolder, jsonFileName);

          // Write the JSON to a file
          fs.writeFileSync(jsonPath, json, 'utf-8');

          console.log(`${file} converted to JSON successfully!`);
        }
      });
    }
  });
});
