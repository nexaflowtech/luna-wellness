const { createCanvas } = require('canvas');
const fs = require('fs');

const canvas = createCanvas(1284, 2778);
const ctx = canvas.getContext('2d');

// Background
ctx.fillStyle = '#080B14';
ctx.fillRect(0, 0, 1284, 2778);

// Title
ctx.fillStyle = '#F1F5F9';
ctx.font = 'bold 120px Arial';
ctx.textAlign = 'center';
ctx.fillText('Luna', 642, 1350);

// Subtitle
ctx.fillStyle = '#6EE7B7';
ctx.font = '48px Arial';
ctx.fillText('Your AI Health Coach', 642, 1450);

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./assets/splash.png', buffer);

console.log('Splash generated at ./assets/splash.png');
