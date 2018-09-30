
// Get the canvas
var canvas = document.querySelector(".canvas");

// Get the 2D context of the canvas
var c = canvas.getContext('2d');

// Get size variables
var width = canvas.width; 
var height = canvas.height;

// Draw black border around canvas
c.strokeStyle = 'black';
c.lineWidth = 2;
c.strokeRect(0, 0, width, height);

// Listen for mouse movements over canvas and update info box
canvas.addEventListener('mousemove', function(event) {
    var pos = getMousePosition(canvas, event);
    updateCoordinates(pos);
}, false);

canvas.addEventListener('click', function(event) {
    var pos = getMousePosition(canvas, event);
    point(pos);
})





// Functions


// Paints a single point on the canvas
function point(pos, color='black') {
    c.fillStyle = color;
    c.fillRect(pos.x, pos.y, 2, 2);
}

function updateCoordinates(pos) {
    var message = '(' + pos.x + ', ' + pos.y + ")";
    document.getElementById('mouse-box').innerHTML = message
}


function getMousePosition(canvas, evt) {
    return {
        x: evt.clientX - canvas.offsetLeft,
        y: evt.clientY - canvas.offsetTop
    }
}

function oldgetMousePosition(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}