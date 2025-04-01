export function mouseUpHandler(gameboard, shipParts, shipInfo, onMouseMove) {
  function onMouseUp(event) {
    const boardBox = document
      .querySelector(".board.player")
      .getBoundingClientRect();
    const { shipId, shipSize, isHorizontal, shipPartNumber } = shipInfo;
    const shipPartSize = boardBox.width / gameboard.boardSize;

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

    // Update the ship's position in the UI board
    shipParts.forEach((shipPart, index) => {
      let newRow = isHorizontal ? startRow : startRow + index;
      let newCol = isHorizontal ? startCol + index : startCol;

      // Find the new grid cell and move the ship part there
      const newParent = document.querySelector(
        `.board.player > .cell[data-row="${newRow}"][data-col="${newCol}"]`,
      );
      if (newParent) {
        newParent.classList.remove("ghost");

        if (
          gameboard.canPlaceShip(startRow, startCol, shipSize, isHorizontal)
        ) {
          shipPart.remove(); // Remove the ship part from its original location
          newParent.appendChild(shipPart); // Append it to the new cell
        }
      }
    });

    for (let shipPart of shipParts) {
      shipPart.style.removeProperty("transform");
      shipPart.classList.remove("invalid");
    }
    // Update the ship's position in the logical game board
    gameboard.moveShip(shipId, startRow, startCol, isHorizontal);
    //}
    console.log(gameboard.board);
    console.log(gameboard.ships);
    for (let shipPart of shipParts) {
      shipPart.classList.remove("hover");
    }
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  return onMouseUp;
}
