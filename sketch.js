function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}


function heuristic(a, b) {
    // var d = dist(a.i, a.j, b.i, b.j);
    var d = abs(a.i-b.i) +abs(a.j-b.j);
    return d;
}

cols = 18;
rows = 18;

var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var path = [];

var w, h;

function Spot(i, j) {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.i = i;
    this.j = j;
    this.neighbours = [];
    this.previous = undefined;


    this.show = function(col) {
        fill(col);
        noStroke();
        rect(this.i * w+1, this.j * h+1, w - 2, h - 2);
    }

    this.addNeighbours = function(grid) {
        this.i = i;
        this.j = j;
        if (i < cols - 1) {
            this.neighbours.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbours.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            this.neighbours.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbours.push(grid[i][j - 1]);
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
    start = grid[3][0];
    end = grid[cols - 4][rows - 3];

    openSet.push(start);
}

function draw() {
    background(47);

    if (openSet.length > 0) {
        var winner = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        // keep going
        var current = openSet[winner];
        if (current === end) {
            noLoop();
            console.log("Done!");
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        var neighbours = current.neighbours;
        for (var i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];
            if (!closedSet.includes(neighbour)) {
                var tempG = current.g + 1;
                if (openSet.includes(neighbour)) {
                    if (tempG < neighbour.g) {
                        neighbour.g = tempG;
                    }
                } else {
                    neighbour.g = tempG;
                    openSet.push(neighbour);
                }
                neighbour.h = heuristic(neighbour, end);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.previous = current;
            }
        }
    } else {
        //no solution
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }
    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(199, 76, 123));
    }
    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(76, 199, 123));
    }

    // find the path
    path = [];
    var temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }

    for (var i = 0; i < path.length; i++) {
        path[i].show(color(76, 123, 199));
    }
}
