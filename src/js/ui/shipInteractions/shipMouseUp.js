import { getShipInfo, getStartingCell } from "./utils.js";
import { clearElementListClasses } from "../utils.js";

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
    // When dragging over another ship, event.target may point to the wrong
    // segment, fallback to original ship info
    const targetShipInfo = event.target.matches(
      `.ship[data-id="${shipInfo.shipId}"]`,
    )
      ? getShipInfo(event.target)
      : shipInfo;

    const { shipId, shipSize, isHorizontal } = targetShipInfo;
    const boardBox = boardElement.getBoundingClientRect();
    const segmentSize = boardBox.width / gameboard.boardSize;

    const [startRow, startCol] = getStartingCell(
      { x: event.clientX, y: event.clientY },
      boardBox,
      targetShipInfo,
      segmentSize,
    );

    // Move the ship to new location if it's valid
    if (gameboard.canPlaceShip(startRow, startCol, shipSize, isHorizontal)) {
      shipSegments.forEach((segment, index) => {
        const newRow = isHorizontal ? startRow : startRow + index;
        const newCol = isHorizontal ? startCol + index : startCol;
        const newCell = boardElement.querySelector(
          `.cell[data-row="${newRow}"][data-col="${newCol}"]`,
        );
        if (newCell) {
          newCell.classList.remove("valid");
          segment.remove();
          newCell.appendChild(segment);
        }
      });

      // Update logical gameboard
      gameboard.moveShip(shipId, startRow, startCol, isHorizontal);
    } else {
      // Revert to original board position
      gameboard.moveShip(
        shipInfo.shipId,
        initialRow,
        initialCol,
        shipInfo.isHorizontal,
      );

      // Revert orientation visual if placement was invalid
      shipSegments.forEach(
        (segment) => (segment.dataset.isRow = shipInfo.isHorizontal),
      );
    }

    shipSegments.forEach((segment) => {
      segment.style.removeProperty("transform");
      segment.classList.remove("invalid", "hover");
    });

    clearElementListClasses(ghostCells, ["valid", "invalid"]);
    clearElementListClasses(hiddenShipSegments, ["hide"]);

    boardElement.removeEventListener("mousemove", onMouseMove);
    boardElement.removeEventListener("keydown", onKeyDown);
    // document.removeEventListener("mouseup", onMouseUp); // unnecessary if using `{ once: true }`
  }

  return onMouseUp;
}
