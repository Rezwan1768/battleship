import { getStartingCell, getShipInfo } from "./utils/utils.js";
import { isMouseOutsideWindow, isShipOutOfBounds } from "./utils/mouseUtils.js";
import {
  clearElementListClasses,
  updateShipVisuals,
} from "./utils/domUtils.js";
export function mouseMoveHandler(
  gameboard,
  boardElement,
  shipSegments,
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
    //shipSegments.forEach((segment) => segment.classList.remove("invalid"));

    const boardBox = boardElement.getBoundingClientRect();

    // When the dragged ship overlaps another ship, event.target might refer to the overlapped ship.
    // In that case, ignore the new target and keep using the original ship's info.
    let updatedShipInfo = getShipInfo(event.target);
    if (!event.target.matches(`.ship[data-id="${shipInfo.shipId}"`))
      updatedShipInfo = shipInfo;
    const { shipSize, isHorizontal } = updatedShipInfo;
    const segmentSize = boardBox.width / gameboard.boardSize;

    // Determine the  cell where the first segment of the ship will be placed
    const [startRow, startCol] = getStartingCell(
      { x: event.clientX, y: event.clientY },
      boardBox,
      updatedShipInfo,
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
      //shipSegments.forEach((segment) => segment.classList.add("invalid"));
    }

    // Ship can't be dragged outside of board
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
      // Remove all visual indicators
      clearElementListClasses(ghostCells, ["valid", "invalid"]);
      clearElementListClasses(hiddenShipSegments, ["hide"]);

      shipSegments.forEach((segment) =>
        segment.classList.remove("invalid", "hover"),
      );

      // Revert the orientation flag if the ship was rotated but the
      // placement area was invalid.
      shipSegments.forEach(
        (segment) => (segment.dataset.isRow = shipInfo.isHorizontal),
      );

      // Reset ship to its previous position in the UI board
      shipSegments.forEach(
        (segment) => (segment.style.transform = `translate(0px, 0px)`),
      );
      boardElement.removeEventListener("mousemove", onMouseMove);
    } else {
      // Calculate movement delta since `translate` only affects visuals,
      // not the element's actual DOM position.
      // startX / startY: Ships initial coordinate on the DOM.
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
