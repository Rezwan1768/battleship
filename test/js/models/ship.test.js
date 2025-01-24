import { Ship } from "../../../src/js/models/ship.js";

describe("Ship class", () => {
  test("Should create a ship object of size 5", () => {
    expect(new Ship(5).size).toBe(5);
  });

  test("Newly created ship should not be sunk", () => {
    expect(new Ship(2).isSunk()).toBe(false);
  });

  test("Ship should sink after receiving 3 hits", () => {
    let destroyer = new Ship(3);

    expect(destroyer.isSunk()).toBe(false);
    destroyer.hit(); // 1st hit
    destroyer.hit(); // 2nd hit
    expect(destroyer.isSunk()).toBe(false);
    destroyer.hit(); // Ship sunk
    expect(destroyer.isSunk()).toBe(true);
  });
});
