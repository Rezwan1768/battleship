import { isCellInBounds } from "./utils.js";
import { Ship } from "./ship.js";

export class ShipManager {
  boardSize = 10;
  constructor(shipsSizes = [4, 3, 3, 2, 2, 1, 1, 1]) {
    this.shipSizes = shipsSizes; // Size of the ships to be placed on the board
    this.numberOfShips = this.shipSizes.length;
  }

  createShip(rowStart, colStart, shipSize, isHorizontal) {
    return new Ship(rowStart, colStart, shipSize, isHorizontal);
  }

  canPlaceShipOnBoard(rowStart, colStart, shipSize, isHorizontal, board) {
    let rowEnd = isHorizontal ? rowStart : rowStart + shipSize - 1;
    let colEnd = isHorizontal ? colStart + shipSize - 1 : colStart;
    // Ships can't go outside of the board
    if (
      !isCellInBounds(rowStart, colStart, this.boardSize) ||
      !isCellInBounds(rowEnd, colEnd, this.boardSize)
    )
      return false;

    // Ships must be separated by at least one cell
    // Checks the area around the coordinates, to see if there is already a ship
    for (let row = rowStart - 1; row <= rowEnd + 1; ++row) {
      for (let col = colStart - 1; col <= colEnd + 1; ++col) {
        if (
          isCellInBounds(row, col, this.boardSize) &&
          board[row][col] instanceof Ship
        )
          return false;
      }
    }
    return true;
  }

  placeShipOnBoard(ship, board) {
    for (let i = 0; i < ship.size; ++i) {
      let row = ship.isHorizontal ? ship.rowStart : ship.rowStart + i;
      let col = ship.isHorizontal ? ship.colStart + i : ship.colStart;
      board[row][col] = ship;
    }
  }

  placeAllShipsOnBoard(board) {
    for (let shipSize of this.shipSizes) {
      let isShipPlaced = false;

      // Ships are initially placed randomly on the board
      while (!isShipPlaced) {
        let rowStart = Math.floor(Math.random() * this.boardSize);
        let colStart = Math.floor(Math.random() * this.boardSize);
        let isHorizontal = Math.random() < 0.5;

        if (
          this.canPlaceShipOnBoard(
            rowStart,
            colStart,
            shipSize,
            isHorizontal,
            board,
          )
        ) {
          const ship = this.createShip(
            rowStart,
            colStart,
            shipSize,
            isHorizontal,
          );
          this.placeShipOnBoard(ship, board);
          isShipPlaced = true;
        }
      }
    }
  }
}
