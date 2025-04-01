import { createElement } from "./utils.js";
import { onMouseDown } from "./shipMouseDown.js";

export function placePlayerShips(player) {
  for (let shipId = 0; shipId < player.ships.length; ++shipId) {
    placeShip(player.ships[shipId], shipId, player.gameboard);
  }
}

function placeShip(ship, id, gameboard) {
  let rowEnd = ship.isHorizontal
    ? ship.rowStart
    : ship.rowStart + ship.size - 1;
  let colEnd = ship.isHorizontal
    ? ship.colStart + ship.size - 1
    : ship.colStart;

  let shipPieceNum = 0;
  for (let row = ship.rowStart; row <= rowEnd; ++row) {
    for (let col = ship.colStart; col <= colEnd; ++col) {
      const shipElem = createElement({
        element: "div",
        classes: ["ship"],
        attributes: {
          "data-id": id,
          "data-size": ship.size,
          "data-is-row": ship.isHorizontal,
          "data-piece-number": shipPieceNum++,
        },
      });

      shipElem.addEventListener("mousedown", onMouseDown(gameboard));
      const cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`,
      );

      cell.appendChild(shipElem);
    }
  }
}
