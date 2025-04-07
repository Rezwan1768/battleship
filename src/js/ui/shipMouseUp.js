import { getShipInfo, getStartingCell } from "./utils.js";

export function mouseUpHandler(
  gameboard,
  shipSegments,
  shipInfo,
  initialRow,
  initialCol,
  onKeyDown,
  onMouseMove,
) {
  function onMouseUp(event) {
    // Get updated information about the ship
    const updatedShipInfo = getShipInfo(event.target);
    const { shipId, shipSize, isHorizontal } = updatedShipInfo;
    const boardBox = document
      .querySelector(".board.player")
      .getBoundingClientRect();
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
        const newParent = document.querySelector(
          `.board.player > .cell[data-row="${newRow}"][data-col="${newCol}"]`,
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
      // Remove the invalid styles when the ship can't be placed
      shipSegments.forEach((segment, index) => {
        let newRow = isHorizontal ? startRow : startRow + index;
        let newCol = isHorizontal ? startCol + index : startCol;
        const cell = document.querySelector(
          `.board.player > .cell[data-row="${newRow}"][data-col="${newCol}"]`,
        );
        if (cell) {
          cell.classList.remove("invalid");
          const shipPart = cell.querySelector(".ship");
          if (shipPart) shipPart.classList.remove("hide");
        }
      });

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

    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("mouseup", onMouseUp);
  }

  return onMouseUp;
}
