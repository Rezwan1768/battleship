import { ComputerPlayer } from "../../../src/js/models/computerPlayer.js";
import { Gameboard } from "../../../src/js/models/gameboard.js";
import { Ship } from "../../../src/js/models/ship.js";

// jest.mock("../../../src/js/models/gameboard.js");

describe("Computer player class", () => {
  let computer;
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
    computer = new ComputerPlayer();

    // Add a ship from (4, 4) to (4, 8)
    const ship = new Ship(4, 4, 5, true);
    for (let [row, col] = [4, 4]; col <= 8; ++col) {
      gameboard.board[row][col] = ship;
    }

    // Ship is hit on the cell [4, 6].
    // This is done to set certain properties for the tests
    computer.getRandomCoord = jest
      .fn((x, y) => [x, y])
      .mockReturnValueOnce([4, 6]);
    computer.attack(gameboard);
  });

  test("ComputerPlayer initializes with a gameboard", () => {
    expect(computer.gameboard).toBeInstanceOf(Gameboard);
  });

  test("getAdjacentCoord attacks an adjacent cells to the hit cell", () => {
    const adjacentCells = [
      [4, 5],
      [4, 7],
      [3, 6],
      [5, 6],
    ];
    expect(adjacentCells).toContainEqual(computer.getAdjacentCoord());
    expect(adjacentCells).toContainEqual(computer.getAdjacentCoord());
    expect(adjacentCells).toContainEqual(computer.getAdjacentCoord());
    expect(adjacentCells).toContainEqual(computer.getAdjacentCoord());
    expect(adjacentCells).not.toContainEqual(computer.getAdjacentCoord());
  });

  // Sometimes test fail, make sure its fixed
  test("getNextCoordInDirection continues to attack in a straight line", () => {
    const remainingCells = [
      [4, 4],
      [4, 5],
      [4, 7],
      [4, 8],
    ];

    // Attack an adjacent cell that is part of the ship
    for (let i = 0; i < 4; ++i) {
      let attackedCell = computer.attack(gameboard);
      let isAttackedCellInRemaining = remainingCells.some(
        (cell) => attackedCell[0] === cell[0] && attackedCell[1] === cell[1],
      );
      if (isAttackedCellInRemaining) break;
    }

    // Attacks in a straight line
    expect(remainingCells).toContainEqual(computer.getNextCoordInDirection());
    expect(remainingCells).not.toContainEqual(
      computer.getNextCoordInDirection(),
    );
  });
});
