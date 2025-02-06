import { Gameboard } from "../../../src/js/models/gameboard";
import { Ship } from "../../../src/js/models/ship";
import { ShipManager } from "../../../src/js/models/shipManager";

describe("shipManager class", () => {
  let gameboard;
  let shipManager;

  beforeEach(() => {
    gameboard = new Gameboard();
    shipManager = new ShipManager();
  });

  test("canPlaceShipOnBoard method should return false when the ship goes out of bounds", () => {
    // canPlaceShipOnBoard(rowStart, colStart, shipSize, isHorizontal, board)

    // Ship goes (horizontally) past the column limit in the last row
    expect(
      shipManager.canPlaceShipOnBoard(9, 9, 2, true, gameboard.board),
    ).toBe(false);
    // Ship goes beyond the row limit
    expect(
      shipManager.canPlaceShipOnBoard(9, 2, 3, false, gameboard.board),
    ).toBe(false);
    // Ship goes past the column limit
    expect(
      shipManager.canPlaceShipOnBoard(0, 6, 5, true, gameboard.board),
    ).toBe(false);

    expect(
      shipManager.canPlaceShipOnBoard(9, 9, 1, true, gameboard.board),
    ).toBe(true);
    expect(
      shipManager.canPlaceShipOnBoard(5, 4, 3, false, gameboard.board),
    ).toBe(true);
    expect(
      shipManager.canPlaceShipOnBoard(0, 6, 4, true, gameboard.board),
    ).toBe(true);
  });

  test("canPlaceShipOnBoard method should return false when trying to place too close to another ship", () => {
    // Ship 1: [0, 0] to [0, 4]
    shipManager.placeShipOnBoard(new Ship(0, 0, 5, true), gameboard.board);
    // Ship 2: [3, 2] to [7, 2]
    shipManager.placeShipOnBoard(new Ship(3, 2, 5, false), gameboard.board);

    // Ships overlapping
    expect(
      shipManager.canPlaceShipOnBoard(0, 0, 5, true, gameboard.board),
    ).toBe(false);
    expect(
      shipManager.canPlaceShipOnBoard(6, 2, 2, false, gameboard.board),
    ).toBe(false);
    expect(
      shipManager.canPlaceShipOnBoard(7, 0, 5, true, gameboard.board),
    ).toBe(false);

    // Ships next to each other
    expect(
      shipManager.canPlaceShipOnBoard(0, 5, 4, true, gameboard.board),
    ).toBe(false);
    expect(
      shipManager.canPlaceShipOnBoard(8, 0, 4, true, gameboard.board),
    ).toBe(false);
    expect(
      shipManager.canPlaceShipOnBoard(4, 2, 2, true, gameboard.board),
    ).toBe(false);

    expect(
      shipManager.canPlaceShipOnBoard(0, 6, 4, true, gameboard.board),
    ).toBe(true);
    expect(
      shipManager.canPlaceShipOnBoard(3, 4, 5, false, gameboard.board),
    ).toBe(true);
    expect(
      shipManager.canPlaceShipOnBoard(9, 0, 5, true, gameboard.board),
    ).toBe(true);
  });

  test("placeShip method should correctly place ships on the board", () => {
    // placeShip(rowStart, colStart, shipSize, isHorizontal)

    // Ship 1: [4, 3] to [6, 3]
    shipManager.placeShipOnBoard(new Ship(4, 3, 3, false), gameboard.board);
    // Ship2: [2, 8] to [2, 9]
    shipManager.placeShipOnBoard(new Ship(2, 8, 2, true), gameboard.board);

    expect(gameboard.board[6][3] instanceof Ship).toBe(true);
    expect(gameboard.board[2][9] instanceof Ship).toBe(true);
    expect(gameboard.board[7][3] instanceof Ship).toBe(false);

    // Part of the same ship
    expect(gameboard.board[4][3]).toBe(gameboard.board[6][3]);
    expect(gameboard.board[2][8]).toBe(gameboard.board[2][9]);
    expect(gameboard.board[4][3] === gameboard.board[2][8]).toBe(false);
  });
});
