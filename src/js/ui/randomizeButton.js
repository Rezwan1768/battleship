import { createElement } from "./utils/utils.js";
import { placeShipsOnBoard, clearShipsFormBoard } from "./utils/domUtils.js";

export function getRandomizeShipsBtn(player, boardElement) {
  const button = createElement({
    element: "button",
    content: "Reposition Ships",
    classes: ["reposition-ship"],
  });

  button.addEventListener("click", () => {
    clearShipsFormBoard(player, boardElement);
    placeShipsOnBoard(player, boardElement);
    console.log(player.gameboard.board);
  });
  return button;
}
