// Renders the visual result of an attack on the board
// If it's a hit, updates the hit ship segment and any additional marked cells
// If it's a miss, updates the targeted cell with a miss indicator
export function renderAttackResult(board, markedCells, isHit) {
  if (isHit) {
    const attackedCell = markedCells[0];
    updateAttackedShipUI(board, attackedCell);
    markedCells = markedCells.slice(1); // Remaining cells are near-miss markers
    updateMarkedCellUI(board, markedCells);
  } else {
    updateMissUI(board, markedCells);
  }
}

// Visually marks a cell as a direct hit on a ship
function updateAttackedShipUI(board, attackedCell) {
  const [row, col] = attackedCell.split(",");
  const cell = board.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`,
  );
  if (!cell) return;

  cell.querySelector(".ship")?.remove();
  cell.textContent = "💥";
  cell.classList.add("hit");
  cell.disabled = true;
}

// Visually marks a cell as a miss (no ship present)
function updateMissUI(board, markedCells) {
  const [row, col] = markedCells[0].split(",");
  const cell = board.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`,
  );
  if (!cell) return;

  cell.textContent = "X";
  cell.classList.add("miss");
  cell.disabled = true;
}

// Visually marks surrounding cells to indicate cells that can't be targeted
function updateMarkedCellUI(board, markedCells) {
  markedCells.forEach((item) => {
    const [row, col] = item.split(",");
    const cell = board.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`,
    );
    cell.textContent = "•";
    cell.classList.add("mark");
    cell.disabled = true;
  });
}
