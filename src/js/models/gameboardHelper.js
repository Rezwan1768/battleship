import { isCellInBounds, marker } from "./utils.js";
import { Ship } from "./ship.js";

// Used by 'receiveAttack' in ./gameboard.js
// Each function returns an array with a pair of string coordinates.
// The 'computer player' tracks valid attack cells using a set,
// where strings are easier to manage than objects.

// When a ship sinks, the surrounding area can't be targeted
export function markSunkShipArea(ship, board) {
  let { rowStart, colStart, size, isHorizontal } = ship;
  let rowEnd = isHorizontal ? rowStart : rowStart + size - 1;
  let colEnd = isHorizontal ? colStart + size - 1 : colStart;
  const markedCells = [];

  // Only need to mark surrounding area that has not been hit yet
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

// Since ships can't be next to each other, the corner cells can be marked
// to clearly indicate that there can't be any ships in those cells.
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

// For 'computer player' to target adjacent cell after hitting a ship
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

    if (
      isCellInBounds(adjRow, adjCol, board.length) &&
      (board[adjRow][adjCol] === null || board[adjRow][adjCol] instanceof Ship)
    )
      adjacentCells.push(`${adjRow},${adjCol}`);
  }

  return adjacentCells;
}
