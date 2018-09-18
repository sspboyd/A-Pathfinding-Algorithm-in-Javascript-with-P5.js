// Grid size
var cols = 47;
var rows = 29;

var grid = new Array(cols);

// An array of Spots that have not been checked to see if they are in fact the
// "end" or how far the heuristic thinks they might be from the "end".
var openSet = [];

// An array of Spots that were in the openSet and have been deemed to be not the
// best option for getting to the "end".
var closedSet = [];
var start; // A var to hold the Spot that we are going to say is the beginning.
var end; // A var to hold the Spot we are going to say is the target/end point.
var path = []; // An array of Spots that are on the way from "start" to "end"

// used for scaling the size of each Spot on the grid when being displayed
var w, h;

function setup() {
    createCanvas(500, 400);
    console.log("A*");

    // set the scaling
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

    // Now go find all the neighbours for each Spot on the grid
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbours(grid);
        }
    }

    start = grid[0][0]; // set the starting Spot
    end = grid[cols - 1][rows - 1]; // and the ending Spot
    start.wall = false; // make sure the start isn't a wall
    end.wall = false; // make sure the end isn't a wall

    openSet.push(start); // Prime the pump by adding the start to the openSet.
}

function draw() {

    if (openSet.length > 0) { // is there anything in the openSet, ie unchecked
        var winner = 0;

        // find the Spot with the lowest f and call it winner
        for (var i = 0; i < openSet.length; i++) {
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

        // so, not at the 'end' and we've evaluated this Spot. Take it out of the openSet
        removeFromArray(openSet, current);
        closedSet.push(current); // and add it to the Spots that have been checked

        // Lets look at 'current' Spot's neighbours

        // make a new var and store "current" Spot's neighbours in "neighbours"
        var neighbours = current.neighbours;

        // go through each of "current" Spot's neighbours
        for (var i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];

            // check and see if this neighbour is valid, as in it hasn't been
            // check before and it isn't a wall
            if (!closedSet.includes(neighbour) && !neighbour.wall) {

                // add an additional "step" to the g value. This basically means
                // it is one step further away from the "start" Spot
                var tempG = current.g + 1;

                // a var to track a possible new path if the g value is better
                var newPath = false; // assumes new path isn't better to begin

                // check and see if this "neighbour" Spot is in the openSet
                if (openSet.includes(neighbour)) {
                    if (tempG < neighbour.g) { // im getting confused here.
                        neighbour.g = tempG;
                        newPath = true; // yep, better path bc lower g
                    }
                } else {
                    neighbour.g = tempG;
                    newPath = true; // better bc it didn't exist before(?)
                    openSet.push(neighbour);
                }

                if (newPath) { // only make new path if g was better
                    // figure out the h value for this neighbour using the heuristic
                    neighbour.h = heuristic(neighbour, end);

                    // add up g+h to get the f value for this Spot
                    neighbour.f = neighbour.g + neighbour.h;

                    // now set the "current" Spot as the 'previous' (parent) for
                    // this neighbour Spot
                    neighbour.previous = current;
                }
            }
        } // finish looping through the rest of the "current" Spot neighbours
    } else {
        //No solution. Nothing left in the openSet. No path to the "end" Spot
        console.log("No Solution!");
        noLoop(); // stop the draw function
        return; // not exactly sure what this is for.
    }


    background(0);

    // cycle through every spot in the grid and display the spot with the
    //specified colour
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

    // create new array of Spots from the "current" Spot connecting back to the
    // "start" Spot
    path = [];
    var temp = current; // create a var 'temp' to begin working backwards from
    path.push(temp); // add this 'temp' Spot to the path array

    // as long as the 'temp' Spot has a value for 'previous', run this loop
    while (temp.previous) {
        path.push(temp.previous); // add the Spot in temp.previous to the path array
        temp = temp.previous; // now make temp.previous the new temp
    }

    // go through all the path Spots and colour them the specified colour (blueish here)
    for (var i = 0; i < path.length; i++) {
        path[i].show(color(76, 123, 199));
    }
}


// small function to handle removing an element from an array
function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

// This is where the "cost" of getting from Spot a (current) to Spot b (the end)
// is figured out
function heuristic(a, b) {
    // var d = dist(a.i, a.j, b.i, b.j);
    var d = abs(a.i - b.i) + abs(a.j - b.j);
    return d;
}
