import { createElement } from "./utils/utils.js";
import "../../styles/board.css";

export function createBoard(player) {
  const board = createElement({ element: "div", classes: ["board", "player"] });
  const boardSize = player.gameboard.boardSize;

  for (let row = 0; row < boardSize; ++row) {
    for (let col = 0; col < boardSize; ++col) {
      const cell = createElement({
        element: "button",
        classes: ["cell"],
        attributes: {
          "data-row": row,
          "data-col": col,
        },
      });
      board.appendChild(cell);
    }
  }
  return board;
}
