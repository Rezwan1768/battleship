import { getBoardSetupElements } from "./ui/setupGameboard.js";
import { renderAttackResult } from "./ui/boardAttackUI.js";

export function playGame() {
  const gameContainer = document.querySelector(".game-container");
  const playerContainer = gameContainer.querySelector(
    ".board-container.player",
  );
  const computerContainer = gameContainer.querySelector(
    ".board-container.computer",
  );

  const {
    player,
    boardLabel: playerBoardLabel,
    playerBoard: playerBoard,
    repositionShipBtn,
  } = getBoardSetupElements(true);
  playerContainer.append(playerBoardLabel, playerBoard, repositionShipBtn);

  const {
    player: computer,
    boardLabel: computerBoardLabel,
    playerBoard: computerBoard,
  } = getBoardSetupElements(false);
  computerContainer.append(computerBoardLabel, computerBoard);

  const startGameBtn = document.querySelector("button.start-game");
  startGameBtn.addEventListener(
    "click",
    startGame(player, computer, playerBoard, computerBoard),
  );
}

function startGame(player, computer, playerBoard, computerBoard) {
  let winner = null;
  let playerTurn = Math.random() < 0.5;

  function handlePlayerAttack(event) {
    if (!playerTurn || winner || computerBoard.classList.contains("disabled"))
      return;

    const cell = event.target.closest(".cell");
    if (!cell || !computerBoard.contains(cell)) return;

    computerBoard.classList.add("disabled");

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    console.log(row, col);
    const { markedCells, isHit } = player.attack(computer.gameboard, row, col);
    renderAttackResult(computerBoard, markedCells, isHit);

    if (computer.isGameLost()) {
      winner = "Player";
      showModal("You Win!");
      return;
    }
    playerTurn = false;

    const waitTime = (Math.random() * 100 + 50) * 10; // Between .5s and 1.5s
    console.log(waitTime);
    setTimeout(handleComputerAttack, waitTime);
  }

  function handleComputerAttack() {
    const { markedCells, isHit } = computer.attack(player.gameboard);
    renderAttackResult(playerBoard, markedCells, isHit);
    // showModal("You Lose!", player, computer, playerBoard, computerBoard)
    if (player.isGameLost()) {
      winner = "Computer";
      showModal("You Lose!");
      return;
    }

    playerTurn = true;

    if (!winner) {
      computerBoard.classList.remove("disabled");
    }
  }

  return () => {
    document.querySelector("button.start-game").classList.add("hidden");
    document.querySelector("button.reposition-ship").classList.add("hidden");
    playerBoard.classList.add("disabled");
    computerBoard.closest(".board-container").classList.remove("hidden");

    if (!playerTurn) {
      setTimeout(handleComputerAttack, 500);
    }

    computerBoard.addEventListener("click", handlePlayerAttack);
  };
}

function showModal(text) {
  const dialog = document.querySelector("dialog");
  dialog.querySelector("p").textContent = text;
  const okBtn = dialog.querySelector("button");
  okBtn.addEventListener("click", () => {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.innerHTML = `
    <div class="board-container player"></div>
    <div class="board-container computer hidden"></div>
    <button class="start-game">Start Game</button>
  `;
    dialog.close();
    playGame();
  });
  dialog.showModal();
}
