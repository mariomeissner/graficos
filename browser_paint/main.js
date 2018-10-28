canvas = document.querySelector(".canvas");
cm = new CanvasManager(canvas);
p = new Painter(cm);

function Painter(cm) {

    var actions = [];
    configure();
    drawMode = "point";
    lineStart = undefined;

    function clickEvent(x, y) {
        var pointList = undefined;

        switch (drawMode) {

            case "point":
                cm.point(x, y);
                cm.save_buffer()
                point = new Point(x, y);
                addAction(point);
                break;

            case "slope-intercept":
                if (lineStart) {
                    pointList = Algorithms.slopeIntersect(lineStart.x, lineStart.y, x, y);
                    lineStart = undefined;
                    drawLine(pointList);
                } else {
                    lineStart = { x, y };
                }
                break;

            case "dda":
                if (lineStart) {
                    pointList = Algorithms.dda(lineStart.x, lineStart.y, x, y);
                    lineStart = undefined;
                    drawLine(pointList);
                } else {
                    lineStart = { x, y };
                }
                break;

            case "bresenham":
                if (lineStart) {
                    pointList = Algorithms.bresenham_full(lineStart.x, lineStart.y, x, y);
                    lineStart = undefined;
                    drawLine(pointList);
                } else {
                    lineStart = { x, y };
                }
                break;

            default:
                break;
        }
    }

    function drawLine(pointList) {
        console.log(pointList);
        for (var i = 0; i < pointList.length; i++) {
            cm.point(pointList[i].x, pointList[i].y);
        }
        line = new Line(pointList[0], pointList[pointList.length - 1]);
        addAction(line);
        cm.save_buffer()
    }

    this.testLine = function (x1, y1, x2, y2) {
        draw_line(x1, y1, x2, y2)
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
        document.getElementById("axis").addEventListener("click", function() {
            cm.showAxis();
            cm.save_buffer();
        });
        document.getElementById("point-mode").addEventListener("click", function () {
            drawMode = "point";
        });
        document.getElementById("slope-intercept").addEventListener("click", function () {
            drawMode = "slope-intercept";
        });

        document.getElementById("dda").addEventListener("click", function () {
            drawMode = "dda";
        });

        document.getElementById("bresenham").addEventListener("click", function () {
            drawMode = "bresenham";
        });

        document.getElementById("undo").addEventListener("click", cm.undo);
        document.getElementById("redo").addEventListener("click", cm.redo);
        document.getElementById("clear").addEventListener("click", function() {
            document.getElementById("actions-box").innerText = "";
            cm.clear();
        });
    }

    this.testPoints = function() {

        function printList(list) {
            var out = "";
            for (var i = 0; i < list.length; i++){
                out += `(${list[i].x}, ${list[i].y}), `;
            }
            return out;
        }

        startPoints = [
            {x: 0, y: 1},
            {x: 1, y: 3},
            {x: 2, y: 1},
            {x: 3, y: 1},
            {x: 3, y: 0},
            {x: 0, y: 0},
            {x: 0, y: 0},
            {x: 0, y: 0},
            {x: -2, y: -3},
            {x: -2, y: -3},
            {x: 2, y: 3},
            {x: 2, y: 3},
            {x: 0, y: 0},
            {x: 12, y: 4},
            {x: -4, y: 2},
            {x: -2, y: 3},
        ];

        endPoints = [
            {x: 7, y: 3},
            {x: 6, y: 3},
            {x: 2, y: 6},
            {x: 6, y: 4},
            {x: 6, y: 12},
            {x: -8, y: -4},
            {x: 8, y: 3},
            {x: 5, y: 5},
            {x: -11, y: -6},
            {x: -11, y: 2},
            {x: -4, y: 7},
            {x: -4, y: -9},
            {x: 11, y: 4},
            {x: 1, y: 1},
            {x: -4, y: -8},
            {x: 9, y: -6}
        ];

        for (var i = 0; i < startPoints.length; i++){
            [x1, y1, x2, y2] = [startPoints[i].x, startPoints[i].y, endPoints[i].x, endPoints[i].y];
            //console.log(`Punto  ${i} con SlopeIntercept:\n`);
            console.log(printList(Algorithms.slopeIntersect(x1, y1, x2, y2)))
            //console.log(`Punto  ${i} con DDA:\n`);
            console.log(printList(Algorithms.dda(x1, y1, x2, y2)));
            //console.log(`Punto  ${i} con Bresenham:\n`);
            console.log(printList(Algorithms.bresenham_full(x1, y1, x2, y2)));
        }

    }
}

class Algorithms {

    static slopeIntersect(x1, y1, x2, y2) {

        var list = [];

        // If first point farther right than last one, run backwards
        if (x1 > x2) {
            list = Algorithms.slopeIntersect(x2, y2, x1, y1).reverse();
        }

        // If vertical 
        else if (x2 - x1 == 0) {

            // If first point above last one, run backwards
            if (y1 > y2) {
                list = Algorithms.slopeIntersect(x2, y2, x1, y1);
            } else {
                for (var y = y1; y <= y2; y++) {
                    list.push(new Point(x1, y));
                }
                return list;
            }

        } else {
            var m = (y2 - y1) / (x2 - x1);
            var b = y1 - m * x1;
            // If slope higher than 45 deg, flip axis
            if (Math.abs(m) > 1) {
                list = Algorithms.flipAxis(Algorithms.slopeIntersect(y1, x1, y2, x2))
            } else {
                for (var x = x1; x <= x2; x++) {
                    list.push(new Point(x, Math.round(m * x + b)));
                }
            }
        }

        return list;
    }

