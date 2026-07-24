const XLSX = require('xlsx');
const fs = require('fs');

const XLSX = require('xlsx');
const fs = require('fs');

// File paths for the two Excel files
const files = ['AUN QA 2025 (Non-electronics).xlsx', 'AUN QA 2025 (Electronics).xlsx'];

// Object to store all structured data
const outputData = {};

files.forEach((filePath) => {
  // Read workbook
  const workbook = XLSX.readFile(filePath);
  
  // Store sheet data under the file name
  outputData[filePath] = {};

  // Loop through each of the 3 worksheets
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    
    // Parse sheet to array of JSON objects
    const sheetData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    
    // Assign to worksheet name
    outputData[filePath][sheetName] = sheetData;
  });
});

// Save all combined data into resources.json
fs.writeFileSync('resources.json', JSON.stringify(outputData, null, 2), 'utf-8');
console.log('Successfully created resources.json!');
