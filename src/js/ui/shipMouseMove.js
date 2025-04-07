import { getStartingCell, getShipInfo } from "./utils.js";

export function mouseMoveHandler(
  gameboard,
  shipSegments,
  target,
  currentGhostCells,
  startX,
  startY,
) {
  let hiddenShipSegments = []; // Hide segments when another ship is hovered over

  function onMouseMove(event) {
    // Remove previous visual indicators before updating new ones.
    currentGhostCells.forEach((cell) =>
      cell.classList.remove("valid", "invalid"),
    );
    currentGhostCells.length = 0;
    hiddenShipSegments.forEach((segment) => segment.classList.remove("hide"));
    //shipSegments.forEach((segment) => segment.classList.remove("invalid"));

    const playerBoard = document.querySelector(".board.player");
    const boardBox = playerBoard.getBoundingClientRect();

    const shipInfo = getShipInfo(target);
    const { shipSize, isHorizontal } = shipInfo;
    const segmentSize = boardBox.width / gameboard.boardSize;

    // Determine the  cell where the first segment of the ship will be placed
    const [startRow, startCol] = getStartingCell(
      { x: event.clientX, y: event.clientY },
      boardBox,
      shipInfo,
      segmentSize,
    );

    if (gameboard.canPlaceShip(startRow, startCol, shipSize, isHorizontal)) {
      // Identify and process the cells where the ship might be placed
      for (let index = 0; index < shipSize; ++index) {
        let newRow = isHorizontal ? startRow : startRow + index;
        let newCol = isHorizontal ? startCol + index : startCol;
        const cell = document.querySelector(
          `.board.player > .cell[data-row="${newRow}"][data-col="${newCol}"]`,
        );
        if (cell) {
          cell.classList.add("valid");
          currentGhostCells.push(cell);
        }
      }
    } else {
      for (let index = 0; index < shipSize; ++index) {
        // If the ship placement is invalid, apply styles to indicate the error
        let newRow = isHorizontal ? startRow : startRow + index;
        let newCol = isHorizontal ? startCol + index : startCol;
        const cell = document.querySelector(
          `.board.player > .cell[data-row="${newRow}"][data-col="${newCol}"]`,
        );
        if (cell) {
          cell.classList.add("invalid");
          currentGhostCells.push(cell);
          const shipPart = cell.querySelector(".ship");
          if (shipPart) {
            shipPart.classList.add("hide");
            hiddenShipSegments.push(shipPart);
          }
        }
      }
      //shipSegments.forEach((segment) => segment.classList.add("invalid"));
    }

    // Ship can't be dragged outside of board
    if (
      !playerBoard.contains(event.target) ||
      isShipOutOfBounds(shipSegments, shipInfo, segmentSize, event)
    ) {
      // Remove all visual indicators
      currentGhostCells.forEach((cell) =>
        cell.classList.remove("valid", "invalid"),
      );
      currentGhostCells = [];
      hiddenShipSegments.forEach((segment) => segment.classList.remove("hide"));
      shipSegments.forEach((segment) =>
        segment.classList.remove("invalid", "hover"),
      );

      // Reset ship to its previous position in the UI board
      shipSegments.forEach(
        (segment) => (segment.style.transform = `translate(0px, 0px)`),
      );
      document.removeEventListener("mousemove", onMouseMove);
    } else {
      // Calculate movement delta since `translate` only affects visuals,
      // not the element's actual DOM position.
      // startX / startY: Ships initial coordinate on the DOM.
      let deltaX = event.clientX - startX;
      let deltaY = event.clientY - startY;

      // Move ship to new location
      shipSegments.forEach((segment) => {
        segment.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
    }
  }
  return onMouseMove;
}

// Returns true if the ship goes out of the board
function isShipOutOfBounds(
  shipSegments,
  shipInfo,
  segmentSize,
  mouseMoveEventObj,
) {
  const { shipSize, segmentNumber, isHorizontal } = shipInfo;
  const boardBox = document
    .querySelector(".board.player")
    .getBoundingClientRect();
  const segmentBox = shipSegments[0].getBoundingClientRect();
  //const padding = (shipSize) * segmentSize;
  const padding = segmentSize;

  const startSegment = 0;
  const endSegment = shipSize - 1;

  // Calculate the offset for each side of the the ship to
  // ensure that the ships bounds are correctly checked
  const leftOffset = segmentSize * (startSegment - segmentNumber);
  const rightOffset = segmentSize * (endSegment - segmentNumber);
  const topOffset = leftOffset;
  const bottomOffset = rightOffset;

  // Get the current scroll positions of the page
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  // Get the mouse coordinates relative to the board
  const mouseX = mouseMoveEventObj.clientX - boardBox.left;
  const mouseY = mouseMoveEventObj.clientY - boardBox.top;

  // Calculate the bounds of the ship based on mouse position and ship offsets
  const shipLeft = isHorizontal
    ? mouseX + leftOffset
    : segmentBox.left + scrollX;
  const shipRight = isHorizontal
    ? mouseX + rightOffset
    : segmentBox.right + scrollX;
  const shipTop = !isHorizontal ? mouseY + topOffset : segmentBox.top + scrollY;
  const shipBot = !isHorizontal
    ? mouseY + bottomOffset
    : segmentBox.bottom + scrollY;

  // Return true if any side of the ship exceeds the board boundaries
  return (
    shipLeft < boardBox.left + scrollX - padding ||
    shipRight > boardBox.right + scrollX + padding ||
    shipTop < boardBox.top + scrollY - padding ||
    shipBot > boardBox.bottom + scrollY + padding
  );
}