    static dda(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        var l = Math.max(Math.abs(dx), Math.abs(dy));
        dx /= l;
        dy /= l;
        var list = [];
        var x = x1;
        var y = y1;

        for (var i = 0; i <= l; i++) {
            list.push(new Point(Math.round(x), Math.round(y)));
            x = x + dx;
            y = y + dy;

        }

        return list;

    }

    static bresenham_un_cuadrante(x1, y1, x2, y2) {
        var lista = [];

        var x = x1;
        var y = y1;
        var dx = x2 - x1;
        var dy = y2 - -y;
        e = 2 * dy - dx;

        while (i <= dx) {
            lista.push(new Point(x, y))
            if (e > 0) {
                y += 1;
                e -= 2 * dx;
            }
            x = x + 1;
            e += 2 * dy;
        }
    }

    static bresenham_full(x1, y1, x2, y2) {
        var lista = [];

        var x = x1;
        var y = y1;
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var e = 2 * dy - dx;

        var s1 = Math.sign(x2 - x1);
        var s2 = Math.sign(y2 - y1);

        var flag = false;
        if (dy > dx) {
            var temp = dx;
            dx = dy;
            dy = temp;
            flag = true;
        }

        var e = 2 * dy - dx;
        for (var i = 0; i <= dx; i++) {
            lista.push(new Point(x, y));
            while (e > 0) {
                if (flag) {
                    x += s1;
                } else {
                    y += s2;
                }
                e -= 2 * dx;
            }
            if (flag) {
                y += s2;
            } else {
                x += s1;
            }
            e += 2 * dy;
        }
        return lista;

    }

    static flipAxis(pointList) {
        for (var i = 0; i < pointList.length; i++) {
            var temp = pointList[i].x;
            pointList[i].x = pointList[i].y;
            pointList[i].y = temp;
        }
        return pointList;
    }
}

function CanvasManager(canvas) {

    // Offer public access to canvas
    this.canvas = canvas;

    // Auxiliary reference to this
    var painter = this;

    // Side length of fake pixel, in pixels
    var pixelSize = 8;

    // Status attributes
    var axisVisible = false;
    var drawMode = "point";

    // Get the 2D context of the canvas
    var c = canvas.getContext('2d');

    // Get size variables
    var width = canvas.width;
    var height = canvas.height;

    
    // Translation values, in real pixels
    //var transX = width * 0.5;
    //var transY = height * 0.5;

    // new translation
    c.translate(width * 0.5, height * 0.5)

    c.scale(1, -1);

    // Draw black border around canvas
    c.strokeStyle = 'black';
    c.lineWidth = 2;
    c.strokeRect(-width*0.5, -height*0.5, width, height);

    // Store the last 5 states of the canvas for undo-redo functionality
    var clearImage = c.getImageData(0, 0, width, height);
    var buffer = [clearImage];
    var buffer_pos = 0;
    var MAX_LENGTH = 15;

    // Paints a point on canvas
    this.point = function (x, y, color = 'black') {

        // Turns fake pixels into real pixels
        x *= pixelSize;
        y *= pixelSize;

        // Paint on canvas
        c.fillStyle = color;
        c.fillRect(x, y, pixelSize, pixelSize);
    }

    // Axis visibility toggle
    this.setAxisVisibility = function () {
        c.strokeStyle = axisVisible ? 'white' : 'black';
        c.strokeRect(0, -height*0.5, 0, height);
        c.strokeRect(-width*0.5, 0, width, 0);
        axisVisible = !axisVisible;
    }

    // Set axis visible
    this.showAxis = function () {

        c.strokeStyle = 'black';
        c.strokeRect(0, -height*0.5, 0, height);
        c.strokeRect(-width*0.5, 0, width, 0);
        axisVisible = true;

    }

    // Set axis invisible
    this.hideAxis = function () {
        c.strokeStyle = 'white';
        c.strokeRect(0, -height*0.5, 0, height);
        c.strokeRect(-width*0.5, 0, width, 0);
        axisVisible = false;
    }

    // Returns coordinates of a mouse click in fake pixels
    this.getMouseCoordinates = function (evt) {
        return {
            x: Math.floor((evt.clientX - canvas.offsetLeft - width*0.5) / pixelSize),
            y: -Math.ceil((evt.clientY - canvas.offsetTop - height*0.5) / pixelSize)
        }
    }
    
    this.undo = function() {
        if (buffer_pos == 0) return;
        buffer_pos--;
        c.putImageData(buffer[buffer_pos], 0, 0);
    }

    this.redo = function() {
        if (buffer.length == 1 || buffer_pos == buffer.length - 1) return;
        buffer_pos++;
        c.putImageData(buffer[buffer_pos], 0, 0);
    }

    this.save_buffer = function() {
        var imageData = c.getImageData(0, 0, width, height)
        // Delete all buffer elements above current position
        while(buffer_pos < buffer.length - 1){
            buffer.pop()
        }
        // If we reached max length, shift away first element
        if (buffer.length == MAX_LENGTH){
            buffer.shift();
            buffer.push(imageData);
        } else {
            buffer.push(imageData);
            buffer_pos++;
        }
        
    }

    this.clear = function() {
        c.putImageData(clearImage, 0, 0);
        buffer = [clearImage];
        buffer_pos = 0;
    }
    
}


// SHAPES

function Line(first, last) {
    this.first = first;
    this.last = last;
    this.toString = function () {
        return "Line((" + this.first.x + ", " + this.first.y + ") -> (" + this.last.x + ", " + this.last.y + "))";
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.toString = function () {
        return "Point(" + this.x + ", " + this.y + ")";
    }
}