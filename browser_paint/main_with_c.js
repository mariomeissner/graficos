class Painter {

    clickEvent(x, y) {
        switch (this.drawMode) {
            case "point":
                this.drawPoint(x, y);
                break;

            case "line":

                break;

            default:
                break;
        }
    }
    
    drawPoint(x, y) {
        cm.point(x, y);
        var point = new Point(x, y);
        addAction(point);
    }

    drawLine(x1, y1, x2, y2) {

        var pointList = Algorithms.slopeIntersect(x1, y1, x2, y2);
        console.log(pointList);
        for (var i = 0; i < pointList.length; i++) {
            cm.point(pointList[i].x, pointList[i].y);
        }
        var line = new Line(pointList[0], pointList[pointList.length - 1]);
        addAction(line);
    }

    addAction(action) {
        this.actions.push(action);
        document.getElementById("actions-box").innerText +=
            action.toString() + "\n";
    }

    configure() {

        // Listen for mouse clicks over canvas
        cm.canvas.addEventListener('click', function (event) {
            var pos = cm.getMouseCoordinates(event);
            this.clickEvent(pos.x, pos.y);
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
            this.drawMode = "point";
        });
        document.getElementById("line-mode").addEventListener("click", function () {
            this.drawMode = "line";
        });

    }

    constructor(cm) {
        this.actions = [];
        this.configure();
        this.drawMode = "point";
    }
}

class Algorithms {

    static slopeIntersect(x1, y1, x2, y2) {

        var list = [];

        // If first point farther right than last one, run backwards
        if (x1 > x2) {
            list = Algorithms.slopeIntersect(x2, y2, x1, y1)
        }

        // If vertical 
        else if (x2 - x1 == 0) {

            // If first point above last one, run backwards
            if (y1 > y2) {
                list = Algorithms.slopeIntersect(x2, y2, x1, y1);
            } else {
                for (var y = y1; y <= y2; y++) {
                    list.push(x1, y);
                }
                return list;
            }

        } else {
            var m = (y2 - y1) / (x2 - x1);
            var b = y1 - m * x1;
            // If slope higher than 45 deg, flip axis
            if (m > 1) {
                list = Algorithms.flipAxis(Algorithms.slopeIntersect(y1, x1, y2, x2))
            } else {
                for (var x = x1; x <= x2; x++) {
                    list.push(new Point(x, Math.round(m * x + b)));
                }
            }
        }

        return list;
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

class CanvasManager {

    constructor(canvas) {
        this.canvas = canvas;
        // Auxiliary reference to this
        this.painter = this;

        // Side length of fake pixel, in pixels
        this.pixelSize = 6;

        // Status attributes
        this.axisVisible = false;
        this.drawMode = "point";

        // Get the 2D context of the canvas
        this.c = canvas.getContext('2d');

        // Get size variables
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Translation values, in real pixels
        this.transX = this.width * 0.5;
        this.transY = this.height * 0.5;

        // Draw black border around canvas
        this.c.strokeStyle = 'black';
        this.c.lineWidth = 2;
        this.c.strokeRect(0, 0, this.width, this.height);
    }



    // Paints a point on canvas
    point(x, y, color = 'black') {

        // Turns fake pixels into real pixels
        x *= this.pixelSize;
        y *= this.pixelSize;
        x += this.transX;
        y += this.transY;

        // Paint on canvas
        this.c.fillStyle = color;
        this.c.fillRect(x, y, this.pixelSize, pixelSize);
    }

    // Axis visibility toggle
    setAxisVisibility() {
        this.c.strokeStyle = this.axisVisible ? 'white' : 'black';
        this.c.strokeRect(0, this.transY, this.width, 0);
        this.c.strokeRect(this.transX, 0, 0, this.height);
        this.axisVisible = !this.axisVisible;
    }

    // Set axis visible
    showAxis() {
        this.c.strokeStyle = 'black';
        this.c.strokeRect(0, this.transX, this.width, 0);
        c.strokeRect(this.transY, 0, 0, this.height);
        this.axisVisible = true;
    }

    // Set axis invisible
    hideAxis() {
        this.c.strokeStyle = 'white';
        this.c.strokeRect(0, this.transX, this.width, 0);
        this.c.strokeRect(this.transY, 0, 0, this.height);
        this.axisVisible = false;
    }

    // Returns coordinates of a mouse click in fake pixels
    getMouseCoordinates(evt) {
        return {
            x: Math.floor((evt.clientX - this.canvas.offsetLeft - this.transX) / this.pixelSize),
            y: Math.floor((evt.clientY - this.canvas.offsetTop - this.transY) / this.pixelSize)
        }
    }
}


// SHAPES

class Line {
    constructor(first, last) {
        this.first = first;
        this.last = last;
    }

    toString() {
        return "Line((" + this.first.x + ", " + this.first.y + ") -> (" + this.last.x + ", " + this.last.y + "))";
    }

}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return "Point(" + this.x + ", " + this.y + ")";
    }
}

canvas = document.querySelector(".canvas");
cm = new CanvasManager(canvas);
p = new Painter(cm);