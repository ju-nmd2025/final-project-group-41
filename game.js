import { Player } from "./player";
import { StartScreen } from "./startscreen";

let canvasWidth = 400;
let canvasHeight = 400;
let floor = 350;
let player = new Player(175, 300, 50, 50);
let startScreen = new StartScreen();
let gameState = "start";
let frame = 0;
// tuned physics
const gravity = 0.6;
player.jumpStrength = 12;
let platforms = [];
const desiredPlatformCount = 10;

function makePlatform(x, y, w = 80, h = 20) {
  return {
    x,
    y,
    w,
    h,
    draw() {
      push();
      fill("green");
      rect(this.x, this.y, this.w, this.h);
      pop();
    },
  };
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);
  // do not enable jumping until the player actually starts the game
  // generate initial platforms
  for (let i = 0; i < desiredPlatformCount; i++) {
    const w = 80;
    const h = 20;
    const x = Math.floor(Math.random() * (canvasWidth - w));
    const y = Math.floor(Math.random() * (floor - 100));
    platforms.push(makePlatform(x, y, w, h));
  }
  // give player the platforms and floor reference
  player.setPlatforms(platforms);
  player.setFloor(floor);
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
  player.listenForInput();
  calculatePlayerJump();
  calculatePlatformMovement();

  for (let p of platforms) {
    p.draw();
    // simple horizontal movement to the left to simulate world scroll
    p.x -= 1.2;
    // reset platform when out of screen
    if (p.x + p.w < 0) {
      // respawn the platform offscreen to the right so it scrolls into view
      p.x = canvasWidth + Math.floor(Math.random() * 200) + 20;
      p.y = Math.floor(Math.random() * (floor - 100));
    }
    // if platform moved below the floor, respawn above the view
    if (p.y > floor) {
      p.y = -Math.floor(Math.random() * 160) - 20;
      p.x = Math.floor(Math.random() * (canvasWidth - p.w));
    }
    // enforce horizontal screen bounds so platforms never leave the visible area
    if (p.x < 0) p.x = 0;
    if (p.x > canvasWidth - p.w) p.x = canvasWidth - p.w;
  }

  // ensure platforms keep appearing (add new ones if count drops)
  while (platforms.length < desiredPlatformCount) {
    const w = 60 + Math.floor(Math.random() * 80);
    const h = 12 + Math.floor(Math.random() * 20);
    const x = canvasWidth + Math.floor(Math.random() * 200);
    const y = -Math.floor(Math.random() * 200);
    platforms.push(makePlatform(x, y, w, h));
    // keep player's platform reference updated
    player.setPlatforms(platforms);
  }

  // Floor
  line(0, floor, canvasWidth, floor);
}

function keyPressed() {
  // start the game from start screen or trigger jump during play
  if (gameState !== "playing") {
    gameState = "playing";
    player.allowJumping = true;
    return;
  }

  // trigger jump on Up, W or Space
  if (keyCode === UP_ARROW || key === " " || key === "w" || key === "W") {
    player.attemptJump();
  }
}

function listenForStart() {
  if (keyIsPressed) {
    gameState = "playing";
    player.allowJumping = true;
  }
}

function calculatePlatformMovement() {
  // move world down when player is above a certain height
  if (player.y < 100) {
    if (player.velocity < 0) {
      let moveAmount = -player.velocity;
      for (let p of platforms) {
        // move platforms downward instead of upward
        p.y += moveAmount;
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
    // only collide with platforms when player is falling (velocity >= 0)
    if (player.velocity >= 0 && player.isColliding(player, p)) {
      player.y = p.y - player.h;
      player.velocity = 0;
      onPlatform = true;
      break; // only one platform at a time
    }
  }
  // auto-jump: if standing on a platform or the floor and vertical velocity is zero, trigger a jump
  if (
    (onPlatform || player.y + player.h >= floor - 1) &&
    player.velocity === 0
  ) {
    player.attemptJump();
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
window.keyPressed = keyPressed;
