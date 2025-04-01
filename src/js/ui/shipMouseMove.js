export function mouseMoveHandler(gameboard, shipParts, startX, startY) {
  function onMouseMove(event) {
    // Calculate movement delta since `translate` only affects visuals,
    // not the element's actual DOM position.
    // startX / startY: Ships initial coordinate on the DOM.
    let deltaX = event.clientX - startX;
    let deltaY = event.clientY - startY;

    const boardBox = document
      .querySelector(".board.player")
      .getBoundingClientRect();

    const shipPartSize = boardBox.width / gameboard.boardSize;

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
      // Moves ship back to it's previous position
      for (let shipPart of shipParts) {
        shipPart.style.transform = `translate(0px, 0px)`;
      }
      document.removeEventListener("mousemove", onMouseMove);
    } else {
      for (let shipPart of shipParts) {
        shipPart.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      }
    }
  }
  return onMouseMove;
}
