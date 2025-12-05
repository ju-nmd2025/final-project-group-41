import platform from "platform";
import { Character } from "./character";
import { StartScreen } from "./startscreen";

function setup() {
  createCanvas(canvasWidth, canvasHeight);
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
let player = new Character(175, 300, 50, 50);
let startScreen = new StartScreen();
let gameState = "start";

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
  }
}

function playGame() {
  player.toggleJumping();
  console.log(player.allowJumping);
  player.draw();
  platform.draw();

  //   platform.x -= 10; //moving platform

  //reset platform when out of screen
  if (platform.x + platform.w < 0) {
    platform.x = 500;
  }

  // Gravity
  if (player.y + player.h < 350 && !player.isColliding(player, platform)) {
    player.y += 10;
  }

  // Floor
  line(0, floor, canvasWidth, floor);
}

function listenForStart() {
  if (keyIsPressed) {
    gameState = "playing";
  }
}

function keyPressed() {
  if (player.y + player.h === floor || player.isColliding(player, platform)) {
    player.y -= 120;
  }
}
