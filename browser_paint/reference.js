
// Get the canvas
var canvas = document.getElementById('myCanvas');

// Get the 2D context of the canvas
var c = canvas.getContext('2d');

// Set full screen
var width = canvas.width; // = window.innerWidth;
var height = canvas.height; // = window.innerHeight;

// Use fillStyle for fill things
c.fillStyle = 'rgb(255, 0, 0)';
c.fillRect = (50, 50, 100, 150);

// Use strokeStyle for line things
c.strokeStyle = 'white';
ctx.lineWidth = 5;
c.strokeRect(0, 0, width, height);

// The above also applies to text
ctx.font = '36px arial';
ctx.strokeText('Canvas text', 50, 50);


// Make everything black
c.fillStyle = 'rgb(0, 0, 0)';
c.fillRect(0, 0, width, height);

// Draw black border around canvas
c.strokeStyle = 'black';
c.lineWidth = 2;
c.strokeRect(0, 0, width, height);

// Make a red box
c.fillStyle = 'rgb(255, 0, 0)';
c.fillRect(50, 50, 100, 150);

// Set full screen
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;