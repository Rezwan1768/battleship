import { Ship } from "./ship.js";
import { ShipManager } from "./shipManager.js";
import { isCellInBounds, isCellMarked, marker } from "./utils.js";
import {
  markSunkShipArea,
  markNearbyCorners,
  getAdjacentCells,
} from "./gameboardHelper.js";

export class Gameboard {
  #board;
  constructor() {
    this.boardSize = 10;
    // 10x10 board initialized with null values
    this.#board = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(null),
    );

    // Controls ship related functionality
    this.shipManager = new ShipManager();
  }

  get board() {
    return this.#board;
  }

  clearBoard() {
    this.#board = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(null),
    );
  }

  placeShips() {
    this.shipManager.placeAllShipsOnBoard(this.#board);
  }

  // Returns an object with newly marked cells after attack, and other properties
  receiveAttack(row, col) {
    // invalid cell
    if (
      !isCellInBounds(row, col, this.boardSize) ||
      isCellMarked(this.#board[row][col])
    )
      return { markedCells: [] };

    // Cells marked by attack, the first value is the targeted cell
    let markedCells = [`${row},${col}`];
    let isHit = false;
    let isSunk = false;
    let adjacentCells = [];

    // Attack hits ship
    if (this.#board[row][col] instanceof Ship) {
      const ship = this.#board[row][col];
      ship.hit(); // Increase hit counter of the ship
      isHit = true;
      this.#board[row][col] = marker.HIT;

      if (ship.isSunk()) {
        this.shipManager.numberOfShips--;
        markedCells = markedCells.concat(markSunkShipArea(ship, this.#board));
        isSunk = true;
      } else {
        markedCells = markedCells.concat(
          markNearbyCorners(row, col, this.#board),
        );
        adjacentCells = getAdjacentCells(row, col, this.#board);
      }
    } else {
      this.#board[row][col] = marker.MISS;
    }
    return isHit && !isSunk
      ? { markedCells, isHit, isSunk, adjacentCells }
      : { markedCells, isHit, isSunk };
  }

  areAllShipSunk() {
    return this.shipManager.numberOfShips === 0;
  }
}
