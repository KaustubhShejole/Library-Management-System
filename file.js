// jshint esversion:6
// const fs = require('fs');
//
// // Get the current date and time
// const currentDate = new Date().toISOString();
//
// // Remove non-alphabetic characters and replace them with underscores
// const sanitizedDate = currentDate.replace(/[^a-zA-Z0-9]/g, '_');
//
// // Construct the file path
// const filePath = `book_${sanitizedDate}.csv`;
//
// // Data to be written (for example)
// const data = 'Some CSV data here...';
//
// // Write to file
// fs.writeFile(filePath, data, (err) => {
//   if (err) {
//     console.error('Error writing to file:', err);
//     return;
//   }
//   console.log('Data written to file successfully.');
// });

const fs = require('fs');

// List of subjects
const subjects = [
  "DMS", "SOFTWARE", "JAVA", "UNIX", "EMB-SYS", "COMPILER", "IOOM", "DATA-STRUCT", "PEARL", "DBMS", "CO",
  "ALGO-GENTIC", "MISC", "DESIGN", "SYS-PRO", "COMMU", "WEB-TECH", "C", "MICRO-PROC", "ORACLE", "VB", "GRAPH-TH",
  "DATA-MINING", "BIO-INFO", "CPL", "ALGO", "PROGRAM", "OS", "COBOL", "DCMP", "TCOM", "VC", "COMMU-SYS", "LISP",
  "OLE", "GRAPHICS", "PASCAL", "PC", "C&C++", "C++", "AI", "PHP", "RTS", "NETWORK", "SOFT-COMP", "ACA", "XML",
  "CONTROL-SYS", "DSP", "DOS", "INFO-SYS", "MULTI-MEDIA", "MATH", "CRYPTO", "NETWORK SECURITY", "SOLARIS", "DISTRI-SYS",
  "WINDOWS", "SOFT-ENGG", "FORMAL-METH", "SIG-SYS", "PYTHON", "CLOUD COMPUTING", "DSPD", "NEURO-FUZY", "PR", "EMB SYS",
  "GATE", "GRAPH THEORY", "DMGT", "INFO-RETRIEV", "HTML", "NET-SECURITY", "IMAGE-PROC", "COMMUNICATION", "AI-ML", "PHY"
];

// Function to convert list of subjects to CSV format
function convertToCSV(subjects) {
  let csv = "name\n"; // Header row

  // Convert each subject to CSV format
  subjects.forEach(subject => {
    csv += `"${subject}"\n`; // Add quotes to handle strings with commas
  });

  return csv;
}

// Write CSV data to a file
fs.writeFileSync('excel/sample1/subjects.csv', convertToCSV(subjects));

console.log('CSV file created successfully.');
