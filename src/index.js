import "./styles/test.css";
import { test } from "./js/app.js";
import { Gameboard } from "./js/models/gameboard.js";
import { Ship } from "./js/models/ship.js";
import { ShipManager } from "./js/models/shipManager.js";

const gameboard = new Gameboard();
const shipManager = new ShipManager();

shipManager.placeShipOnBoard(new Ship(4, 4, 2, true), gameboard.board);
// console.log(shipManager.canPlaceShip(4, 4, 2, true, gameboard.board));
// console.log(shipManager.canPlaceShip(0, 0, 1, true, gameboard.board));
gameboard.placeShips();

gameboard.receiveAttack(2, 4);
gameboard.receiveAttack(4, 4);
gameboard.receiveAttack(4, 5);
gameboard.receiveAttack(4, 6);

console.log(gameboard.board);
console.log(test);
