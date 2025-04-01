import { mouseMoveHandler } from "./shipMouseMove.js";
import { mouseUpHandler } from "./shipMouseUp.js";

export function onMouseDown(gameboard) {
  return (event) => {
    const ship = event.target;
    const shipInfo = {
      shipId: Number(ship.dataset.id),
      shipPartNumber: Number(ship.dataset.pieceNumber),
      shipSize: Number(ship.dataset.size),
      isHorizontal: ship.dataset.isRow === "true",
    };

    // Get the initial ship (mouse) position
    let startX = event.clientX;
    let startY = event.clientY;

    // Get the individual parts of the ship
    const shipParts = document.querySelectorAll(
      `.ship[data-id="${shipInfo.shipId}"]`,
    );
    for (let shipPart of shipParts) {
      shipPart.classList.add("hover");
    }

    // Remove the ship from the logical game board (not the UI)
    // This prevents conflicts when checking if the new position is valid
    gameboard.removeShip(gameboard.ships[shipInfo.shipId]);

    const onMouseMove = mouseMoveHandler(
      gameboard,
      shipParts,
      shipInfo,
      startX,
      startY,
    );
    const onMouseUp = mouseUpHandler(
      gameboard,
      shipParts,
      shipInfo,
      onMouseMove,
    );

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
}
