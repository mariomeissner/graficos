

canvas = document.querySelector(".canvas");
p = new Painter(canvas);

function Painter(canvas) {

    // Auxiliary reference to this
    var painter = this;

    // Side length of fake pixel, in pixels
    var pixelSize = 6;

    // Status attributes
    var axisVisible = false;
    var actions = [];
    var drawMode = "point";

    // Get the canvas
    // var canvas = canvas; ???

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

    // Draw a point on screen
    this.point = function (x, y, color = 'black') {

        // Snap point to grid
        x += transX;
        y += transY;
        x = x - x % pixelSize;
        y = y - y % pixelSize;

        // Paint on canvas
        c.fillStyle = color;
        c.fillRect(x, y, pixelSize, pixelSize);
        point = new Point(x, y);
        addAction(point);
    }

    // Axis visibility toggle
    this.setAxisVisibility = function() {
        c.strokeStyle = axisVisible ? 'white' : 'black';
        c.strokeRect(0, transY, width, 0);
        c.strokeRect(transX, 0, 0, height);
        axisVisible = !axisVisible;
    } 

    // Set axis visible
    this.showAxis = function() {
        c.strokeStyle = 'black';
        c.strokeRect(0, transX, width, 0);
        c.strokeRect(transY, 0, 0, height);
        axisVisible = true;
    }

    // Set axis invisible
    this.hideAxis = function() {
        c.strokeStyle = 'white';
        c.strokeRect(0, transX, width, 0);
        c.strokeRect(transY, 0, 0, height);
        axisVisible = false;
    }

    function updateCoordinates(pos) {
        x = Math.floor(pos.x / pixelSize);
        y = Math.floor(pos.y / pixelSize);
        var message = '(' + x + ', ' + y + ")";
        document.getElementById('mouse-box').innerHTML = message
    }

    function getMouseCoordinates(canvas, evt) {
        return {
            x: (evt.clientX - canvas.offsetLeft - transX),
            y: (evt.clientY - canvas.offsetTop - transY)
        }
    }

    function clickEvent(x, y) {
        switch (drawMode) {
            case "point":
                painter.point(x, y);
                break;
        
            case "line":

                break;

            default:
                break;
        }
    }

    function addAction(action) {
        actions.push(action);
        document.getElementById("actions-box").innerText += 
        action.toString() + "\n";
    }

    // Listen for mouse clicks over canvas
    canvas.addEventListener('click', function (event) {
        var pos = getMouseCoordinates(canvas, event);
        clickEvent(pos.x, pos.y);
    })

    // Listen for mouse movements over canvas and update info box
    canvas.addEventListener('mousemove', function (event) {
        var pos = getMouseCoordinates(canvas, event);
        updateCoordinates(pos);
    }, false);

    // Button listeners
    document.getElementById("axis").addEventListener("click", this.setAxisVisibility);

    
    // SHAPES

    // Point
    function Point(x, y){
        this.x = Math.floor(x / pixelSize);
        this.y = Math.floor(y / pixelSize);
        this.toString = function() {
            return "Point(" + this.x + ", " + this.y + ")";
        }
    }

    function Line(x1, y1, x2, y2) {
        
    }

}



