import { Gameboard } from "../../../src/js/models/gameboard.js";
import { Player } from "../../../src/js/models/player.js";

jest.mock("../../../src/js/models/gameboard.js");

describe("Player class", () => {
  let player;
  let mockGameboard;

  beforeEach(() => {
    Gameboard.mockClear();
    mockGameboard = new Gameboard();
    mockGameboard.receiveAttack = jest.fn((x, y) => ({
      markedCells: ["3,4"],
      isHit: true,
    }));
    mockGameboard.areAllShipSunk = jest.fn().mockReturnValue(false);

    player = new Player();
  });

  test("Player initializes with a gameboard", () => {
    expect(player.gameboard).toBeInstanceOf(Gameboard);
    // Player creates it's own Gameboard object
    expect(Gameboard).toHaveBeenCalledTimes(2);
  });

  test("Player can attack an opponent's board", () => {
    const x = 3,
      y = 4;
    // receiveAttack called here
    expect(player.attack(mockGameboard, x, y)).toEqual({
      markedCells: [`${x},${y}`],
      isHit: true,
    });
    expect(mockGameboard.receiveAttack).toHaveBeenCalledWith(x, y);
  });

  test("isGameLost returns true when all ships are sunk", () => {
    player.gameboard.areAllShipSunk = jest.fn(() => true);
    expect(player.isGameLost()).toBe(true);
  });

  test("isGameOver returns false when ships remain on the board", () => {
    player.gameboard.areAllShipSunk = jest.fn(() => false);
    expect(player.isGameLost()).toBe(false);
  });
});
