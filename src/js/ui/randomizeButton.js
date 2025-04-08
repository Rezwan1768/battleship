import { createElement } from "./utils.js";
import { placeShipsOnBoard, clearShipsFormBoard } from "./utils.js";

export function getRandomizeShipsBtn(player, boardElement) {
  const button = createElement({
    element: "button",
    content: "Reposition Ships",
  });

  button.addEventListener("click", () => {
    clearShipsFormBoard(player, boardElement);
    placeShipsOnBoard(player, boardElement);
    console.log(player.gameboard.board);
  });
  return button;
}
