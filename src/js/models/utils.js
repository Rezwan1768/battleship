export function isCellInBounds(row, col, len) {
  return row >= 0 && row < len && col >= 0 && col < len;
}

export const marker = {
  MISS: "M",
  HIT: "H",
  BLOCK: "X", // Cells that can't be targeted due to game rules
};

export function getRandomIndex(size) {
  return Math.floor(Math.random() * size);
}
