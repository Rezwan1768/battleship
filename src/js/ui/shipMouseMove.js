export function mouseMoveHandler(
  gameboard,
  shipParts,
  shipInfo,
  startX,
  startY,
) {
  // Stores the cells the ship is currently hovering over
  // to apply and remove ghost effects.
  let currentGhostCells = [];

  function onMouseMove(event) {
    // Remove ghost effect from previously hovered cells and reset the list
    currentGhostCells.forEach((cell) => cell.classList.remove("ghost"));
    currentGhostCells = [];
    shipParts.forEach((part) => part.classList.remove("invalid"));

    const boardBox = document
      .querySelector(".board.player")
      .getBoundingClientRect();
    const { shipSize, isHorizontal, shipPartNumber } = shipInfo;
    const shipPartSize = boardBox.width / gameboard.boardSize;

    // Calculate movement delta since `translate` only affects visuals,
    // not the element's actual DOM position.
    // startX / startY: Ships initial coordinate on the DOM.
    let deltaX = event.clientX - startX;
    let deltaY = event.clientY - startY;

    // Mouse position relative to board
    const mouseX = event.clientX - boardBox.left;
    const mouseY = event.clientY - boardBox.top;
    // Find the cell the mouse is pointing to
    const targetRow = Math.floor(mouseY / shipPartSize);
    const targetCol = Math.floor(mouseX / shipPartSize);

    // Calculate the starting row and column of the ship's new position
    // Adjust based on the piece number to ensure the ship is positioned correctly
    const startRow = isHorizontal ? targetRow : targetRow - shipPartNumber;
    const startCol = isHorizontal ? targetCol - shipPartNumber : targetCol;

    const canPlaceShip = gameboard.canPlaceShip(
      startRow,
      startCol,
      shipSize,
      isHorizontal,
    );

    shipParts.forEach((shipPart, index) => {
      let newRow = isHorizontal ? startRow : startRow + index;
      let newCol = isHorizontal ? startCol + index : startCol;
      const cell = document.querySelector(
        `.board.player > .cell[data-row="${newRow}"][data-col="${newCol}"]`,
      );
      if (cell) {
        if (canPlaceShip) {
          cell.classList.add("ghost");
          currentGhostCells.push(cell);
        } else {
          shipPart.classList.add("invalid");
        }
      }
    });

    // Prevent ships from being dragged outside of the player board
    const firstShipPartBox = shipParts[0].getBoundingClientRect();
    const lastShipPartBox =
      shipParts[shipParts.length - 1].getBoundingClientRect();
    const padding = shipPartSize / 3;

    if (
      firstShipPartBox.left < boardBox.left - padding ||
      lastShipPartBox.right > boardBox.right + padding ||
      firstShipPartBox.top < boardBox.top - padding ||
      lastShipPartBox.bottom > boardBox.bottom + padding
    ) {
      // Remove ghost highlights
      currentGhostCells.forEach((cell) => cell.classList.remove("ghost"));
      currentGhostCells = [];
      shipParts.forEach((part) => part.classList.remove("invalid"));

      // Moves ship back to it's previous position
      for (let shipPart of shipParts) {
        shipPart.style.transform = `translate(0px, 0px)`;
      }
      document.removeEventListener("mousemove", onMouseMove);
    } else {
      // Move ship to new location
      for (let shipPart of shipParts) {
        shipPart.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      }
    }
  }

  return onMouseMove;
}
