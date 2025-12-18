import { gameState } from "./gameState.js";
import Player from "./player.js";
import StartScreen from "./startscreen.js";
import Platform from "./platform.js";

//Global variables
const gravity = 1;
const desiredPlatformCount = 6;
let playerdefaultX = 175;
let playerdefaultY = 300;
let frame = 0;

// Initialize player and startScreen after setup
let player;
let startScreen;

function setup() {
  gameState.player = new Player(175, 300, 50, 50);
  gameState.startScreen = new StartScreen();
  createCanvas(gameState.canvasWidth, gameState.canvasHeight);
  frameRate(60);
  generateStartingPlatforms();
}
function generateStartingPlatforms() {
  // generate initial platforms
  for (let i = 0; i < desiredPlatformCount; i++) {
    const w = gameState.platformWidth;
    const h = gameState.platformHeight;
    const x = Math.floor(Math.random() * (gameState.canvasWidth - w));
    let y = Math.floor(Math.random() * gameState.floor - 50);
    for (let p of gameState.platforms) {
      if (Math.abs(y - p.y) < gameState.platformHeight) {
        y += gameState.platformHeight;
      }
    }
    gameState.platforms.push(makePlatform(x, y, w, h));
  }
}

function draw() {
  background(100, 100, 100);
  switch (gameState.state) {
    case "start":
      gameState.startScreen.show();
      listenForStart();
      break;
    case "playing":
      gameState.startScreen.hide();
      playGame();
      break;
    case "end":
      gameState.startScreen.showEndScreen(gameState.score);
      gameState.player.allowJumping = false;
      listenForStart();
      break;
  }
}

function playGame() {
  frame++;
  checkIfPlayerLost();
  gameState.player.draw();
  gameState.player.jump();
  gameState.player.listenForInput();
  calculatePlayerJump();
  calculateWorldMovement();

  for (let p of gameState.platforms) {
    p.draw();
    p.respawnIfOutOfView();
    p.handleHorizontalBounds();
  }

  // Floor
  line(0, gameState.floor, gameState.canvasWidth, gameState.floor);
  // draw current score
  drawScore();
}

function resetPositions() {
  gameState.player.x = playerdefaultX;
  gameState.player.y = playerdefaultY;
  gameState.player.velocity = 0;
  gameState.floor = 350;
  gameState.score = 0;
  gameState.platforms = [];
  generateStartingPlatforms();
}

function drawScore() {
  push();
  fill("white");
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + gameState.score, 10, 10);
  pop();
}

function checkIfPlayerLost() {
  if (gameState.player.y > gameState.canvasHeight && gameState.floor > gameState.canvasHeight) {
    gameState.state = "end";
  }
}

function makePlatform(x, y, w, h) {
  return new Platform(x, y, w, h);
}

function listenForStart() {
  if (keyIsPressed && key === " ") {
    resetPositions();
    gameState.state = "playing";
    gameState.player.allowJumping = true;
  }
}

function calculateWorldMovement() {
  // move world down when player is above a certain height
  if (gameState.player.y < 100) {
    if (gameState.player.velocity < 0) {
      let moveAmount = -gameState.player.velocity;
      for (let p of gameState.platforms) {
        // move platforms downward instead of upward
        p.y += moveAmount;
        gameState.floor += moveAmount;
      }
      gameState.player.y = 100;
    }
  }
}

function calculatePlayerJump() {
  // update player position based on velocity every frame for smooth movement
  gameState.player.y += gameState.player.velocity;
  // add gravity to velocity every sixth frame, to not make gravity too harsh
  if (frame % 6 === 0) {
    gameState.player.velocity += gravity;
  }

  // check collision with all platforms
  let onPlatform = false;
  for (let p of gameState.platforms) {
    if (gameState.player.velocity >= 0 && gameState.player.isColliding(gameState.player, p)) {
      // if player was falling onto the platform, count it as a landed jump
      if (gameState.player.velocity > 0) {
        gameState.score++;
      }
      gameState.player.y = p.y - gameState.player.h;
      gameState.player.velocity = 0;
      onPlatform = true;
      break; // only one platform at a time
    }
  }
  // floor collision
  if (gameState.player.y + gameState.player.h > gameState.floor && !onPlatform) {
    gameState.player.y = gameState.floor - gameState.player.h;
    gameState.player.velocity = 0;
  }
}

// p5 in global mode requires these functions on the window object when using modules
window.setup = setup;
window.draw = draw;
