import { Player } from "./player.js";
import { StartScreen } from "./startscreen.js";
import { Platform } from "./platform.js";

//Global variables
const canvasWidth = 400;
const canvasHeight = 400;
const breakingPlatformChance = 0.2;
const movingPlatformChance = 0.3;
const gravity = 1;
const desiredPlatformCount = 6;
let floor = 350;
let platformWidth = 80;
let platformHeight = 20;
let playerdefaultX = 175;
let playerdefaultY = 300;
let player = new Player(175, 300, 50, 50);
let startScreen = new StartScreen();
let gameState = "start";
let frame = 0;
let score = 0;
let platforms = [];

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);
  generateStartingPlatforms();
}
function generateStartingPlatforms() {
  // generate initial platforms
  for (let i = 0; i < desiredPlatformCount; i++) {
    const w = 80;
    const h = 20;
    const x = Math.floor(Math.random() * (canvasWidth - w));
    let y = Math.floor(Math.random() * floor - 50);
    for (let p of platforms) {
      if (Math.abs(y - p.y) < 20) {
        y += 20;
      }
    }
    platforms.push(makePlatform(x, y, w, h));
  }
}

function draw() {
  background(100, 100, 100);
  switch (gameState) {
    case "start":
      startScreen.show();
      listenForStart();
      break;
    case "playing":
      startScreen.hide();
      playGame();
      break;
    case "end":
      startScreen.showEndScreen(score);
      player.allowJumping = false;
      listenForStart();
      break;
  }
}

function playGame() {
  frame++;
  checkIfPlayerLost();
  player.draw();
  player.jump();
  player.listenForInput();
  calculatePlayerJump();
  calculateWorldMovement();

  for (let p of platforms) {
    p.draw();
    p.respawnIfOutOfView();
    p.handleHorizontalBounds();
  }

  // Floor
  line(0, floor, canvasWidth, floor);
  // draw current score
  drawScore();
}

function resetPositions() {
  player.x = playerdefaultX;
  player.y = playerdefaultY;
  player.velocity = 0;
  floor = 350;
  score = 0;
  platforms = [];
  generateStartingPlatforms();
}

function drawScore() {
  push();
  fill("white");
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);
  pop();
}

function checkIfPlayerLost() {
  if (player.y > canvasHeight && floor > canvasHeight) {
    gameState = "end";
  }
}

function makePlatform(x, y, w = 80, h = 20) {
  return new Platform(x, y, w, h);
}

function listenForStart() {
  if (keyIsPressed && key === " ") {
    resetPositions();
    gameState = "playing";
    player.allowJumping = true;
  }
}

function calculateWorldMovement() {
  // move world down when player is above a certain height
  if (player.y < 100) {
    if (player.velocity < 0) {
      let moveAmount = -player.velocity;
      for (let p of platforms) {
        // move platforms downward instead of upward
        p.y += moveAmount;
        floor += moveAmount;
      }
      player.y = 100;
    }
  }
}

function calculatePlayerJump() {
  // update player position based on velocity every frame for smooth movement
  player.y += player.velocity;
  // add gravity to velocity every sixth frame, to not make gravity too harsh
  if (frame % 6 === 0) {
    player.velocity += gravity;
  }

  // check collision with all platforms
  let onPlatform = false;
  for (let p of platforms) {
    if (player.velocity >= 0 && player.isColliding(player, p)) {
      // if player was falling onto the platform, count it as a landed jump
      if (player.velocity > 0) {
        score++;
      }
      player.y = p.y - player.h;
      player.velocity = 0;
      onPlatform = true;
      break; // only one platform at a time
    }
  }
  // floor collision
  if (player.y + player.h > floor && !onPlatform) {
    player.y = floor - player.h;
    player.velocity = 0;
  }
}

// p5 in global mode requires these functions on the window object when using modules
window.setup = setup;
window.draw = draw;
