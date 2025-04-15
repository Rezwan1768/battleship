import { createElement, isDirectInstanceOf } from "./utils.js";
import { onMouseDown } from "./shipInteractions/initShipDrag.js";
import { Player } from "../models/player.js";

// Remove all existing ship elements from the board
export function clearShipElements(boardElement) {
  const shipSegments = boardElement.querySelectorAll(".ship");
  shipSegments.forEach((segment) => {
    segment.remove();
  });
}

// Render all ships for a given player onto the board
export function renderShips(player, boardElement) {
  const isHumanPlayer = isDirectInstanceOf(player, Player);

  // Loop through each ship and place it on the board
  for (let shipId = 0; shipId < player.ships.length; ++shipId) {
    const ship = player.ships[shipId];
    placeShip(ship, shipId, player.gameboard, boardElement, isHumanPlayer);
  }
}

// Place a single ship on the board at its designated position
function placeShip(ship, id, gameboard, boardElement, isHumanPlayer) {
  // Index of the current ship segment, used to track individual parts
  let shipSegmentNum = 0;

  for (let row = ship.rowStart; row <= ship.rowEnd; ++row) {
    for (let col = ship.colStart; col <= ship.colEnd; ++col) {
      const shipElem = createElement({
        element: "div",
        classes: isHumanPlayer ? ["ship"] : ["ship", "hidden"],
        // Attributes for identifying and interacting with the ship segment
        attributes: {
          "data-id": id,
          "data-size": ship.size,
          "data-is-row": ship.isHorizontal,
          "data-piece-number": shipSegmentNum++,
        },
      });

      // Allow ships on human player's board to be draggable
      if (isHumanPlayer) {
        shipElem.addEventListener(
          "mousedown",
          onMouseDown(gameboard, boardElement),
        );
      }

      const cell = boardElement.querySelector(
        `[data-row="${row}"][data-col="${col}"]`,
      );

      cell.appendChild(shipElem);
    }
  }
}
