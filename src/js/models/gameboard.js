import { Ship } from "./ship.js";

export class Gameboard {
  size = 10;
  // Array of 10 arrays, each of length 10, initially contianing null
  board = Array.from({ length: this.size }, () => Array(this.size).fill(null));

  constructor(shipsSizes = [4, 3, 3, 2, 2, 1, 1, 1]) {
    this.shipSizes = shipsSizes; // Size of the ships to be placed on the board
    this.numberOfShips = this.shipSizes.length;
  }

  isCellInBounds(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  canPlaceShip(rowStart, colStart, shipSize, isHorizontal) {
    let rowEnd = isHorizontal ? rowStart : rowStart + shipSize - 1;
    let colEnd = isHorizontal ? colStart + shipSize - 1 : colStart;
    // Ships can't go outside of the board
    if (
      !this.isCellInBounds(rowStart, colStart) ||
      !this.isCellInBounds(rowEnd, colEnd)
    )
      return false;

    // Ships must be separated by at least one cell
    // Checks the area around the coordinates, to see if there is already a ship
    for (let row = rowStart - 1; row <= rowEnd + 1; ++row) {
      for (let col = colStart - 1; col <= colEnd + 1; ++col) {
        if (
          this.isCellInBounds(row, col) &&
          this.board[row][col] instanceof Ship
        )
          return false;
      }
    }
    return true;
  }

  placeShip(ship) {
    for (let i = 0; i < ship.size; ++i) {
      let row = ship.isHorizontal ? ship.rowStart : ship.rowStart + i;
      let col = ship.isHorizontal ? ship.colStart + i : ship.colStart;
      this.board[row][col] = ship;
    }
  }

  placeAllShips() {
    for (let shipSize of this.shipSizes) {
      let isShipPlaced = false;

      // Initially the ships are randomly placed on the board
      while (!isShipPlaced) {
        let rowStart = Math.floor(Math.random() * this.size);
        let colStart = Math.floor(Math.random() * this.size);
        let isHorizontal = Math.random() < 0.5;

        if (this.canPlaceShip(rowStart, colStart, shipSize, isHorizontal)) {
          const ship = new Ship(rowStart, colStart, shipSize, isHorizontal);
          this.placeShip(ship);
          isShipPlaced = true;
        }
      }
    }
  }

  receiveAttack(row, col) {
    const MARK = "o"; // Attacked cells
    const DISABLE = "x"; // Cells that can't be targeted due to game rules
    if (this.board[row][col] === MARK || this.board[row][col] === DISABLE)
      return;

    // Since ships can't be next to each other, the corner cells
    // can be marked to provide advantage for correct guess.
    const markNearbyCorners = (row, col) => {
      for (let i = row - 1; i <= row + 1; i += 2) {
        for (let j = col - 1; j <= col + 1; j += 2) {
          if (this.isCellInBounds(i, j) && this.board[i][j] === null)
            this.board[i][j] = DISABLE;
        }
      }
    };

    const markSunkShipArea = (ship) => {
      let rowStart = ship.rowStart;
      let colStart = ship.colStart;
      let rowEnd = ship.isHorizontal ? rowStart : rowStart + ship.size - 1;
      let colEnd = ship.isHorizontal ? colStart + ship.size - 1 : colStart;

      for (let i = rowStart - 1; i <= rowEnd + 1; ++i) {
        for (let j = colStart - 1; j <= colEnd + 1; ++j) {
          if (this.isCellInBounds(i, j) && this.board[i][j] === null)
            this.board[i][j] = DISABLE;
        }
      }
    };

    // Attack hits ship
    if (this.board[row][col] instanceof Ship) {
      let ship = this.board[row][col];
      ship.hit(); // Increase hit counter of the ship

      // Disable the area around the ship when it sinks
      if (ship.isSunk()) {
        markSunkShipArea(ship);
        this.numberOfShips--;
      } else {
        markNearbyCorners(row, col);
      }
    } else {
      this.board[row][col] = MARK;
    }
  }

  allShipSunk() {
    return this.numberOfShips === 0;
  }
}
