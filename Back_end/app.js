// import "./App.css";
// import express from "express";
// import helmet from "helmet";
import App from '../Front_end/src/App.jsx'

// const csv = require('csvtojson');
// const fs = require('fs');

// const csvFilePath = 'data.csv';

// csv()
//     .fromFile(csvFilePath)
//     .then((jsonObj) => {
//         // Write the JSON array to a file
//         fs.writeFileSync('data.json', JSON.stringify(jsonObj, null, 4));
//         console.log('Conversion successful!');
//     });

// function App() {
//   const changeHandler = (event) => {
//     console.log(event.target.files[0])
//   };
//   return (
//     <div>
//       {/* File Uploader */}
//       <input
//         type="file"
//         name="file"
//         accept=".csv"
//         onChange={changeHandler}
//         style={{ display: "block", margin: "10px auto" }}
//       />
//     </div>
//   );
// }

// const xlsx = require('xlsx');

// function convertWorkbookToObjects(filePath) {
//     // Load the Excel workbook
//     const workbook = xlsx.readFile(filePath);
    
//     // Create an object to store data from all sheets
//     const workbookData = {};

//     // Iterate through every sheet in the workbook
//     workbook.SheetNames.forEach(sheetName => {
//         const worksheet = workbook.Sheets[sheetName];
        
//         // Convert the rows to an array of JavaScript objects
//         // The header option ensures the first row is used as property names
//         const rowsAsObjects = xlsx.utils.sheet_to_json(worksheet, { header: 'A' });
        
//         workbookData[sheetName] = rowsAsObjects;
//     });

//     return workbookData;
// }

// // Example usage:
// const results = convertWorkbookToObjects('D:/Pacharachon_Work/CurriculumGuide/Front_end/src/data/AUN QA 2025 (Non-electronics).xlsx');
// console.log(results);



// function App() {
//     return (
//         <div>
//             <h1>Curriculum Guide</h1>
//             <p>Default app loaded successfully.</p>
//         </div>
//     );
// }

// export default App;
