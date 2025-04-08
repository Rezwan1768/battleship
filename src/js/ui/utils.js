import { renderShips, clearShipElements } from "./ship.js";

export function createElement({
  element,
  content = "",
  classes = [],
  attributes = {},
}) {
  if (!Array.isArray(classes)) classes = [];

  const elem = document.createElement(element);
  elem.textContent = content;
  elem.classList.add(...classes);

  for (let key in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, key))
      elem.setAttribute(key, attributes[key]);
  }
  return elem;
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

export function getShipInfo(shipSegment) {
  return {
    shipId: Number(shipSegment.dataset.id),
    segmentNumber: Number(shipSegment.dataset.pieceNumber),
    shipSize: Number(shipSegment.dataset.size),
    isHorizontal: shipSegment.dataset.isRow === "true",
  };
}

// Place the ships on both logical and UI board
export function placeShipsOnBoard(player, boardElement) {
  player.gameboard.placeShips();
  renderShips(player, boardElement);
}

// Remove ships form both logical nad UI board
export function clearShipsFormBoard(player, boardElement) {
  player.gameboard.clearBoard();
  clearShipElements(boardElement);
}
