export class Ship {
  constructor(size) {
    this.size = size;
    this.hits = 0;
  }

  hit = () => this.hits++;
  isSunk = () => this.hits === this.size;
}
