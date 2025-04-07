import { getShipInfo, getStartingCell } from "./utils.js";

let mouseMoveListenerAdded = false;
let lastMouseX = 0;
let lastMouseY = 0;

export function enableRotation(
  shipSegments,
  target,
  gameboard,
  currentGhostCells,
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

      currentGhostCells.forEach((cell) =>
        cell.classList.remove("valid", "invalid"),
      );
      currentGhostCells.length = 0;

      const shipInfo = getShipInfo(target);
      const { shipSize, isHorizontal } = shipInfo;
      const boardBox = document
        .querySelector(".board.player")
        .getBoundingClientRect();
      const segmentSize = boardBox.width / gameboard.boardSize;

      // Determine the  cell where the first segment of the ship will be placed
      const [startRow, startCol] = getStartingCell(
        { x: lastMouseX, y: lastMouseY },
        boardBox,
        shipInfo,
        segmentSize,
      );

      // Add the appropriate styles to the cell depending on, if it's valid or not
      for (let index = 0; index < shipSize; ++index) {
        let newRow = isHorizontal ? startRow : startRow + index;
        let newCol = isHorizontal ? startCol + index : startCol;
        const cell = document.querySelector(
          `.board.player > .cell[data-row="${newRow}"][data-col="${newCol}"]`,
        );
        if (cell) {
          if (
            gameboard.canPlaceShip(startRow, startCol, shipSize, isHorizontal)
          )
            cell.classList.add("valid");
          else cell.classList.add("invalid");
          console.log(cell);
          currentGhostCells.push(cell);
        }
      }
    }
  };
}
