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
  }

  this.draw = function() {
    for(let r = 0; r < this.rows; r++) {
      for(let c = 0; c < this.columns; c++) {
        this.grid[r][c].draw();
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
  
}
