import { isCellInBounds } from "./utils.js";
import { Ship } from "./ship.js";

export class ShipManager {
  constructor(boardSize = 10, shipsSizes = [6, 3, 2, 2, 1, 1, 1]) {
    this.boardSize = boardSize;
    this.shipSizes = shipsSizes; // Size of the ships to be placed on the board
    this.numberOfShips = this.shipSizes.length;
    this.ships = [];
  }

  createShip(rowStart, colStart, shipSize, isHorizontal) {
    return new Ship(rowStart, colStart, shipSize, isHorizontal);
  }

  // Checks to see if ship placement is valid
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
    this.ships.push(ship);
  }

  placeAllShipsOnBoard(board) {
    console.log(this.ships);
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

  // Removes the ship form board, but still keeps the reference in 'ships'
  removeShip(ship, board) {
    for (let i = 0; i < ship.size; ++i) {
      let row = ship.isHorizontal ? ship.rowStart : ship.rowStart + i;
      let col = ship.isHorizontal ? ship.colStart + i : ship.colStart;
      board[row][col] = null;
    }
  }

  moveShip(shipIndex, rowStart, colStart, isHorizontal, board) {
    const ship = this.ships[shipIndex];
    // Remove the ship form the board
    this.removeShip(ship, board);

    // Check to see if new position is valid
    const isValidPosition = this.canPlaceShipOnBoard(
      rowStart,
      colStart,
      ship.size,
      isHorizontal,
      board,
    );
    if (isValidPosition) {
      // Update the ship's internal data to reflect its new position
      ship.updatePosition(rowStart, colStart, isHorizontal);
    }

    // Place it back on the board
    for (let i = 0; i < ship.size; ++i) {
      let row = ship.isHorizontal ? ship.rowStart : ship.rowStart + i;
      let col = ship.isHorizontal ? ship.colStart + i : ship.colStart;
      board[row][col] = ship;
    }
  }
}
