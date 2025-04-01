export class Ship {
  constructor(rowStart, colStart, size, isHorizontal) {
    this.rowStart = rowStart;
    this.colStart = colStart;
    this.rowEnd = isHorizontal ? rowStart : rowStart + size - 1;
    this.colEnd = isHorizontal ? colStart + size - 1 : colStart;
    this.size = size;
    this.hits = 0;
    this.isHorizontal = isHorizontal;
  }

  updatePosition(rowStart, colStart, isHorizontal) {
    this.rowStart = rowStart;
    this.colStart = colStart;
    this.isHorizontal = isHorizontal;
    this.rowEnd = isHorizontal ? rowStart : rowStart + this.size - 1;
    this.colEnd = isHorizontal ? colStart + this.size - 1 : colStart;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits === this.size;
  }
}
