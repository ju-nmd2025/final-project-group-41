import platform from "platform";
import { Player } from "./player";
import { StartScreen } from "./startscreen";

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);
}

// Obstacle / Spike / Death
// function drawObstacle() {
//   push();
//   fill("red");
//   triangle(180, 300, 210, 240, 240, 300);
//   pop();
// }

let canvasWidth = 400;
let canvasHeight = 400;
let floor = 350;
let player = new Player(175, 300, 50, 50);
let startScreen = new StartScreen();
let gameState = "start";
let frame = 0;
const gravity = 1;

function draw() {
  background(100, 100, 100);
  switch (gameState) {
    case "start":
      startScreen.show();
      listenForStart();
      break;
    case "playing":
      startScreen.hide();
      player.toggleJumping();
      playGame();
      break;
  }
}

function playGame() {
  frame++;
  // player

  player.draw();
  player.listenForInput();
  calculatePlayerJump();

  // platform
  platform.draw();

  //   platform.x -= 10; //moving platform

  //reset platform when out of screen
  if (platform.x + platform.w < 0) {
    platform.x = 500;
  }

  // // Gravity
  // if (player.y + player.h < 350 && !player.isColliding(player, platform)) {
  //   player.velocity = 0;
  // }

  // Floor
  line(0, floor, canvasWidth, floor);
}

function listenForStart() {
  if (keyIsPressed) {
    gameState = "playing";
  }
}

// function keyPressed() {
//   if (player.y + player.h === floor || player.isColliding(player, platform)) {
//     player.y -= 120;
//   }
// }

function calculatePlayerJump() {
  // update player position based on velocity every frame for smooth movement
  player.y += player.velocity;
  // add gravity to velocity every sixth frame, to not make gravity too harsh
  if (frame % 6 === 0) {
    player.velocity += gravity;
  }
  // Apply gravity to velocity
  if (player.isColliding(player, platform)) {
    player.y = platform.y - player.h;
    player.velocity = 0;
  }

  //if player is on the floor, reset position and velocity
  if (player.y + player.h > floor) {
    player.y = floor - player.h;
    player.velocity = 0;
  }
}
