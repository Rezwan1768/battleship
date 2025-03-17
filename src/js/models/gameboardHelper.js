import { isCellInBounds, isCellMarked, marker } from "./utils.js";

// Used by 'receiveAttack' in ./gameboard.js
// Each function returns an array with a pair of string coordinates.

// The 'computer player' tracks valid attack coordinates in a set. String
// coordinate values are easier to work with.

// When a ship sinks, the surrounding area can't be targeted
// Returns the newly marked cells after ship sunk
export function markSunkShipArea(ship, board) {
  let { rowStart, colStart, size, isHorizontal } = ship;
  let rowEnd = isHorizontal ? rowStart : rowStart + size - 1;
  let colEnd = isHorizontal ? colStart + size - 1 : colStart;
  const markedCells = [];

  // Ignore already marked cells.
  for (let i = rowStart - 1; i <= rowEnd + 1; ++i) {
    for (let j = colStart - 1; j <= colEnd + 1; ++j) {
      if (isCellInBounds(i, j, board.length) && board[i][j] === null) {
        board[i][j] = marker.BLOCK;
        markedCells.push(`${i},${j}`);
      }
    }
  }
  return markedCells;
}

// Since ships can't be next to each other, the corner cells can be marked,
// making it clear to the player
export function markNearbyCorners(row, col, board) {
  const markedCells = [];
  for (let i = row - 1; i <= row + 1; i += 2) {
    for (let j = col - 1; j <= col + 1; j += 2) {
      if (isCellInBounds(i, j, board.length) && board[i][j] === null) {
        board[i][j] = marker.BLOCK;
        markedCells.push(`${i},${j}`);
      }
    }
  }
  return markedCells;
}

// Returns the adjacent cells of a ship.
// Allows 'computer player' to target adjacent cell after hitting a ship
export function getAdjacentCells(row, col, board) {
  // Amount to add to row and col to get each adjacent cell
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const adjacentCells = [];

  for (let [i, j] of directions) {
    let adjRow = row + i;
    let adjCol = col + j;

    // Doesn't include already marked adjacent cells
    if (
      isCellInBounds(adjRow, adjCol, board.length) &&
      !isCellMarked(board[adjRow][adjCol])
    )
      adjacentCells.push(`${adjRow},${adjCol}`);
  }

  return adjacentCells;
}
