//jshint esversion: 6
const { exec } = require('child_process');

// Start nodemon
const nodemonProcess = exec('nodemon app.js');

// Monitor Chrome process
const chromeProcess = exec('start chrome http://localhost:3000');

// Terminate nodemon and itself when Chrome is closed
chromeProcess.on('exit', () => {
    nodemonProcess.kill();
    process.exit(); // Exit the Node.js script
});

// Handle script termination
process.on('SIGINT', () => {
    nodemonProcess.kill();
    process.exit(); // Exit the Node.js script
});
