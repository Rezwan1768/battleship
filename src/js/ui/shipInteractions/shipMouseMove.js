import { getShipInfo, getStartingCell, updateShipVisuals } from "./utils.js";
import { isMouseOutsideWindow, isShipOutOfBounds } from "./boundaryUtils.js";

import { clearElementListClasses } from "../utils.js";

export function mouseMoveHandler(
  gameboard,
  boardElement,
  shipSegments,
  target,
  shipInfo,
  ghostCells,
  hiddenShipSegments,
  startX,
  startY,
) {
  function onMouseMove(event) {
    // Remove previous visual indicators before updating new ones.
    clearElementListClasses(ghostCells, ["valid", "invalid"]);
    clearElementListClasses(hiddenShipSegments, ["hide"]);
    const boardBox = boardElement.getBoundingClientRect();

    // event.target may refer to an overlapped ship,
    // use the original segment from mouseDown instead
    const updatedShipInfo = getShipInfo(target);
    const { shipSize, isHorizontal } = updatedShipInfo;
    const segmentSize = boardBox.width / gameboard.boardSize;

    // Determine the cell for the ship’s starting segment
    const [startRow, startCol] = getStartingCell(
      { x: event.clientX, y: event.clientY },
      boardBox,
      updatedShipInfo,
      segmentSize,
    );

    const isValid = gameboard.canPlaceShip(
      startRow,
      startCol,
      shipSize,
      isHorizontal,
    );

    // Show ghost cells at potential placement location
    updateShipVisuals({
      boardElement,
      startRow,
      startCol,
      shipSize,
      isHorizontal,
      isValid,
      ghostCells,
      hiddenShipSegments: isValid ? null : hiddenShipSegments,
    });

    // Prevent dragging ship outside of the board
    if (
      isMouseOutsideWindow(event) ||
      isShipOutOfBounds(
        boardElement,
        shipSegments,
        updatedShipInfo,
        segmentSize,
        event,
      )
    ) {
      // Clear ghost and overlap visuals
      clearElementListClasses(ghostCells, ["valid", "invalid"]);
      clearElementListClasses(hiddenShipSegments, ["hide"]);

      shipSegments.forEach((segment) => {
        segment.classList.remove("invalid", "hover");
        segment.dataset.isRow = shipInfo.isHorizontal; // Revert orientation
        segment.style.transform = `translate(0px, 0px)`; // Back to original location
      });

      boardElement.removeEventListener("mousemove", onMouseMove);
    } else {
      // Calculate movement delta (translate only affects visuals,
      // not actual DOM position)
      let deltaX = event.clientX - startX;
      let deltaY = event.clientY - startY;

      // Move ship to new location
      shipSegments.forEach((segment) => {
        segment.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
    }
  }
  return onMouseMove;
}
