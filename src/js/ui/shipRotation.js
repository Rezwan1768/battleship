export function enableRotation(shipSegments) {
  return (event) => {
    const isHorizontal = shipSegments[0].dataset.isRow === "true";
    console.log(shipSegments);
    if (event.key === "r" || event.key === "R") {
      shipSegments.forEach((segment) => {
        segment.dataset.isRow = !isHorizontal;
      });
    }
  };
}
