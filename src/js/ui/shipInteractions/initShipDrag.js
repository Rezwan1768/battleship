import { mouseMoveHandler } from "./shipMouseMove.js";
import { mouseUpHandler } from "./shipMouseUp.js";
import { enableRotation } from "./shipRotation.js";
import { getShipInfo, getStartingCell, updateShipVisuals } from "./utils.js";

export function onMouseDown(gameboard, boardElement) {
  return (event) => {
    const shipSegment = event.target;
    if (!shipSegment.classList.contains("ship")) return;

    // Make the board focusable and focus it
    // to capture keyboard input (e.g., for ship rotation)
    boardElement.focus();
    boardElement.setAttribute("tabindex", "0");

    const shipInfo = getShipInfo(shipSegment);
    const boardBox = boardElement.getBoundingClientRect();
    const segmentSize = boardBox.width / gameboard.boardSize;

    // Get the individual segments of the ship
    const shipSegments = boardElement.querySelectorAll(
      `.ship[data-id="${shipInfo.shipId}"]`,
    );
    for (let segment of shipSegments) {
      segment.classList.add("hover");
    }

    // Store the ship/mouse position on 'mousedown'
    const { clientX: startX, clientY: startY } = event;

    // Determine the starting cell (row, col) of the clicked ship segment
    const [initialRow, initialCol] = getStartingCell(
      { x: startX, y: startY },
      boardBox,
      shipInfo,
      segmentSize,
    );

    // Store segments temporarily hidden to reveal red ghost cells beneath
    let hiddenShipSegments = [];
    // Visually highlight the original ship position as "ghost" cells
    let ghostCells = [];
    updateShipVisuals({
      boardElement,
      startRow: initialRow,
      startCol: initialCol,
      shipSize: shipInfo.shipSize,
      isHorizontal: shipInfo.isHorizontal,
      isValid: true,
      ghostCells,
    });

    // Remove the ship from the logical game board (not the UI)
    // This prevents conflicts when checking if the new position is valid
    gameboard.removeShip(gameboard.ships[shipInfo.shipId]);

    // Attach handler that updates ship position on drag
    const onMouseMove = mouseMoveHandler(
      gameboard,
      boardElement,
      shipSegments,
      shipSegment,
      shipInfo,
      ghostCells,
      hiddenShipSegments,
      startX,
      startY,
    );

    // Enable ship rotation with keyboard input during drag
    const onKeyDown = enableRotation(
      gameboard,
      boardElement,
      shipSegments,
      shipSegment,
      ghostCells,
      hiddenShipSegments,
    );

    // Finalize ship placement and cleanup on mouse release
    const onMouseUp = mouseUpHandler(
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
    );

    boardElement.addEventListener("keydown", onKeyDown);
    boardElement.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp, { once: true });
  };
}
