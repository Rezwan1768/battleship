import { Gameboard } from "./gameboard.js";
import { getRandomIndex } from "./utils.js";

export class Player {
  constructor(isComputer = false) {
    this.gameboard = new Gameboard();
    this.gameboard.placeShips();
    this.isComputer = isComputer;

    if (isComputer) {
      // Computer needs to keep track of what cells are valid to attack
      this.validCellsToAttack = new Set();
      for (let row = 0; row < 10; ++row) {
        for (let col = 0; col < 10; ++col) {
          this.validCellsToAttack.add(`${row},${col}`);
        }
      }

      this.adjacentTargets = [];
      this.hitShipCells = [];
      this.switchDirection = false;
    }
  }

  attack(opponentBoard, x, y) {
    return opponentBoard.receiveAttack(x, y);
  }

  computerAttack(opponentBoard) {
    if (!this.isComputer) return;
    let attackCoord = null;

    if (this.hitShipCells.length >= 2)
      attackCoord = this.getNextCoordInDirection();
    else if (this.adjacentTargets.length > 0)
      attackCoord = this.getAdjacentCoord();
    else attackCoord = this.getRandomCoord();

    const {
      markedCells,
      isHit,
      isSunk,
      adjacentCells = [],
    } = this.attack(opponentBoard, ...attackCoord);

    if (markedCells.length > 0) this._removeMarkedCells(markedCells);
    if (isHit) {
      this.hitShipCells.push(attackCoord);
      if (this.hitShipCells.length === 2) this._determineShipOrientation();
      if (!isSunk && this.adjacentTargets.length === 0)
        this.adjacentTargets = adjacentCells;
    }

    // Reset the stored states once the ship sinks
    if (isSunk) {
      this.adjacentTargets = [];
      this.hitShipCells = [];
      this.switchDirection = false;
    }
  }

  // Attack the same row/column of the hit ship, until the ship is sunk
  getNextCoordInDirection() {
    let [xFirst, yFirst] = this.hitShipCells[0]; // First hit in sequence
    let [xLast, yLast] = this.hitShipCells[this.hitShipCells.length - 1]; // Most recent hit

    let nextCoord = null;
    // Next target is the cell next to the last hit cell
    let direction = this.isShipInRow
      ? yLast > yFirst
        ? 1
        : -1
      : xLast > xFirst
        ? 1
        : -1;

    if (!this.switchDirection) {
      nextCoord = this.isShipInRow
        ? [xLast, yLast + direction]
        : [xLast + direction, yLast];

      if (this.validCellsToAttack.has(`${nextCoord[0]},${nextCoord[1]}`))
        return nextCoord;

      // Switch directions when target is invalid
      this.switchDirection = true;
      this.lastHit = [...this.hitShipCells[0]];
      direction = -direction; // Change the first attacks direction manually
    }

    nextCoord = this.isShipInRow
      ? [this.lastHit[0], this.lastHit[1] + direction]
      : [this.lastHit[0] + direction, this.lastHit[1]];
    this.lastHit = [...nextCoord]; // Update the lastHit

    if (this.validCellsToAttack.has(`${nextCoord[0]},${nextCoord[1]}`))
      return nextCoord;

    return this.getRandomCoord();
  }

  // When a ship is hit, it's other cells will be adjacent to the hit cell
  getAdjacentCoord() {
    let index = getRandomIndex(this.adjacentTargets.length);
    let coord = this.adjacentTargets[index].split(",").map(Number);
    this.adjacentTargets.splice(index, 1);
    return coord;
  }

  getRandomCoord() {
    let values = Array.from(this.validCellsToAttack);
    let randomIndex = getRandomIndex(values.length);
    return values[randomIndex].split(",").map(Number);
  }

  _determineShipOrientation() {
    let x1 = this.hitShipCells[0][0];
    let x2 = this.hitShipCells[1][0];
    this.isShipInRow = x1 === x2;
  }

  _removeMarkedCells(markedCells) {
    for (let coord of markedCells) {
      this.validCellsToAttack.delete(coord);
    }
  }

  isGameOver() {
    return this.gameboard.areAllShipSunk();
  }
}
