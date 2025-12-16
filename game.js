import { Player } from "./player";
import { StartScreen } from "./startscreen";
import { Platform } from "./platform.js";

//Global variables
const canvasWidth = 400;
const canvasHeight = 400;
let floor = 350;
let platformWidth = 80;
let platformHeight = 20;
let playerdefaultX = 175;
let playerdefaultY = 300;
let player = new Player(175, 300, 50, 50);
let startScreen = new StartScreen();
let gameState = "start";
let frame = 0;
let score = 100;
// tuned physics
const gravity = 1;
let platforms = [];
const desiredPlatformCount = 6;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);
  // do not enable jumping until the player actually starts the game
  // generate initial platforms
  for (let i = 0; i < desiredPlatformCount; i++) {
    const w = 80;
    const h = 20;
    const x = Math.floor(Math.random() * (canvasWidth - w));
    let y = Math.floor(Math.random() * floor - 50);
    platforms.push(makePlatform(x, y, w, h));
  }
  // give player the platforms and floor reference
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
      startScreen.showEndScreen();
      player.allowJumping = false;
      resetPositions();
      listenForStart();
      break;
  }
}

function playGame() {
  frame++;
  // player

  checkIfPlayerLost();
  player.draw();
  player.jump();
  player.listenForInput();
  calculatePlayerJump();
  calculateWorldMovement();

  for (let p of platforms) {
    p.draw();
    // simple horizontal movement to the left to simulate world scroll
    // reset platform when out of screen
    if (p.x + p.w < 100) {
      // respawn the platform offscreen to the right so it scrolls into view
      p.x = canvasWidth + Math.floor(Math.random() * 100) + 150;
      p.y = Math.floor(Math.random() * (canvasHeight - 100));
    }
    // if platform moved below the screen, respawn above the view
    if (p.y + p.h > canvasHeight) {
      p.y = generateNonOverlappingY();
      p.x = Math.floor(Math.random() * (canvasWidth - p.w));
    }
    // enforce horizontal screen bounds so platforms never leave the visible area
    if (p.x < 0) p.x = 0;
    if (p.x > canvasWidth - p.w) p.x = canvasWidth - p.w;
  }

  // ensure platforms keep appearing (add new ones if count drops)
  // while (platforms.length < desiredPlatformCount) {
  //   const w = 60 + Math.floor(Math.random() * 100);
  //   const h = 12 + Math.floor(Math.random() * 20);
  //   const x = canvasWidth + Math.floor(Math.random() * 200);

  //   let validY = false;
  //   let y;
  //   let attempts = 0;

  //   //keep trying until we find a Y that doesn't overlap existing platforms
  //   while (!validY && attempts < 30) {
  //     y = canvasHeight + Math.floor(Math.random() * 200);
  //     validY = true;
  //     //Check vertical distance from all exesting platforms
  //     for (const platform of platforms) {
  //       // 40 pixels vertical gap
  //       if (Math.abs(y - platform.y) < 65) {
  //         validY = false;
  //         break;
  //       }
  //     }

  //     attempts++;
  //   }
  //   if (validY) {
  //     platforms.push(makePlatform(x, y, w, h));
  //     // keep player's platform reference updated
  //   }
  // }

  // Floor
  line(0, floor, canvasWidth, floor);
}

function generateNonOverlappingY() {
  while (true) {
    //generate random Y
    let y = -Math.floor(Math.random() * 100) - platformHeight;
    //assume no overlap
    let overlapping = false;
    //check against all existing platforms
    for (let p of platforms) {
      if (Math.abs(y - p.y) < 20) {
        //if too close, try again
        overlapping = true;
        break;
      }
    }
    //if no overlap, return Y
    if (!overlapping) {
      return y;
    }
  }
}
function generateNonOverlappingX() {
  while (true) {
    //generate random X
    let x = Math.floor(Math.random() * (canvasWidth - platformWidth));
    //assume no overlap
    let overlapping = false;
    //check against all existing platforms
    for (let p of platforms) {
      if (Math.abs(x - p.x) < 20) {
        //if too close, try again
        overlapping = true;
        break;
      }
    }
    //if no overlap, return X
    if (!overlapping) {
      return x;
    }
  }
}

function resetPositions() {
  player.x = playerdefaultX;
  player.y = playerdefaultY;
  player.velocity = 0;
  floor = 350;
}

function checkIfPlayerLost() {
  if (player.y > canvasHeight && floor > canvasHeight) {
    gameState = "end";
  }
}

function makePlatform(x, y, w = 80, h = 20) {
  return new Platform(x, y, w, h);
}

function keyPressed() {
  // start the game from start screen or trigger jump during play
  if (gameState !== "playing") {
    gameState = "playing";
    player.allowJumping = true;
    return;
  }
}

function listenForStart() {
  if (keyIsPressed) {
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
window.keyPressed = keyPressed;
