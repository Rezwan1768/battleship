import { createElement } from "./utils/utils.js";
import { onMouseDown } from "./shipMouseDown.js";

export function clearShipElements(boardElement) {
  const shipSegments = boardElement.querySelectorAll(".ship");
  shipSegments.forEach((segment) => {
    segment.remove();
  });
}

export function renderShips(player, boardElement) {
  for (let shipId = 0; shipId < player.ships.length; ++shipId) {
    const ship = player.ships[shipId];
    placeShip(ship, shipId, player.gameboard, boardElement);
  }
}

function placeShip(ship, id, gameboard, boardElement) {
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

      shipElem.addEventListener(
        "mousedown",
        onMouseDown(gameboard, boardElement),
      );
      const cell = boardElement.querySelector(
        `[data-row="${row}"][data-col="${col}"]`,
      );

      cell.appendChild(shipElem);
    }
  }
}
