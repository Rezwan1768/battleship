import { getShipInfo, getStartingCell } from "./utils/utils.js";
import {
  clearElementListClasses,
  updateShipVisuals,
} from "./utils/domUtils.js";

let mouseMoveListenerAdded = false;
let lastMouseX = 0;
let lastMouseY = 0;

export function enableRotation(
  gameboard,
  boardElement,
  shipSegments,
  target,
  ghostCells,
  hiddenShipSegments,
) {
  // Get the mouse location
  if (!mouseMoveListenerAdded) {
    document.addEventListener("mousemove", (e) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });
    mouseMoveListenerAdded = true;
  }

  return (event) => {
    const isRow = shipSegments[0].dataset.isRow === "true";

    if (event.key === "r" || event.key === "R") {
      // Update the orientation flag of the ship segments in the DOM
      shipSegments.forEach((segment) => {
        segment.dataset.isRow = !isRow;
      });

      clearElementListClasses(ghostCells, ["valid", "invalid"]);
      clearElementListClasses(hiddenShipSegments, ["hide"]);

      const shipInfo = getShipInfo(target);
      const { shipSize, isHorizontal } = shipInfo;
      const boardBox = boardElement.getBoundingClientRect();
      const segmentSize = boardBox.width / gameboard.boardSize;

      // Determine the  cell where the first segment of the ship will be placed
      const [startRow, startCol] = getStartingCell(
        { x: lastMouseX, y: lastMouseY },
        boardBox,
        shipInfo,
        segmentSize,
      );

      // Identify and process the cells where the ship might be placed
      if (gameboard.canPlaceShip(startRow, startCol, shipSize, isHorizontal)) {
        updateShipVisuals({
          boardElement,
          startRow,
          startCol,
          shipSize,
          isHorizontal,
          isValid: true,
          ghostCells,
        });
      } else {
        updateShipVisuals({
          boardElement,
          startRow,
          startCol,
          shipSize,
          isHorizontal,
          isValid: false,
          ghostCells,
          hiddenShipSegments,
        });
      }
    }
  };
}
