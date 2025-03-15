import { Gameboard } from "../../../src/js/models/gameboard.js";
import {
  markNearbyCorners,
  markSunkShipArea,
  getAdjacentCells,
} from "../../../src/js/models/gameboardHelper.js";
import { ShipManager } from "../../../src/js/models/shipManager.js";

describe("Gameboard Helper Functions", () => {
  let gameboard;
  let shipManager;
  let ship1, ship2, ship3;

  beforeEach(() => {
    gameboard = new Gameboard();
    shipManager = new ShipManager();

    ship1 = shipManager.createShip(4, 4, 1, false);
    ship2 = shipManager.createShip(9, 8, 2, true);
    shipManager.placeShipOnBoard(ship1, gameboard.board);
    shipManager.placeShipOnBoard(ship2, gameboard.board);

    ship3 = shipManager.createShip(7, 2, 1, false);
    shipManager.placeShipOnBoard(ship3, gameboard.board);

    // Mark a few surrounding cells around ship3
    gameboard.receiveAttack(6, 2);
    gameboard.receiveAttack(7, 1);
    gameboard.receiveAttack(8, 3);
  });

  describe("markSunkShipArea", () => {
    test("should return all surrounding cells of a sunk ship, excluding occupied or invalid positions", () => {
      const result1 = ["3,3", "3,4", "3,5", "4,3", "4,5", "5,3", "5,4", "5,5"];
      expect(markSunkShipArea(ship1, gameboard.board)).toEqual(result1);

      const result2 = ["8,7", "8,8", "8,9", "9,7"];
      expect(markSunkShipArea(ship2, gameboard.board)).toEqual(result2);

      const result3 = ["6,1", "6,3", "7,3", "8,1", "8,2"];
      expect(markSunkShipArea(ship3, gameboard.board)).toEqual(result3);
    });
  });

  describe("markNearbyCorners", () => {
    test("should return only diagonal corner cells of a ship cell", () => {
      expect(markNearbyCorners(4, 4, gameboard.board)).toEqual([
        "3,3",
        "3,5",
        "5,3",
        "5,5",
      ]);
      expect(markNearbyCorners(9, 9, gameboard.board)).toEqual(["8,8"]);
      expect(markNearbyCorners(7, 2, gameboard.board)).toEqual([
        "6,1",
        "6,3",
        "8,1",
      ]);
    });
  });

  describe("getAdjacentCells", () => {
    test("should return all unmarked adjacent cells of a given ship cell", () => {
      expect(getAdjacentCells(4, 4, gameboard.board)).toEqual([
        "3,4",
        "5,4",
        "4,3",
        "4,5",
      ]);
      expect(getAdjacentCells(9, 9, gameboard.board)).toEqual(["8,9", "9,8"]);
      expect(getAdjacentCells(7, 2, gameboard.board)).toEqual(["8,2", "7,3"]);
    });
  });
});
