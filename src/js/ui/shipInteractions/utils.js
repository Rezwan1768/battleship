export function getShipInfo(shipSegment) {
  return {
    shipId: Number(shipSegment.dataset.id),
    segmentNumber: Number(shipSegment.dataset.pieceNumber),
    shipSize: Number(shipSegment.dataset.size),
    isHorizontal: shipSegment.dataset.isRow === "true",
  };
}

// Returns the adjusted starting cell (row, column) where the ship's
// first segment will be placed
export function getStartingCell(mouseCoord, boardBox, shipInfo, partSize) {
  // Mouse position relative to board
  const mouseX = mouseCoord.x - boardBox.left;
  const mouseY = mouseCoord.y - boardBox.top;

  // Find the cell the mouse is pointing to
  const targetRow = Math.floor(mouseY / partSize);
  const targetCol = Math.floor(mouseX / partSize);

  // Determine the starting cell where the ship will be placed
  const adjustedRow = shipInfo.isHorizontal
    ? targetRow
    : targetRow - shipInfo.segmentNumber;
  const adjustedCol = shipInfo.isHorizontal
    ? targetCol - shipInfo.segmentNumber
    : targetCol;
  return [adjustedRow, adjustedCol];
}

// Applies visual feedback when hovering a ship over the gameboard.
export function updateShipVisuals({
  boardElement,
  startRow,
  startCol,
  shipSize,
  isHorizontal,
  isValid,
  ghostCells,
  hiddenShipSegments = [],
}) {
  for (let index = 0; index < shipSize; ++index) {
    const row = isHorizontal ? startRow : startRow + index;
    const col = isHorizontal ? startCol + index : startCol;
    const cell = boardElement.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`,
    );

    if (cell) {
      cell.classList.add(isValid ? "valid" : "invalid");
      ghostCells.push(cell);

      if (!isValid) {
        // If the cell already contains a ship part, hide it temporarily
        // and store it so it can be revealed again if placement is cancelled.
        const shipPart = cell.querySelector(".ship");
        if (shipPart) {
          shipPart.classList.add("hide");
          hiddenShipSegments.push(shipPart);
        }
      }
    }
  }
}
