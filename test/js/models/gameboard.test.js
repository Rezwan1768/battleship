import { Gameboard } from "../../../src/js/models/gameboard.js";
import { Ship } from "../../../src/js/models/ship.js";

describe("Gameboard class", () => {
  test("Board Should have 10 rows, each row contains 10 cells, to a total of 100 cells", () => {
    const gameboard = new Gameboard();
    const rows = gameboard.board.length;
    const boardSize = rows * gameboard.board[9].length;

    expect(rows).toBe(10);
    expect(boardSize).toBe(100);
  });

  test("canPlaceShip method should return false when the ship goes out of bounds", () => {
    // canPlaceShip(rowStart, colStart, shipSize, isHorizontal)
    const gameboard = new Gameboard();

    // Ship goes (horizontally) past the coloum limit in the last row
    expect(gameboard.canPlaceShip(9, 9, 2, true)).toBe(false);
    // Ship goes beyond the row limit
    expect(gameboard.canPlaceShip(9, 2, 3, false)).toBe(false);
    // Ship goes past the column limit
    expect(gameboard.canPlaceShip(0, 6, 5, true)).toBe(false);

    expect(gameboard.canPlaceShip(9, 9, 1, true)).toBe(true);
    expect(gameboard.canPlaceShip(5, 4, 3, false)).toBe(true);
    expect(gameboard.canPlaceShip(0, 6, 4, true)).toBe(true);
  });

  test("canPlaceShip method should return false when trying to place too close to another ship", () => {
    const gameboard = new Gameboard();
    gameboard.placeShip(new Ship(0, 0, 5, true));
    gameboard.placeShip(new Ship(3, 2, 5, false));

    // Ships overlapping
    expect(gameboard.canPlaceShip(0, 0, 5, true)).toBe(false);
    expect(gameboard.canPlaceShip(6, 2, 2, false)).toBe(false);
    expect(gameboard.canPlaceShip(7, 0, 5, true)).toBe(false);

    // Ships next to each other
    expect(gameboard.canPlaceShip(0, 5, 4, true)).toBe(false);
    expect(gameboard.canPlaceShip(8, 0, 4, true)).toBe(false);
    expect(gameboard.canPlaceShip(4, 2, 2, true)).toBe(false);

    expect(gameboard.canPlaceShip(0, 6, 4, true)).toBe(true);
    expect(gameboard.canPlaceShip(3, 4, 5, false)).toBe(true);
    expect(gameboard.canPlaceShip(9, 0, 5, true)).toBe(true);
  });

  test("placeShip method should correctly place shps on the board", () => {
    // placeShip(rowStart, colStart, shipSize, isHorizontal)
    const gameboard = new Gameboard();
    gameboard.placeShip(new Ship(4, 3, 3, false)); // Ship1: (4, 3) to (6, 3)
    gameboard.placeShip(new Ship(2, 8, 2, true)); // Ship2: (2, 8) to (2, 9)

    expect(gameboard.board[6][3] instanceof Ship).toBe(true);
    expect(gameboard.board[2][9] instanceof Ship).toBe(true);
    expect(gameboard.board[7][3] instanceof Ship).toBe(false);

    // Part of the same ship
    expect(gameboard.board[4][3] === gameboard.board[6][3]).toBe(true);
    expect(gameboard.board[2][8] === gameboard.board[2][9]).toBe(true);
    expect(gameboard.board[4][3] === gameboard.board[2][8]).toBe(false);
  });

  test("receiveAttack should mark the board and correctly update ship states", () => {
    const gameboard = new Gameboard();
    const MARK = "o"; // Attacked cells
    const DISABLE = "x"; // Cells that can't be targeted due to game rules

    gameboard.placeShip(new Ship(4, 3, 1, false)); // Ship1: (4, 3)
    gameboard.placeShip(new Ship(2, 8, 2, true)); // Ship2: (2, 8) to (2, 9)

    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(4, 3);
    gameboard.receiveAttack(2, 8);

    expect(gameboard.board[0][0]).toBe(MARK);
    expect(gameboard.board[4][3].isSunk()).toBe(true);
    expect(gameboard.board[1][7]).toBe(DISABLE); // Corner cell of a hit ship
  });
});
