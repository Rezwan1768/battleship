import {
  createElement,
  placeShipsOnBoard,
  clearShipsFromBoard,
} from "./utils.js";

export function getRandomizeShipsBtn(player, boardElement) {
  const button = createElement({
    element: "button",
    content: "Reposition Ships",
    classes: ["reposition-ship"],
  });

  button.addEventListener("click", () => {
    clearShipsFromBoard(player, boardElement);
    placeShipsOnBoard(player, boardElement);
  });
  return button;
}
