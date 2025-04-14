import { renderShips, clearShipElements } from "./renderShip.js";

export function createElement({
  element,
  content = "",
  classes = [],
  attributes = {},
}) {
  if (!Array.isArray(classes)) classes = [];

  const elem = document.createElement(element);
  elem.textContent = content;
  elem.classList.add(...classes);

  for (let key in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, key))
      elem.setAttribute(key, attributes[key]);
  }
  return elem;
}

export function isDirectInstanceOf(obj, constructor) {
  return Object.getPrototypeOf(obj)?.constructor === constructor;
}

// Place the ships on both logical and UI board
export function placeShipsOnBoard(player, boardElement) {
  player.gameboard.placeShips();
  renderShips(player, boardElement);
}

// Remove ships form both logical nad UI board
export function clearShipsFromBoard(player, boardElement) {
  player.gameboard.clearBoard();
  clearShipElements(boardElement);
}

export function clearElementListClasses(elementList, classes = []) {
  elementList.forEach((element) => {
    element.classList.remove(...classes);
  });
  elementList.length = 0;
}
