export function mouseUpHandler(gameboard, shipParts, onMouseMove) {
  function onMouseUp(event) {
    if (event.target.classList.contains("ship")) {
      const boardBox = document
        .querySelector(".board.player")
        .getBoundingClientRect();
      const shipPartSize = boardBox.width / gameboard.boardSize;

      // Mouse position relative to board
      const mouseX = event.clientX - boardBox.left;
      const mouseY = event.clientY - boardBox.top;
      // Find the cell the mouse is pointing to
      const targetRow = Math.floor(mouseY / shipPartSize);
      const targetCol = Math.floor(mouseX / shipPartSize);

      // Get the data of the ship
      const shipPartNumber = Number(event.target.dataset.pieceNumber);
      const shipSize = Number(event.target.dataset.size);
      const isHorizontal = event.target.dataset.isRow === "true";
      const shipId = Number(event.target.dataset.id);
      const ship = gameboard.ships[shipId];

      // Calculate the starting row and column of the ship's new position
      // Adjust based on the piece number to ensure the ship is positioned correctly
      const startRow = isHorizontal ? targetRow : targetRow - shipPartNumber;
      const startCol = isHorizontal ? targetCol - shipPartNumber : targetCol;

      // Remove the ship from the logical game board (not the UI)
      // This prevents conflicts when checking if the new position is valid
      gameboard.removeShip(ship);

      if (gameboard.canPlaceShip(startRow, startCol, shipSize, isHorizontal)) {
        // Update the ship's position in the UI board
        shipParts.forEach((shipPart, index) => {
          let newRow = isHorizontal ? startRow : startRow + index;
          let newCol = isHorizontal ? startCol + index : startCol;

          // Find the new grid cell and move the ship part there
          const newParent = document.querySelector(
            `.board.player [data-row="${newRow}"][data-col="${newCol}"]`,
          );
          shipPart.remove(); // Remove the ship part from its original location
          newParent.appendChild(shipPart); // Append it to the new cell
        });
      }

      for (let shipPart of shipParts) {
        shipPart.style.removeProperty("transform");
      }
      // Update the ship's position in the logical game board
      gameboard.moveShip(shipId, startRow, startCol, isHorizontal);
    }
    console.log(gameboard.board);
    console.log(gameboard.ships);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  return onMouseUp;
}
