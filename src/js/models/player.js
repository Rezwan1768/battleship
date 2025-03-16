import { Gameboard } from "./gameboard.js";

export class Player {
  #gameboard;
  constructor() {
    this.#gameboard = new Gameboard();
    this.#gameboard.placeShips();
  }

  get gameboard() {
    return this.#gameboard;
  }

  attack(opponentBoard, x, y) {
    return opponentBoard.receiveAttack(x, y);
  }

  isGameOver() {
    return this.gameboard.areAllShipSunk();
  }
}
