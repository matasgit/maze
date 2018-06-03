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
  this.start = null;
  this.finish = null;

  this.frontier = [];
  this.newFrontier = [];
  this.distanceTraveled = 0;
  this.finished = false;
  
  this.init = function() {
    for(let r = 0; r < this.rows; r++) {
      this.grid.push([]);
      for(let c = 0; c < this.columns; c++) {
        this.grid[r].push(new Cell(r, c));
      }
    }
    this.generateBinaryTreeMaze();
    this.placeStartFinishMarkers();
    this.setNeighbours();

    this.frontier.push(this.start);

  }

  this.draw = function() {

    this.walkBinaryTreeMaze();
    
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

  this.placeStartFinishMarkers = function() {
    
    let start = this.grid[Math.floor(Math.random() * this.rows)][Math.floor(Math.random() * this.columns)];
    start.isStart = true;
    this.start = start;

    let finish = this.grid[Math.floor(Math.random() * this.rows)][Math.floor(Math.random() * this.columns)];
    finish.isFinish = true;
    this.finish = finish; 
    
  }

  this.setNeighbours = function() {
    for(let r = 0; r < this.rows; r++) {
      for(let c = 0; c < this.columns; c++) {
        if(!this.grid[r][c].borders.top){
          this.grid[r][c].neighbours.push(this.grid[r-1][c]);
        }
        if(!this.grid[r][c].borders.right){
          this.grid[r][c].neighbours.push(this.grid[r][c+1]);
        }
        if(!this.grid[r][c].borders.bottom){
          this.grid[r][c].neighbours.push(this.grid[r+1][c]);
        }
        if(!this.grid[r][c].borders.left){
          this.grid[r][c].neighbours.push(this.grid[r][c-1]);
        }
      }
    }
  }

  this.walkBinaryTreeMaze = function() {
    if(!this.finished){
      this.newFrontier = [];
      for(let i = 0; i < this.frontier.length; i++){
        
        this.frontier[i].distanceFromStart = this.distanceTraveled;
        this.frontier[i].visited = true;
  
        if(this.frontier[i].isFinish){  

          let backtrackCell = this.frontier[i];        
          while (backtrackCell){
            backtrackCell.color = 'rgba(0, 0, 255, 0.15)';
            backtrackCell = backtrackCell.getNeighbourWithSmallestDistance();
          }

          this.finished = true;
          break;
        }
        for(let j = 0; j < this.frontier[i].neighbours.length; j++){
          if(!this.frontier[i].neighbours[j].visited){
            this.newFrontier.push(this.frontier[i].neighbours[j]);
          }
        }
      }
      this.frontier = this.newFrontier;
      this.distanceTraveled++;
    }
  }

}

function Cell(row, column) {
  
  this.row = row;
  this.column = column;
  this.size = 20; // pixels
  this.color = 'rgba(0, 255, 0, 0.15)';
  this.borders = {
    top: true,
    right: true,
    bottom: true,
    left: true
  };
  this.isStart = false;
  this.isFinish = false;
  this.neighbours = [];
  this.visited = false;
  this.distanceFromStart = 0;

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

    if(this.isStart){
      fill('rgba(64, 255, 0, 0.5)');
      noStroke();
      rect(this.column * this.size, this.row * this.size, this.size, this.size);
    }

    if(this.isFinish){
      fill('rgba(0, 192, 255, 0.5)');
      noStroke();
      rect(this.column * this.size, this.row * this.size, this.size, this.size);
    }

    if(this.visited){
      fill(this.color);
      noStroke();
      rect(this.column * this.size, this.row * this.size, this.size, this.size);
    }

    if(this.distanceFromStart){
      textSize(9);
      fill(100);
      text(this.distanceFromStart, (this.column * this.size)+2, (this.row * this.size)+10);
    }

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

  this.getNeighbourWithSmallestDistance = function() {

    let neighbours = [];
    let result = null;

    for(let i = 0; i < this.neighbours.length; i++) {
      if(this.neighbours[i].isStart){
        return null;
      }
      if(this.neighbours[i].distanceFromStart > 0){
        neighbours.push(this.neighbours[i]);
        if(!result){
          result = this.neighbours[i];
        }
      }
    }

    for(let i = 0; i < neighbours.length; i++) {
      if(neighbours[i].distanceFromStart < result.distanceFromStart){
        result = neighbours[i];
      }
    }

    return result;
  }
  
}
