// Centralized game state to avoid circular dependencies
export const gameState = {
  state: "start",
  platforms: [],
  floor: 350,
  score: 0,
  canvasWidth: 400,
  canvasHeight: 400,
  platformWidth: 80,
  platformHeight: 20,
  player: null,
  startScreen: null
};
