import express from "express";
import path from 'path';

import XLSX from 'xlsx';
import fs from 'fs';

// File paths for the two Excel files
const files = ['Front_end/my-app/src/data/AUN QA 2025 (Non-electronics).xlsx', 'Front_end/my-app/src/data/AUN QA 2025-2026 (Electronics).xlsx'];

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
