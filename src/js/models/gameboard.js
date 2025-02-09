import { Ship } from "./ship.js";
import { ShipManager } from "./shipManager.js";
import { isCellInBounds, marker } from "./utils.js";
import {
  markSunkShipArea,
  markNearbyCorners,
  getAdjacentCells,
} from "./gameboardHelper.js";

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
        markedCells = markedCells.concat(markSunkShipArea(ship, this.board));

        isSunk = true;
      } else {
        markedCells = markedCells.concat(
          markNearbyCorners(row, col, this.board),
        );
        adjacentCells = getAdjacentCells(row, col, this.board);
      }
    } else {
      this.board[row][col] = marker.MISS;
      markedCells = [`${row}, ${col}`];
    }
    return isHit && !isSunk
      ? { markedCells, isHit, isSunk, adjacentCells }
      : { markedCells, isHit, isSunk };
  }

  areAllShipSunk() {
    return this.shipManager.numberOfShips === 0;
  }
}
