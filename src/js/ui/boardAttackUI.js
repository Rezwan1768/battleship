export function renderAttackResult(board, markedCells, isHit) {
  if (isHit) {
    const attackedCell = markedCells[0];
    updateAttackedShipUI(board, attackedCell);
    markedCells = markedCells.slice(1);
    updateMarkedCellUI(board, markedCells);
  } else {
    updateMissUI(board, markedCells);
  }
}

function updateAttackedShipUI(board, attackedCell) {
  const [row, col] = attackedCell.split(",");
  const cell = board.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`,
  );
  const shipSegment = cell.querySelector(".ship");
  if (shipSegment) {
    shipSegment.classList.add("hit");
    shipSegment.textContent = "💥";
  }
  cell.disabled = true;
}

function updateMissUI(board, markedCells) {
  const [row, col] = markedCells[0].split(",");
  const cell = board.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`,
  );
  cell.textContent = "x";
  cell.classList.add("miss");
  cell.disabled = true;
}

function updateMarkedCellUI(board, markedCells) {
  markedCells.forEach((item) => {
    const [row, col] = item.split(",");
    const cell = board.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`,
    );
    cell.textContent = "x";
    cell.classList.add("mark");
    cell.disabled = true;
  });
}
