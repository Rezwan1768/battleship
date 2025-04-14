import { createElement, isDirectInstanceOf } from "./utils.js";
import { Player } from "../models/player.js";

export function createBoard(player) {
  const board = createElement({ element: "div", classes: ["board"] });

  // Determine if the board is for the player or the computer
  const playerType = isDirectInstanceOf(player, Player) ? "player" : "computer";
  board.classList.add(playerType);
  const boardSize = player.gameboard.boardSize;

  // Generate the grid cells and add them to the board
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
