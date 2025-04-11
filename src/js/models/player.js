import { Gameboard } from "./gameboard.js";

export class Player {
  #gameboard = new Gameboard();
  constructor() {
    this.#gameboard.placeShips();
    this.board = this.#gameboard.board;
    this.ships = this.#gameboard.ships;
  }

  get gameboard() {
    return this.#gameboard;
  }

  attack(opponentBoard, x, y) {
    const { markedCells, isHit } = opponentBoard.receiveAttack(x, y);
    return { markedCells, isHit };
  }

  isGameLost() {
    return this.gameboard.areAllShipSunk();
  }
}
