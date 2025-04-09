import { renderShips, clearShipElements } from "../ship.js";

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

export function clearElementListClasses(elementList, classes = []) {
  elementList.forEach((element) => {
    element.classList.remove(...classes);
  });
  elementList.length = 0;
}
