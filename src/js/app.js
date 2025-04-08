import { Player } from "./models/player.js";
//import { ComputerPlayer } from "./models/computerPlayer.js";
import { createBoard } from "./ui/board.js";
import { renderShips } from "./ui/ship.js";
import { getRandomizeShipsBtn } from "./ui/randomizeButton.js";

export function playGame() {
  const gameContainer = document.querySelector(".game-container");
  const playerContainer = gameContainer.querySelector(".player-container");

  const playerOne = new Player();
  console.log(playerOne.gameboard.board);
  let playerOneBoard = createBoard(playerOne);
  playerContainer.appendChild(playerOneBoard);
  renderShips(playerOne, playerOneBoard);
  const randomizeShipBtn = getRandomizeShipsBtn(playerOne, playerOneBoard);
  playerContainer.appendChild(randomizeShipBtn);
}
