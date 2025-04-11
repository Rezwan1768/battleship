import { Player } from "../models/player.js";
import { ComputerPlayer } from "../models/computerPlayer.js";
import { createElement } from "./utils/utils.js";
import { createBoard } from "./board.js";
import { renderShips } from "./ship.js";
import { getRandomizeShipsBtn } from "./randomizeButton.js";

export function getBoardSetupElements(isHumanPlayer) {
  const label = isHumanPlayer ? "Your Board:" : "Opponent Board:";
  const boardLabel = createElement({
    element: "p",
    classes: ["board-label"],
    content: label,
  });

  const player = isHumanPlayer ? new Player() : new ComputerPlayer();
  const playerBoard = getBoardElement(player);

  const boardSetupElements = {
    player,
    boardLabel,
    playerBoard,
  };

  if (isHumanPlayer)
    boardSetupElements.repositionShipBtn = getRandomizeShipsBtn(
      player,
      playerBoard,
    );

  return boardSetupElements;
}

function getBoardElement(player) {
  const playerBoard = createBoard(player);
  renderShips(player, playerBoard);
  return playerBoard;
}
