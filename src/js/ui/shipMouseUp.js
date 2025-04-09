import { getShipInfo, getStartingCell } from "./utils/utils.js";
import { clearElementListClasses } from "./utils/domUtils.js";
export function mouseUpHandler(
  gameboard,
  boardElement,
  shipSegments,
  shipInfo,
  initialRow,
  initialCol,
  ghostCells,
  hiddenShipSegments,
  onKeyDown,
  onMouseMove,
) {
  function onMouseUp(event) {
    // When the dragged ship overlaps another ship, event.target might refer to the overlapped ship.
    // In that case, ignore the new target and keep using the original ship's info.
    let updatedShipInfo = getShipInfo(event.target);
    if (!event.target.matches(`.ship[data-id="${shipInfo.shipId}"`))
      updatedShipInfo = shipInfo;
    const { shipId, shipSize, isHorizontal } = updatedShipInfo;

    const boardBox = boardElement.getBoundingClientRect();
    const segmentSize = boardBox.width / gameboard.boardSize;

    // Determine the cell where the first segment of the ship will be placed
    const [startRow, startCol] = getStartingCell(
      { x: event.clientX, y: event.clientY },
      boardBox,
      updatedShipInfo,
      segmentSize,
    );

    if (gameboard.canPlaceShip(startRow, startCol, shipSize, isHorizontal)) {
      // Update the ship's position in the UI board
      shipSegments.forEach((segment, index) => {
        let newRow = isHorizontal ? startRow : startRow + index;
        let newCol = isHorizontal ? startCol + index : startCol;
        const newParent = boardElement.querySelector(
          `.cell[data-row="${newRow}"][data-col="${newCol}"]`,
        );
        if (newParent) {
          newParent.classList.remove("valid");
          segment.remove(); // Remove the segment from its original location
          newParent.appendChild(segment); // Append it to the new cell
        }
      });

      // Update the ship's position in the logical game board
      gameboard.moveShip(shipId, startRow, startCol, isHorizontal);
    } else {
      // // Remove the invalid styles when the ship can't be placed
      // shipSegments.forEach((segment, index) => {
      //   let newRow = isHorizontal ? startRow : startRow + index;
      //   let newCol = isHorizontal ? startCol + index : startCol;
      //   const cell = boardElement.querySelector(
      //     `.cell[data-row="${newRow}"][data-col="${newCol}"]`,
      //   );
      //   if (cell) {
      //     cell.classList.remove("invalid");
      //     const shipPart = cell.querySelector(".ship");
      //     if (shipPart) shipPart.classList.remove("hide");
      //   }
      // });

      // Since the ship gets removed form the logical game board on 'mouseDown',
      // It needs to be re-added back even if the position didn't change.
      gameboard.moveShip(
        shipInfo.shipId,
        initialRow,
        initialCol,
        shipInfo.isHorizontal,
      );

      // Revert the orientation flag if the ship was rotated but the
      // placement area was invalid.
      shipSegments.forEach(
        (segment) => (segment.dataset.isRow = shipInfo.isHorizontal),
      );
    }

    // Remove all visual indicators
    for (let segment of shipSegments) {
      segment.style.removeProperty("transform");
      segment.classList.remove("invalid", "hover");
    }
    clearElementListClasses(ghostCells, ["valid", "invalid"]);
    clearElementListClasses(hiddenShipSegments, ["hide"]);

    boardElement.removeEventListener("mousemove", onMouseMove);
    boardElement.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("mouseup", onMouseUp);
  }

  return onMouseUp;
}
