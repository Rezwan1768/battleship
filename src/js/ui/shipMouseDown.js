import { mouseMoveHandler } from "./shipMouseMove.js";
import { mouseUpHandler } from "./shipMouseUp.js";
import { getShipInfo, getStartingCell } from "./utils.js";
import { enableRotation } from "./shipRotation.js";

export function onMouseDown(gameboard) {
  return (event) => {
    const shipSegment = event.target;
    const shipInfo = getShipInfo(shipSegment);
    const boardBox = document
      .querySelector(".board.player")
      .getBoundingClientRect();
    const segmentSize = boardBox.width / gameboard.boardSize;

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

    // Get the individual segments of the ship
    const shipSegments = document.querySelectorAll(
      `.ship[data-id="${shipInfo.shipId}"]`,
    );
    for (let segment of shipSegments) {
      segment.classList.add("hover");
    }

    // Remove the ship from the logical game board (not the UI)
    // This prevents conflicts when checking if the new position is valid
    gameboard.removeShip(gameboard.ships[shipInfo.shipId]);

    const onMouseMove = mouseMoveHandler(
      gameboard,
      shipSegments,
      startX,
      startY,
    );
    const onKeyDown = enableRotation(shipSegments);
    const onMouseUp = mouseUpHandler(
      gameboard,
      shipSegments,
      shipInfo,
      initialRow,
      initialCol,
      onKeyDown,
      onMouseMove,
    );

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
}
