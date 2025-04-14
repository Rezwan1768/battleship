import { initializeGameUI } from "./initializeGameUI.js";

const STARTING_LAYOUT = `
  <div class="board-container player"></div>
  <div class="board-container computer hidden"></div>
  <button class="start-game">Start Game</button>
`;

function resetGameContainer() {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.innerHTML = STARTING_LAYOUT;
  initializeGameUI();
}

export function showModal(text) {
  const dialog = document.querySelector("dialog");
  dialog.querySelector("p").textContent = text;

  const okBtn = dialog.querySelector("button");
  const newBtn = okBtn.cloneNode(true); // Clone to remove previous listeners
  okBtn.replaceWith(newBtn);

  newBtn.addEventListener("click", () => {
    dialog.close();
    resetGameContainer();
  });

  dialog.showModal();
}
