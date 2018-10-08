

canvas = document.querySelector(".canvas");
p = new Painter(canvas);

function Painter(canvas) {

    // Auxiliary reference to this
    painter = this;

    // Status attributes
    axisVisible = false;

    // Get the canvas
    var canvas = canvas;

    // Get the 2D context of the canvas
    var c = canvas.getContext('2d');

    // Get size variables
    var width = canvas.width;
    var height = canvas.height;

    // Set origin to center by default
    var transX = width * 0.5;
    var transY = height * 0.5;

    // Draw black border around canvas
    c.strokeStyle = 'black';
    c.lineWidth = 2;
    c.strokeRect(0, 0, width, height);

    // Draw axis lines
    this.point = function (x, y, color = 'black') {
        c.fillStyle = color;
        c.fillRect(x + transX, y + transY, 2, 2);
    }

    // Set axis visible or invisible
    this.setAxisVisibility = function() {
        c.strokeStyle = axisVisible ? 'white' : 'black';
        c.strokeRect(0, transX, width, 0);
        c.strokeRect(transY, 0, 0, height);
        axisVisible = !axisVisible;
    } 

    this.showAxis = function() {
        c.strokeStyle = 'black';
        c.strokeRect(0, transX, width, 0);
        c.strokeRect(transY, 0, 0, height);
        axisVisible = true;
    }

    this.hideAxis = function() {
        c.strokeStyle = 'white';
        c.strokeRect(0, transX, width, 0);
        c.strokeRect(transY, 0, 0, height);
        axisVisible = false;
    }

    // Set origin
    this.setOrigin = function() {
        painter.hideAxis()
        transX = parseInt(document.getElementById('textbox_x').value);
        transY = parseInt(document.getElementById('textbox_y').value);
        console.log("Changing to:" + transX + ", " + transY);
        painter.showAxis()
    }

    function updateCoordinates(pos) {
        var message = '(' + pos.x + ', ' + pos.y + ")";
        document.getElementById('mouse-box').innerHTML = message
    }

    function getMouseCoordinates(canvas, evt) {
        return {
            x: evt.clientX - canvas.offsetLeft - transX,
            y: evt.clientY - canvas.offsetTop - transY
        }
    }

    // Listen for mouse clicks over canvas
    canvas.addEventListener('click', function (event) {
        var pos = getMouseCoordinates(canvas, event);
        painter.point(pos.x, pos.y);
    })

    // Listen for mouse movements over canvas and update info box
    canvas.addEventListener('mousemove', function (event) {
        var pos = getMouseCoordinates(canvas, event);
        updateCoordinates(pos);
    }, false);

    // Button listeners
    document.getElementById("axis").addEventListener("click", this.setAxisVisibility);
    document.getElementById("origin").addEventListener("click", this.setOrigin);

}