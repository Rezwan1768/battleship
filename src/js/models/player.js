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
    console.log(x, y);
    const { markedCells } = opponentBoard.receiveAttack(x, y);
    return markedCells;
  }

  isGameOver() {
    return this.gameboard.areAllShipSunk();
  }
}
