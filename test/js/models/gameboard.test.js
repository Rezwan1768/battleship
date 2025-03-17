import { Gameboard } from "../../../src/js/models/gameboard.js";
import { Ship } from "../../../src/js/models/ship.js";
import { ShipManager } from "../../../src/js/models/shipManager.js";
import { marker } from "../../../src/js/models/utils.js";

describe("Gameboard class", () => {
  let gameboard;
  let shipManager;
  let ship1, ship2;

  beforeEach(() => {
    gameboard = new Gameboard();
    shipManager = new ShipManager();

    // Ship 1: [4, 3]
    ship1 = new Ship(4, 3, 1, false);
    shipManager.placeShipOnBoard(ship1, gameboard.board);
    // Ship 2: [2, 8] to [2, 9]
    ship2 = new Ship(2, 8, 2, true);
    shipManager.placeShipOnBoard(ship2, gameboard.board);
  });

  test("Board Should have 10 rows, each row contains 10 cells, to a total of 100 cells", () => {
    const gameboard = new Gameboard();
    const rows = gameboard.board.length;
    const numberOfCells = rows * gameboard.board[9].length;

    expect(rows).toBe(10);
    expect(numberOfCells).toBe(100);
  });

  test("receiveAttack should mark the board", () => {
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

  test("receiveAttack returns the correct value", () => {
    let resultOne = gameboard.receiveAttack(4, 3);
    let resultTwo = gameboard.receiveAttack(2, 8);

    const expectedResultOne = {
      markedCells: [
        "3,2",
        "3,3",
        "3,4",
        "4,2",
        "4,3",
        "4,4",
        "5,2",
        "5,3",
        "5,4",
      ],
      isHit: true,
      isSunk: true,
      adjacentCells: [],
    };
    expect({
      ...resultOne,
      markedCells: resultOne.markedCells.sort(),
    }).toEqual({
      ...expectedResultOne,
      markedCells: expectedResultOne.markedCells.sort(),
    });

    const expectedResultTwo = {
      markedCells: ["2,8", "1,7", "1,9", "3,7", "3,9"],
      isHit: true,
      isSunk: false,
      adjacentCells: ["2,7", "2,9", "1,8", "3,8"],
    };
    expect({
      ...resultTwo,
      markedCells: resultTwo.markedCells.sort(),
      adjacentCells: resultTwo.adjacentCells.sort(),
    }).toEqual({
      ...expectedResultTwo,
      markedCells: expectedResultTwo.markedCells.sort(),
      adjacentCells: expectedResultTwo.adjacentCells.sort(),
    });
  });
});
