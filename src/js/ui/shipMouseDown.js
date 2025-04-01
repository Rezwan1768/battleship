import { mouseMoveHandler } from "./shipMouseMove.js";
import { mouseUpHandler } from "./shipMouseUp.js";

export function onMouseDown(gameboard) {
  return (event) => {
    const ship = event.target;
    const shipId = ship.dataset.id;

    // Get the initial ship (mouse) position
    let startX = event.clientX;
    let startY = event.clientY;

    const shipParts = document.querySelectorAll(`.ship[data-id="${shipId}"]`);
    for (let shipPart of shipParts) {
      shipPart.style.backgroundColor = "red";
    }

    const onMouseMove = mouseMoveHandler(gameboard, shipParts, startX, startY);
    const onMouseUp = mouseUpHandler(gameboard, shipParts, onMouseMove);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
}
