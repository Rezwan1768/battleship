import { Player } from "../models/player.js";
import { ComputerPlayer } from "../models/computerPlayer.js";
import { createElement } from "./utils.js";
import { createBoard } from "./createBoard.js";
import { renderShips } from "./renderShip.js";
import { getRandomizeShipsBtn } from "./randomizeButton.js";

/**
 * Creates and returns all UI elements needed to set up a player's board.
 * Includes board label, the board itself, and (for humans) a "Randomize Ships" button.
 */
export function createBoardElement(isHumanPlayer) {
  const label = isHumanPlayer ? "Your Board:" : "Opponent Board:";
  const boardLabel = createElement({
    element: "p",
    classes: ["board-label"],
    content: label,
  });

  // Create the appropriate player instance and board element
  const player = isHumanPlayer ? new Player() : new ComputerPlayer();
  const playerBoard = getBoardElement(player);

  const boardSetupElements = {
    player,
    boardLabel,
    playerBoard,
  };

  // Add ship randomization button only for the human player
  if (isHumanPlayer)
    boardSetupElements.repositionShipBtn = getRandomizeShipsBtn(
      player,
      playerBoard,
    );

  return boardSetupElements;
}

// Creates the visual gameboard and renders the player's ships.
function getBoardElement(player) {
  const playerBoard = createBoard(player);
  renderShips(player, playerBoard);
  return playerBoard;
}
