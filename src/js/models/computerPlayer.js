import { Player } from "./player.js";
import { getRandomIndex } from "./utils.js";

export class ComputerPlayer extends Player {
  constructor() {
    super();
    // Computer needs to keep track of what opponent cells are valid to attack
    this.validCellsToAttack = new Set();
    for (let row = 0; row < 10; ++row) {
      for (let col = 0; col < 10; ++col) {
        this.validCellsToAttack.add(`${row},${col}`);
      }
    }

    // Adjacent cells to the first attacked cell of a ship
    this.adjacentTargets = [];
    this.attackedShipCells = []; // Attacked cells of a ship
    this.switchDirection = false;
    this.isShipInRow = false;
  }

  attack(opponentBoard) {
    if (this.validCellsToAttack.size === 0) return;
    let attackCoord = null;
    // attack in a straight line when two adjacent cells of a ship has been hit
    if (this.attackedShipCells.length >= 2)
      attackCoord = this.getNextCoordInDirection();
    else if (this.adjacentTargets.length > 0)
      attackCoord = this.getAdjacentCoord();
    else attackCoord = this.getRandomCoord();
    const {
      markedCells,
      isHit,
      isSunk,
      adjacentCells = [],
    } = opponentBoard.receiveAttack(...attackCoord);

    if (markedCells.length > 0) this._removeMarkedCells(markedCells);
    if (isHit) {
      this.attackedShipCells.push(attackCoord);
      // Attacking two adjacent ship cells reveals its orientation (horizontal?)
      if (this.attackedShipCells.length === 2) this._determineShipOrientation();

      // Only needed to find the second hit
      if (!isSunk && this.adjacentTargets.length === 0)
        this.adjacentTargets = adjacentCells;
    }

    // Reset the stored states once the ship sinks
    if (isSunk) {
      this.adjacentTargets = [];
      this.attackedShipCells = [];
      this.switchDirection = false;
    }

    return { markedCells, isHit };
  }

  // Attack the same row/column of the hit ship, until the ship is sunk
  getNextCoordInDirection() {
    let [xFirst, yFirst] = this.attackedShipCells[0]; // First hit in sequence
    let [xLast, yLast] = this.attackedShipCells.at(-1); // Most recent hit
    let nextCoord = null;

    let direction = 0;
    // Determine attack direction based on the last hit. It's the next
    // cell that comes in a straight line
    if (this.isShipInRow) direction = yLast > yFirst ? 1 : -1;
    else direction = xLast > xFirst ? 1 : -1;

    if (!this.switchDirection) {
      nextCoord = this.isShipInRow
        ? [xLast, yLast + direction]
        : [xLast + direction, yLast];

      if (this.validCellsToAttack.has(`${nextCoord[0]},${nextCoord[1]}`))
        return nextCoord;

      // Switch directions when target is invalid
      this.switchDirection = true;
      this.pivotHit = [...this.attackedShipCells[0]];
      direction = -direction; // Change the first attacks direction manually
    }

    // Attack in opposite direction form the first hit cell of the ship.
    nextCoord = this.isShipInRow
      ? [this.pivotHit[0], this.pivotHit[1] + direction]
      : [this.pivotHit[0] + direction, this.pivotHit[1]];
    this.pivotHit = [...nextCoord]; // Update the pivotHit

    if (this.validCellsToAttack.has(`${nextCoord[0]},${nextCoord[1]}`))
      return nextCoord;

    return this.getRandomCoord();
  }

  // When a ship is hit, one of the adjacent cell is part of the ship
  getAdjacentCoord() {
    if (this.adjacentTargets.length === 0) return this.getRandomCoord();

    let index = getRandomIndex(this.adjacentTargets.length);
    let coord = this.adjacentTargets[index].split(",").map(Number);
    this.adjacentTargets.splice(index, 1);
    return coord;
  }

  getRandomCoord() {
    if (this.validCellsToAttack.size === 0) return;
    let values = Array.from(this.validCellsToAttack);
    let randomIndex = getRandomIndex(values.length);
    return values[randomIndex].split(",").map(Number);
  }

  _determineShipOrientation() {
    let x1 = this.attackedShipCells[0][0];
    let x2 = this.attackedShipCells[1][0];
    this.isShipInRow = x1 === x2;
  }

  _removeMarkedCells(markedCells) {
    for (let coord of markedCells) {
      this.validCellsToAttack.delete(coord);
    }
  }
}
