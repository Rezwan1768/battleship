import { Ship } from "./ship.js";
import { ShipManager } from "./shipManager.js";
import { isCellInBounds, marker } from "./utils.js";

export class Gameboard {
  constructor() {
    this.boardSize = 10;
    // 10x10 board initialized with null values
    this.board = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(null),
    );
    this.shipManager = new ShipManager();
  }

  placeShips() {
    this.shipManager.placeAllShipsOnBoard(this.board);
  }

  receiveAttack(row, col) {
    if (!isCellInBounds(row, col, this.boardSize)) return { markedCells: [] };

    // Prevent attacking a cell that is already attacked or blocked
    if ([marker.MISS, marker.BLOCK, marker.HIT].includes(this.board[row][col]))
      return { markedCells: [] };

    // Computer player will have a set containing all the valid cells to hit,
    // Marked cells will be removed from the set
    let markedCells = [`${row}, ${col}`];
    let isHit = false;
    let isSunk = false;
    let adjacentCells = [];

    // Attack hits ship
    if (this.board[row][col] instanceof Ship) {
      const ship = this.board[row][col];
      ship.hit(); // Increase hit counter of the ship
      isHit = true;
      this.board[row][col] = marker.HIT;

      if (ship.isSunk()) {
        this.shipManager.numberOfShips--;
        markedCells = markedCells.concat(
          this._markSunkShipArea(row, col, ship),
        );

        isSunk = true;
      } else {
        markedCells = markedCells.concat(this._markNearbyCorners(row, col));
        adjacentCells = this._getAdjacentCells(row, col);
      }
    } else {
      this.board[row][col] = marker.MISS;
      markedCells = [`${row}, ${col}`];
    }
    return isHit && !isSunk
      ? { markedCells, isHit, isSunk, adjacentCells }
      : { markedCells, isHit, isSunk };
  }

  // When a ship sinks, the surrounding area can't be targeted
  _markSunkShipArea(row, col, ship) {
    let { rowStart, colStart, size, isHorizontal } = ship;
    let rowEnd = isHorizontal ? rowStart : rowStart + size - 1;
    let colEnd = isHorizontal ? colStart + size - 1 : colStart;
    const markedCells = [];

    for (let i = rowStart - 1; i <= rowEnd + 1; ++i) {
      for (let j = colStart - 1; j <= colEnd + 1; ++j) {
        if (isCellInBounds(i, j, this.boardSize) && this.board[i][j] === null) {
          this.board[i][j] = marker.BLOCK;
          markedCells.push(`${i}, ${j}`);
        }
      }
    }
    return markedCells;
  }

  // Since ships can't be next to each other, the corner cells can
  // be marked to indicate that there can't be any ships in those cells.
  _markNearbyCorners(row, col) {
    const markedCells = [];
    for (let i = row - 1; i <= row + 1; i += 2) {
      for (let j = col - 1; j <= col + 1; j += 2) {
        if (isCellInBounds(i, j, this.boardSize) && this.board[i][j] === null) {
          this.board[i][j] = marker.BLOCK;
          markedCells.push(`${i}, ${j}`);
        }
      }
    }
    return markedCells;
  }

  // For computer player to target adjacent cell after hitting a ship
  _getAdjacentCells(row, col) {
    // Amount to add to row and col to get each adjacent cell
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const adjacentCells = [];
    for (let [i, j] of directions) {
      let adjRow = row + i;
      let adjCol = col + j;

      if (
        isCellInBounds(adjRow, adjCol, this.boardSize) &&
        (this.board[adjRow][adjCol] === null ||
          this.board[adjRow][adjCol] instanceof Ship)
      )
        adjacentCells.push(`${adjRow}, ${adjCol}`);
    }

    return adjacentCells;
  }

  areAllShipSunk() {
    return this.shipManager.numberOfShips === 0;
  }
}
