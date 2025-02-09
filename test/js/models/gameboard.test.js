import { Gameboard } from "../../../src/js/models/gameboard.js";
import { Ship } from "../../../src/js/models/ship.js";
import { ShipManager } from "../../../src/js/models/shipManager.js";
import { marker } from "../../../src/js/models/utils.js";

describe("Gameboard class", () => {
  let gameboard;
  let shipManager;

  beforeEach(() => {
    gameboard = new Gameboard();
    shipManager = new ShipManager();
  });

  test("Board Should have 10 rows, each row contains 10 cells, to a total of 100 cells", () => {
    const gameboard = new Gameboard();
    const rows = gameboard.board.length;
    const numberOfCells = rows * gameboard.board[9].length;

    expect(rows).toBe(10);
    expect(numberOfCells).toBe(100);
  });

  test("receiveAttack should mark the board", () => {
    // Ship 1: [4, 3]
    shipManager.placeShipOnBoard(new Ship(4, 3, 1, false), gameboard.board);
    // Ship 2: [2, 8] to [2, 9]
    shipManager.placeShipOnBoard(new Ship(2, 8, 2, true), gameboard.board);

    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(8, 2);
    gameboard.receiveAttack(4, 3);
    gameboard.receiveAttack(4, 4); // Disabled cell attacked
    gameboard.receiveAttack(2, 8);

    expect(gameboard.board[0][0]).toBe(marker.MISS);
    expect(gameboard.board[8][2]).toBe(marker.MISS);
    expect(gameboard.board[4][3]).toBe(marker.HIT);
    expect(gameboard.board[2][8]).toBe(marker.HIT);
    expect(gameboard.board[4][4]).toBe(marker.BLOCK); // Cell near a sunk ship
    expect(gameboard.board[1][7]).toBe(marker.BLOCK); // Corner cell of a hit ship
  });

  test("receiveAttack correctly updates ship states", () => {
    // Ship 1: [4, 3]
    const ship1 = new Ship(4, 3, 1, false);
    shipManager.placeShipOnBoard(ship1, gameboard.board);
    // Ship 2: [2, 8] to [2, 9]
    const ship2 = new Ship(2, 8, 2, true);
    shipManager.placeShipOnBoard(ship2, gameboard.board);

    gameboard.receiveAttack(4, 3);
    gameboard.receiveAttack(2, 8);

    expect(ship1.isSunk()).toBe(true);
    expect(ship2.hits).toBe(1);
    expect(ship2.isSunk()).toBe(false);
  });
});
