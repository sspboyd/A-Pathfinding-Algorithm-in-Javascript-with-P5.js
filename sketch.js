function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}



cols = 5;
rows = 5;

var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start, end;

var w, h;

function Spot(i, j) {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.x = i;
    this.y = j;


    this.show = function(col) {
        fill(col);
        noStroke();
        rect(this.x * w, this.y * h, w - 1, h - 1);
    }
}



function setup() {
    createCanvas(400, 400);
    console.log("A*");

    w = width / cols;
    h = height / rows;

    // Making a 2D array
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }
    start = grid[0][0];
    end = grid[cols - 1][rows - 1];


removeFromArray(openSet, current)
    openSet.push(current);

}

function draw() {
    background(47);

    if (openSet.length > 0) {
        winner = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        // keep going
        var current = openSet[winner];
        if (openSet[winner] === end) {
            console.log("Done!");
        }
        closedSet.push(current);
        removeFromArray(openSet, current);
    } else {
        //no solution
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j].show(255);

        }
    }
    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(199, 76, 123));
    }
    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(76, 123, 199));
    }

}
