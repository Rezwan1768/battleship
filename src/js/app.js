import { getBoardSetupElements } from "./ui/setupGameboard.js";

export function playGame() {
  const gameContainer = document.querySelector(".game-container");
  const playerContainer = gameContainer.querySelector(
    ".board-container.player",
  );
  const computerContainer = gameContainer.querySelector(
    ".board-container.computer",
  );

  const {
    boardLabel: playerBoardLabel,
    playerBoard: playerBoard,
    repositionShipBtn,
  } = getBoardSetupElements(true);
  playerContainer.append(playerBoardLabel, playerBoard, repositionShipBtn);

  const { boardLabel: computerBoardLabel, playerBoard: computerBoard } =
    getBoardSetupElements(false);
  computerContainer.append(computerBoardLabel, computerBoard);
}
