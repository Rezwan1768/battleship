import { getShipInfo, getStartingCell, updateShipVisuals } from "./utils.js";
import { clearElementListClasses } from "../utils.js";

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
  // Track latest mouse location (used to rotate relative to pointer)
  if (!mouseMoveListenerAdded) {
    document.addEventListener("mousemove", (e) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });
    mouseMoveListenerAdded = true;
  }

  return (event) => {
    if (event.key !== "r" && event.key !== "R") return;

    const currentIsRow = shipSegments[0].dataset.isRow === "true";
    const newIsRow = !currentIsRow;

    // Flip orientation on all segments
    shipSegments.forEach((segment) => {
      segment.dataset.isRow = newIsRow;
    });

    // Clear any previous visuals
    clearElementListClasses(ghostCells, ["valid", "invalid"]);
    clearElementListClasses(hiddenShipSegments, ["hide"]);

    const shipInfo = getShipInfo(target);
    const { shipSize } = shipInfo;
    const boardBox = boardElement.getBoundingClientRect();
    const segmentSize = boardBox.width / gameboard.boardSize;

    const [startRow, startCol] = getStartingCell(
      { x: lastMouseX, y: lastMouseY },
      boardBox,
      shipInfo,
      segmentSize,
    );

    const isValidPlacement = gameboard.canPlaceShip(
      startRow,
      startCol,
      shipSize,
      newIsRow,
    );

    updateShipVisuals({
      boardElement,
      startRow,
      startCol,
      shipSize,
      isHorizontal: newIsRow,
      isValid: isValidPlacement,
      ghostCells,
      hiddenShipSegments: isValidPlacement ? null : hiddenShipSegments,
    });
  };
}
