import { Player } from "./models/player.js";
import { ComputerPlayer } from "./models/computerPlayer.js";
import { createBoard } from "./ui/board.js";
import { placePlayerShips } from "./ui/ship.js";

export function playGame() {
  const player1 = new Player();
  console.log(player1.gameboard.board);
  const player2 = new ComputerPlayer();
  for (let i = 0; i < 20; ++i) player2.attack(player1.gameboard);

  // console.log(player1.gameboard.board)
  const player3 = new Player();
  console.log(player3.gameboard.board);

  let board = createBoard(player3);
  document.body.appendChild(board);
  placePlayerShips(player3);
}
