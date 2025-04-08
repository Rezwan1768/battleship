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
  #boardSize = 10;
  #isBoardEmpty = true;
  constructor() {
    // 10x10 board initialized with null values
    this.#board = Array.from({ length: this.#boardSize }, () =>
      Array(this.#boardSize).fill(null),
    );

    // Controls ship related functionality
    this.shipManager = new ShipManager(this.#boardSize);
    this.ships = this.shipManager.ships;
  }

  get board() {
    return this.#board;
  }

  get boardSize() {
    return this.#boardSize;
  }

  canPlaceShip(rowStart, colStart, shipSize, isHorizontal) {
    return this.shipManager.canPlaceShipOnBoard(
      rowStart,
      colStart,
      shipSize,
      isHorizontal,
      this.#board,
    );
  }

  placeShips() {
    if (this.#isBoardEmpty) {
      this.shipManager.placeAllShipsOnBoard(this.#board);
      this.#isBoardEmpty = false;
    }
  }

  clearBoard() {
    this.#board = Array.from({ length: this.#boardSize }, () =>
      Array(this.#boardSize).fill(null),
    );
    this.ships.length = 0;
    this.#isBoardEmpty = true;
  }

  removeShip(ship) {
    this.shipManager.removeShip(ship, this.#board);
  }

  moveShip(shipId, rowStart, colStart, isHorizontal) {
    this.shipManager.moveShip(
      shipId,
      rowStart,
      colStart,
      isHorizontal,
      this.board,
    );
    console.log(this.board);
  }

  // Returns an object with newly marked cells after attack, and other properties
  receiveAttack(row, col) {
    // invalid cell
    if (
      !isCellInBounds(row, col, this.#boardSize) ||
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
    // return isHit && !isSunk
    //   ? { markedCells, isHit, isSunk, adjacentCells }
    //   : { markedCells, isHit, isSunk };

    return { markedCells, isHit, isSunk, adjacentCells };
  }

  areAllShipSunk() {
    return this.shipManager.numberOfShips === 0;
  }
}
