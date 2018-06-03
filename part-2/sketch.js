let grid;

function setup() {
  createCanvas(1500, 1500);
  grid = new Grid(50, 50);
  grid.init();
}

function draw() {
  background(255);
  grid.draw();
}

function Grid(rows, columns) {
  
  this.rows = rows;
  this.columns = columns;
  this.grid = [];

  this.init = function() {
    for(let r = 0; r < this.rows; r++) {
      this.grid.push([]);
      for(let c = 0; c < this.columns; c++) {
        this.grid[r].push(new Cell(r, c));
      }
    }
    this.generateBinaryTreeMaze();
  }

  this.draw = function() {
    for(let r = 0; r < this.rows; r++) {
      for(let c = 0; c < this.columns; c++) {
        this.grid[r][c].draw();
      }
    }
  }

  this.generateBinaryTreeMaze = function() {
    
    let pathChoises = ["east", "south"];
  
    for(let r = 0; r < this.rows; r++) {
      for(let c = 0; c < this.columns; c++) {
  
        let linkDirection = pathChoises[Math.floor(Math.random() * 2)];
  
        if(linkDirection == "east"){
          if(this.grid[r][c+1] !== undefined){
            // link with the eastern neighbour
            this.grid[r][c].link(this.grid[r][c+1]);
          }
          else{
            // can't link east so link south if possible
            if(this.grid[r+1] !== undefined){
              this.grid[r][c].link(this.grid[r+1][c]);
            }
          }
        }
  
        if(linkDirection == "south"){
          if(this.grid[r+1] !== undefined){
            // link with the southern neighbour
            this.grid[r][c].link(this.grid[r+1][c]);
          }
          else{
            // can't link south so link east if possible
            if(this.grid[r][c+1] !== undefined){
              this.grid[r][c].link(this.grid[r][c+1]);
            }
          }
        }
  
      }
    }
  }

}

function Cell(row, column) {
  
  this.row = row;
  this.column = column;
  this.size = 20; // pixels
  this.borders = {
    top: true,
    right: true,
    bottom: true,
    left: true
  };

  this.draw = function() {

    stroke(0);

    // top border
    if(this.borders.top)
      line(this.column * this.size, this.row * this.size, (this.column + 1) * this.size, this.row * this.size);
    
    // right border
    if(this.borders.right)
      line((this.column + 1) * this.size, this.row * this.size, (this.column + 1) * this.size, (this.row + 1) * this.size);
    
    // bottom border
    if(this.borders.bottom)
      line(this.column * this.size, (this.row + 1) * this.size, (this.column + 1) * this.size, (this.row + 1) * this.size);
    
    // left border
    if(this.borders.left)
      line(this.column * this.size, this.row * this.size, this.column * this.size, (this.row + 1) * this.size);

  }

  this.link = function(cell) {
    
    if(cell.column == this.column) {
      // is the cell a northern or southern neighbour?
      if(cell.row < this.row) {
        // northern neighbour
        cell.borders.bottom = false;
        this.borders.top = false;
      }
      else {
        // southern neighbour
        cell.borders.top = false;
        this.borders.bottom = false;
      }
    }
    else {
      // is the cell an eastern or western neighbour?
      if(cell.column < this.column) {
        // western neighbour
        cell.borders.right = false;
        this.borders.left = false;
      }
      else {
        // eastern neighbour
        cell.borders.left = false;
        this.borders.right = false;
      }
    }
    
  }
  
}
