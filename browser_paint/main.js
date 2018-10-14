canvas = document.querySelector(".canvas");
cm = new CanvasManager(canvas);
p = new Painter(cm);

function CanvasManager(canvas) {

    // Offer public access to canvas
    this.canvas = canvas;

    // Auxiliary reference to this
    var painter = this;

    // Side length of fake pixel, in pixels
    var pixelSize = 6;

    // Status attributes
    var axisVisible = false;
    var drawMode = "point";

    // Get the 2D context of the canvas
    var c = canvas.getContext('2d');

    // Get size variables
    var width = canvas.width;
    var height = canvas.height;

    // Translation values, in real pixels
    var transX = width * 0.5;
    var transY = height * 0.5;

    // Draw black border around canvas
    c.strokeStyle = 'black';
    c.lineWidth = 2;
    c.strokeRect(0, 0, width, height);

    // Paints a point on canvas
    this.point = function (x, y, color = 'black') {

        // Turns fake pixels into real pixels
        x *= pixelSize;
        y *= pixelSize;
        x += transX;
        y += transY;

        // Paint on canvas
        c.fillStyle = color;
        c.fillRect(x, y, pixelSize, pixelSize);
    }

    // Axis visibility toggle
    this.setAxisVisibility = function () {
        c.strokeStyle = axisVisible ? 'white' : 'black';
        c.strokeRect(0, transY, width, 0);
        c.strokeRect(transX, 0, 0, height);
        axisVisible = !axisVisible;
    }

    // Set axis visible
    this.showAxis = function () {
        c.strokeStyle = 'black';
        c.strokeRect(0, transX, width, 0);
        c.strokeRect(transY, 0, 0, height);
        axisVisible = true;
    }

    // Set axis invisible
    this.hideAxis = function () {
        c.strokeStyle = 'white';
        c.strokeRect(0, transX, width, 0);
        c.strokeRect(transY, 0, 0, height);
        axisVisible = false;
    }

    // Returns coordinates of a mouse click in fake pixels
    this.getMouseCoordinates = function(evt) {
        return {
            x: Math.floor((evt.clientX - canvas.offsetLeft - transX) / pixelSize),
            y: Math.floor((evt.clientY - canvas.offsetTop - transY) / pixelSize)
        }
    }
}



function Painter(cm) {

    var actions = [];
    configure();
    drawMode = "point";

    function clickEvent(x, y) {
        switch (drawMode) {
            case "point":
                drawPoint(x, y);
                break;

            case "line":

                break;

            default:
                break;
        }
    }
    function drawPoint(x, y) {
        cm.point(x, y);
        point = new Point(x, y);
        addAction(point);
    }

    function drawLine(start, end) {

        pointLine = a.slopeIntersect(start, end);

        for (point in pointLine) {
            cm.point(point.x, point.y);
        }
        line = new Line(start, end);

    }

    function addAction(action) {
        actions.push(action);
        document.getElementById("actions-box").innerText +=
            action.toString() + "\n";
    }




    function configure() {

        // Listen for mouse clicks over canvas
        cm.canvas.addEventListener('click', function (event) {
            var pos = cm.getMouseCoordinates(event);
            clickEvent(pos.x, pos.y);
        })

        // Listen for mouse movements over canvas and update info box
        canvas.addEventListener('mousemove', function (event) {
            var pos = cm.getMouseCoordinates(event);
            var message = '(' + pos.x + ', ' + pos.y + ")";
            document.getElementById('mouse-box').innerHTML = message

        }, false);

        // Button listeners
        document.getElementById("axis").addEventListener("click", cm.setAxisVisibility);
        document.getElementById("point-mode").addEventListener("click", function () {
            drawMode = "point";
        });
        document.getElementById("line-mode").addEventListener("click", function () {
            drawMode = "line";
        });

    }
}

function Algorithms() {

    this.slopeIntersect = function (x1, y1, x2, y2) {

        list = [];
    
        // If first point farther right than last one, run backwards
        if (x1 > x2) {
            return slopeIntersect(x2, y2, x1, y1)
        }
    
        // If vertical 
        if (x2 - x1 == 0) {
    
            // If first point above last one, run backwards
            if (y1 > y2) {
                return slopeIntersect(x2, y2, x1, y1);
            } else {
    
                y = y1;
                while (y <= y2) {
                    list.push(x1, y);
                    y++;
                }
                return list;
            }
    
        } else {
            m = (y2 - y1) / (x2 - x1);
            b = y1 - m * x1;
            x = x1;
    
            // If slope higher than 45 deg, flip axis
            if (m > 1) {
                return flipAxis(slopeIntersect(y1, x1, y2, x2))
            } else {
                while (x <= x2) {
                    line.push(new Point(x, m * x + b));
                    x + 1;
                }
            }
        }
    }
    
    function flipAxis(pointList) {
        for (point in pointList) {
            temp = point.x;
            point.x = point.y;
            point.y = temp;
        }
    }
}

// Point
function Point(x, y){
    this.x = Math.floor(x);
    this.y = Math.floor(y);
    this.toString = function() {
        return "Point(" + this.x + ", " + this.y + ")";
    }
}

function Line(x1, y1, x2, y2) {
    
}