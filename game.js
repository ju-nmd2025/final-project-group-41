import platforms from "./platform";
import { Player } from "./player";
import { StartScreen } from "./startscreen";

let canvasWidth = 400;
let canvasHeight = 400;
let floor = 350;
let player = new Player(175, 300, 50, 50);
let startScreen = new StartScreen();
let gameState = "playing";
let frame = 0;
const gravity = 1;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);
  player.toggleJumping();
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
  }
}

function playGame() {
  frame++;
  // player

  player.draw();
  player.jump();
  player.listenForInput();
  calculatePlayerJump();
  calculatePlatformMovement();
  platform.draw();

  for (let platform of platforms) {
    platform.draw();

    //reset platform when out of screen
    if (platform.x + platform.w < 0) {
      platform.x = 500;
    }
    // Floor
    line(0, floor, canvasWidth, floor);
  }

  function listenForStart() {
    if (keyIsPressed) {
      gameState = "playing";
      player.toggleJumping();
    }
  }

  function calculatePlatformMovement() {
    //move world down when player is above a certain height
    if (player.y < 100) {
      if (player.velocity < 0) {
        let moveAmount = -player.velocity;
        for (let platform of platforms) {
          platform.y -= moveAmount;
        }
        Player.y = 100;
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
    //check collision with all platforms
    let onplatfrom = false;
    for (let platform of platforms) {
      if (player.isColliding(player, platform)) {
        console.log("colliding with platform");
        player.y = platform.y - player.h;
        player.velocity = 0;
        onplatfrom = true;
        break; //only one platform at the time
      }
    }
    //floor collision
    if (player.y + player.h > floor && !onplatfrom) {
      player.y = floor - player.h;
      player.velocity = 0;
    }
  }
  // Apply gravity to velocity
  if (player.isColliding(player, platform)) {
    console.log("colliding with platform");
    player.y = platform.y - player.h;
    player.velocity = 0;
  }

  //if player is on the floor, reset position and velocity
  if (player.y + player.h > floor) {
    player.y = floor - player.h;
    player.velocity = 0;
  }
}
