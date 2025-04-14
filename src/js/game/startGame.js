import { renderAttackResult } from "../ui/boardAttackUI.js";
import { showModal } from "./showModal.js";

export function startGame(player, computer, playerBoard, computerBoard) {
  let winner = null;
  let playerTurn = Math.random() < 0.5;

  // Prevent player from interacting with the computer's board
  // if it's not their turn, the game is over, or the board is disabled
  function handlePlayerAttack(event) {
    if (!playerTurn || winner || computerBoard.classList.contains("disabled"))
      return;

    const cell = event.target.closest(".cell");
    if (!cell || !computerBoard.contains(cell)) return;

    computerBoard.classList.add("disabled");

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    const { markedCells, isHit } = player.attack(computer.gameboard, row, col);
    renderAttackResult(computerBoard, markedCells, isHit);

    if (computer.isGameLost()) {
      winner = "Player";
      showModal("You Win!");
      return;
    }
    playerTurn = false;

    // Wait briefly before computer's turn to simulate thinking time
    const waitTime = (Math.random() * 100 + 50) * 10; // Between .5s and 1.5s
    setTimeout(handleComputerAttack, waitTime);
  }

  function handleComputerAttack() {
    const { markedCells, isHit } = computer.attack(player.gameboard);
    renderAttackResult(playerBoard, markedCells, isHit);

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

  // Hide setup controls (start game button, reposition button, etc.)
  // and reveal the computer's board when the game starts
  function setupInitialUI() {
    document.querySelector("button.start-game").classList.add("hidden");
    document.querySelector("button.reposition-ship").classList.add("hidden");
    playerBoard.classList.add("disabled");
    computerBoard.closest(".board-container").classList.remove("hidden");
  }

  return () => {
    setupInitialUI();

    if (!playerTurn) {
      setTimeout(handleComputerAttack, 500);
    }

    computerBoard.addEventListener("click", handlePlayerAttack);
  };
}
