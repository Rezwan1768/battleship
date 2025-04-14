import { createBoardElement } from "../ui/setupGameboard.js";
import { startGame } from "./startGame.js";

export function initializeGameUI() {
  const gameContainer = document.querySelector(".game-container");
  const playerContainer = gameContainer.querySelector(
    ".board-container.player",
  );
  const computerContainer = gameContainer.querySelector(
    ".board-container.computer",
  );

  // Create player board
  const {
    player,
    boardLabel: playerBoardLabel,
    playerBoard: playerBoard,
    repositionShipBtn,
  } = createBoardElement(true);
  playerContainer.append(playerBoardLabel, playerBoard, repositionShipBtn);

  // Create computer board
  const {
    player: computer,
    boardLabel: computerBoardLabel,
    playerBoard: computerBoard,
  } = createBoardElement(false);
  computerContainer.append(computerBoardLabel, computerBoard);

  const startGameBtn = document.querySelector("button.start-game");
  startGameBtn.addEventListener(
    "click",
    startGame(player, computer, playerBoard, computerBoard),
  );
}
