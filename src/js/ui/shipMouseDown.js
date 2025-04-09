import { mouseMoveHandler } from "./shipMouseMove.js";
import { mouseUpHandler } from "./shipMouseUp.js";
import { getShipInfo, getStartingCell } from "./utils/utils.js";
import { updateShipVisuals } from "./utils/domUtils.js";
import { enableRotation } from "./shipRotation.js";

export function onMouseDown(gameboard, boardElement) {
  return (event) => {
    const shipSegment = event.target;
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
    let startX = event.clientX;
    let startY = event.clientY;

    // Get location of the first segment of the targeted ship
    const [initialRow, initialCol] = getStartingCell(
      { x: event.clientX, y: event.clientY },
      boardBox,
      shipInfo,
      segmentSize,
    );

    // Hide segments when a hovered ship is above it
    let hiddenShipSegments = [];
    // Since the ship becomes invisible when clicked,
    // highlight the cells where the ship is
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

    const onMouseMove = mouseMoveHandler(
      gameboard,
      boardElement,
      shipSegments,
      shipInfo,
      ghostCells,
      hiddenShipSegments,
      startX,
      startY,
    );
    const onKeyDown = enableRotation(
      gameboard,
      boardElement,
      shipSegments,
      shipSegment,
      ghostCells,
      hiddenShipSegments,
    );
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
    document.addEventListener("mouseup", onMouseUp);
  };
}
