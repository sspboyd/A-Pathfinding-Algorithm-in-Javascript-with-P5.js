function Spot(i, j) { // The Spot object
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.i = i; // grid index for cols
    this.j = j; // grid index for rows
    this.neighbours = []; // and array to hold the surrounding Spots

    // "previous" will eventually be used to determine who to connect back to if
    // this Spot ends up being on the path from "start" to "end"
    this.previous = undefined;
    this.wall = false; // is this Spot a wall??

    if (random(1) < 0.47) { // randomly make some Spots into walls
        this.wall = true;
    }

    this.show = function(col) { // render this Spot on the canvas
        fill(col);
        if (this.wall) {
            fill(color(0));
        }
        noStroke();
        rect(this.i * w + 1, this.j * h + 1, w - 2, h - 2);
    }

    this.addNeighbours = function(grid) { // find all the surrounding Spots
        this.i = i;
        this.j = j;

        // this is just for convenience so I don't have to keep typing "this.neighbours"
        var tn = this.neighbours;
        if (i < cols - 1) { // above
            tn.push(grid[i + 1][j]);
        }
        if (i > 0) { // below
            tn.push(grid[i - 1][j]);
        }
        if (j < rows - 1) { // right
            tn.push(grid[i][j + 1]);
        }
        if (j > 0) { // left
            tn.push(grid[i][j - 1]);
        }
        //diagonals
        if (i > 0 && j > 0) { // above left
            tn.push(grid[i - 1][j - 1]);
        }
        if (i > 0 && j < rows - 1) { // above right
            tn.push(grid[i - 1][j + 1]);
        }
        if (i < cols - 1 && j > 0) { // below left
            tn.push(grid[i + 1][j - 1]);
        }
        if (i < cols - 1 && j < rows - 1) { // below right
            tn.push(grid[i + 1][j + 1]);
        }
    }
}
