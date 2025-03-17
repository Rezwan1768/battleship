import { createElement } from "./utils.js";

export function createGameBoard(boardElement, player, hideShip = false) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = createElement("button", ["cell"]);
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (!hideShip && player.gameboard.board[row][col] !== null) {
        cell.classList.add("ship"); // Add CSS class if a ship is present
      }

      boardElement.appendChild(cell);
    }
  }
}
