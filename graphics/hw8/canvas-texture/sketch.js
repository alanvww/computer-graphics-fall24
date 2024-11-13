class Cell {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.rectangles = [];
    for (let i = 3; i > 0; i--) {
      this.rectangles.push({

        width: i * 4 + 2,
        height: i * 4 + 2,
        x: this.x + 3,
        y: this.y + 3,
        speedX: random(-1, 1),
        speedY: random(-1, 1)
      });
    }
    this.colors = [color(random(100,255), random(100,255), random(100,255)),
    color(random(100,255), random(100,255), random(100,255)),
    color(random(100,255), random(100,255), random(100,255))];
  }

  update() {
    for (let rect of this.rectangles) {
      rect.x += rect.speedX;
      rect.y += rect.speedY;

      if (rect.x <= this.x || rect.x + rect.width >= this.x + this.size) {
        rect.speedX *= -1;
      }
      if (rect.y <= this.y || rect.y + rect.height >= this.y + this.size) {
        rect.speedY *= -1;
      }
    }
  }

  display() {
    noFill();
    stroke(50);
    rect(this.x, this.y, this.size, this.size);

    noStroke();
    for (let rectangle of this.rectangles) {
      fill(this.colors[this.rectangles.indexOf(rectangle)]);
      rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }
  }
}

let cells = [];
let cellSize = 20

function setup() {
  createCanvas(windowWidth, windowHeight);

  let cols = width / cellSize;
  let rows = height / cellSize;

  // Create cells
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push(new Cell(x * cellSize, y * cellSize, cellSize));
    }
  }
}

function draw() {
  background(0);

  for (let cell of cells) {
    cell.update();
    cell.display();
  }
}