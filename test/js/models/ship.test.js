import { Ship } from "../../../src/js/models/ship.js";

describe("Ship class", () => {
  test("Should create a ship object of size 5", () => {
    expect(new Ship(0, 0, 5, true).size).toBe(5);
  });

  test("Newly created ship should not be sunk", () => {
    expect(new Ship(3, 2, 2, false).isSunk()).toBe(false);
  });

  test("Ship should sink after receiving 3 hits", () => {
    const ship = new Ship(0, 0, 3, false);

    expect(ship.isSunk()).toBe(false);
    ship.hit(); // 1st hit
    ship.hit(); // 2nd hit
    expect(ship.isSunk()).toBe(false);
    ship.hit(); // Ship sunk
    expect(ship.isSunk()).toBe(true);
  });
});
