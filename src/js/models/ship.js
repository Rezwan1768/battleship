export class Ship {
  constructor(rowStart, colStart, size, isHorizontal) {
    this.rowStart = rowStart;
    this.colStart = colStart;
    this.size = size;
    this.hits = 0;
    this.isHorizontal = isHorizontal;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits === this.size;
  }
}
