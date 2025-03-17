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
    console.log(x, y);
    const { markedCells } = opponentBoard.receiveAttack(x, y);
    return markedCells;
  }

  isGameOver() {
    return this.gameboard.areAllShipSunk();
  }
}
