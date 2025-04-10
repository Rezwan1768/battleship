export function isMouseOutsideWindow(eventObj) {
  return (
    eventObj.clientX < 0 ||
    eventObj.clientY < 0 ||
    eventObj.clientX > window.innerWidth ||
    eventObj.clientY > window.innerHeight
  );
}

export function isShipOutOfBounds(
  boardElement,
  shipSegments,
  shipInfo,
  segmentSize,
  eventObj,
) {
  const { shipSize, isHorizontal, segmentNumber } = shipInfo;
  const boardBox = boardElement.getBoundingClientRect();
  const padding = segmentSize * shipSegments.length;
  const paddingX = isHorizontal ? padding : segmentSize;
  const paddingY = isHorizontal ? segmentSize : padding;

  // Get the mouse position in the viewport
  const mouseX = eventObj.clientX;
  const mouseY = eventObj.clientY;

  // Adjust the ship position based on the segment that was grabbed
  const shipStartX = isHorizontal
    ? mouseX - segmentNumber * segmentSize
    : mouseX - segmentSize / 2;

  const shipStartY = isHorizontal
    ? mouseY - segmentSize / 2
    : mouseY - segmentNumber * segmentSize;

  const shipEndX = isHorizontal
    ? shipStartX + shipSize * segmentSize
    : shipStartX + segmentSize;

  const shipEndY = isHorizontal
    ? shipStartY + segmentSize
    : shipStartY + shipSize * segmentSize;

  // Check if the ship goes outside of the board
  return (
    shipStartX < boardBox.left - paddingX ||
    shipEndX > boardBox.right + paddingX ||
    shipStartY < boardBox.top - paddingY ||
    shipEndY > boardBox.bottom + paddingY
  );
}
