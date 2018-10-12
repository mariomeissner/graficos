

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
    var transX = height * 0.5;
    var transY = width * 0.5;

    // Contenedor de acciones
    var actions = [];


    // Draw black border around canvas
    c.strokeStyle = 'black';
    c.lineWidth = 2;
    c.strokeRect(0, 0, width, height);

    // Draw axis lines
    this.actionPoint = function (x, y, color = 'black') {
        c.fillStyle = color;
        c.fillRect(x + transX, y + transY, 2, 2);
        addAction(new Point(x, y))
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

    this.slopeIntersect = function(x1, y1, x2, y2) {
        line = [Point(x1, y1)]

        // If first point farther right than last one, swap points
        if (x1 > x2) {
            temp = x2;
            x2 = x1;
            x1 = temp;

            temp = y2;
            y2 = y1;
            y1 = temp;
        }

        // If vertical line, special algorithm
        if (x2 - x1 == 0) {
            y = y1;
            // If first point below last one, increase
            if (y1 < y2) {
                while (y <= y2) {
                    list.push(x1, y)
                }
            } else {
                y = y2;
            }

        // Else normal algorithm
        } else {
            m = (y2 - y1) / (x2 - x1);
            b = y1 - m*x1;
            x = x1;
            while(x <= x2){
                line.push(new Point(x, m*x + b));
                x + 1;
            }
        }
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

    function addAction(action) {
        actions.push(action);
        document.getElementById("actions_box").innerText += 
        "\n" + action.toString();
    }

    // Listen for mouse clicks over canvas
    canvas.addEventListener('click', function (event) {
        var pos = getMouseCoordinates(canvas, event);
        painter.actionPoint(pos.x, pos.y);
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



function Point(x, y){
    this.x = x;
    this.y = y;

    this.toString = function() {
        return "Point(" + this.x + ", " + this.y + ")";
    }
}