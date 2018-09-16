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
var start;
var end;

var w, h;

function Spot(i, j) {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.i = i;
    this.j = j;
    this.neighbours = [];


    this.show = function(col) {
        fill(col);
        noStroke();
        rect(this.i * w, this.j * h, w - 1, h - 1);
    }

    this.addNeighbours = function(grid) {
        this.i = i;
        this.j = j;
        if (i < cols - 1) {
            this.neighbours.push(grid[i + 1, j]);
        }
        if (i > 0) {
            this.neighbours.push(grid[i - 1, j]);
        }
        if (j < rows - 1) {
            this.neighbours.push(grid[i, j + 1]);
        }
        if (j > 0) {
            this.neighbours.push(grid[i, j - 1]);
        }
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
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbours(grid);
        }
    }
    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    openSet.push(start);



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
        if (current === end) {
            console.log("Done!");
        }

        removeFromArray(openSet, current);
        closedSet.push(current);
    } else {
        //no solution
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(255);

        }
    }
    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(199, 76, 123));
    }
    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(76, 199, 123));
    }

}
