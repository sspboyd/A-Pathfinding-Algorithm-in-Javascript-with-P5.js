function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}


function heuristic(a, b) {
    // var d = dist(a.i, a.j, b.i, b.j);
    var d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
}

cols = 47;
rows = 47;

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
    this.wall = false;

    if (random(1) < 0.33) {
        this.wall = true;
    }


    this.show = function(col) {
        fill(col);
        if (this.wall) {
            fill(color(0));
        }
        noStroke();
        rect(this.i * w + 1, this.j * h + 1, w - 2, h - 2);
    }

    this.addNeighbours = function(grid) {
        this.i = i;
        this.j = j;
        var tn = this.neighbours;
        if (i < cols - 1) {
            tn.push(grid[i + 1][j]);
        }
        if (i > 0) {
            tn.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            tn.push(grid[i][j + 1]);
        }
        if (j > 0) {
            tn.push(grid[i][j - 1]);
        }

        //diagonals
        if (i > 0 && j > 0) { // top left
            tn.push(grid[i - 1][j - 1]);
        }
        if (i > 0 && j < rows - 1) { // top right
            tn.push(grid[i - 1][j + 1]);
        }
        if (i < cols - 1 && j > 0) { // bottom left
            tn.push(grid[i + 1][j - 1]);
        }
        if (i < cols - 1 && j < rows - 1) { // bottom right
            tn.push(grid[i + 1][j + 1]);
        }
    }
}


function setup() {
    createCanvas(500, 400);
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
    start.wall = false;
    end.wall = false;

    openSet.push(start);
}

function draw() {
    background(0);

    if (openSet.length > 0) { // is there anything in the openSet, ie unchecked
        var winner = 0;
        for (var i = 0; i < openSet.length; i++) { // find the Spot with the lowest f and call it winner
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        // keep going
        var current = openSet[winner]; // call the 'winner' Spot 'current'
        if (current === end) { // are we at the end? If yes, then done!
            noLoop();
            console.log("Done!");
        }

        removeFromArray(openSet, current); // so, not at the 'end' and we've evaluated this Spot. Take it out of the openSet
        closedSet.push(current); // and add it to the Spots that have been checked

        // Lets look at 'current' Spot's neighbours
        var neighbours = current.neighbours; // make a new var and store "current" Spot's neighbours in "neighbours"
        for (var i = 0; i < neighbours.length; i++) { // go through each of "current" Spot's neighbours
            var neighbour = neighbours[i];
            if (!closedSet.includes(neighbour) && !neighbour.wall) { // check and see if this neighbour is valid, as in it hasn't been check before and it isn't a wall
                var tempG = current.g + 1; // add an additional "step" to the g value. This basically means it is one step further away from the "start" Spot
                if (openSet.includes(neighbour)) { // check and see if this "neighbour" Spot is in the openSet
                    if (tempG < neighbour.g) { // im getting confused here.
                        neighbour.g = tempG;
                    }
                } else {
                    neighbour.g = tempG;
                    openSet.push(neighbour);
                }
                neighbour.h = heuristic(neighbour, end); // figure out the h value for this neighbour using the heuristic
                neighbour.f = neighbour.g + neighbour.h; // add up g+h to get the f value for this Spot
                neighbour.previous = current; // now set the "current" Spot as the 'previous' (parent) for this neighbour Spot
            }
        } // finish looping through the rest of the "current" Spot neighbours
    } else {
        //no solution. Nothing left in the openSet. No Spot ended up being the "end" Spot
        console.log("No Solution!");
        noLoop(); // stop the draw function
        return; // not exactly sure what this is for.
    }

    // cycle through every spot in the grid and display the spot with the specified colour
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    // go through all the closedSet Spots and colour them the specified colour (redish here)
    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(199, 76, 123));
    }

    // go through all the openSet Spots and colour them the specified colour (greenish here)
    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(76, 199, 123));
    }

    // Now colour the path found so far
    path = []; // create new array of Spots from the "current" Spot connecting back to the "start" Spot
    var temp = current; // create a var 'temp' to begin working backwards from
    path.push(temp); // add this 'temp' Spot to the path array
    while (temp.previous) { // as long as the 'temp' Spot has a value for 'previous', run this loop
        path.push(temp.previous); // add the Spot in temp.previous to the path array
        temp = temp.previous; // now make temp.previous the new temp
    }

    // go through all the path Spots and colour them the specified colour (blueish here)
    for (var i = 0; i < path.length; i++) {
        path[i].show(color(76, 123, 199));
    }
}
