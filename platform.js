import { gameState } from "./gameState.js";

export default class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isMoving = false;
    this.isBreaking = false;
    this.direction = 0;
    this.isBroken = false;
    this.movingPlatformChance = 0.3;
    this.breakingPlatformChance = 0.2;
  }

  draw() {
    if (this.isBreaking) {
      if (this.isBroken) {
        this.y += 7; //fall down if broken
      }
      push();
      fill("brown");
      rect(this.x, this.y, this.w, this.h);
      pop();
    } else if (this.isMoving) {
      //if platform is moving, update its position
      switch (this.direction) {
        case 1:
          this.x += 2;
          break;
        case -1:
          this.x -= 2;
          break;
      }
      push();
      fill("blue");
      rect(this.x, this.y, this.w, this.h);
      pop();
    } else {
      push();
      fill("green");
      rect(this.x, this.y, this.w, this.h);
      pop();
    }
  }

  resetType() {
    this.isMoving = false;
    this.isBreaking = false;
    this.direction = 0;
    this.isBroken = false;
  }

  changeDirection() {
    this.direction *= -1;
  }

  respawnIfOutOfView() {
    // if platform moved below the screen, respawn above the view
    if (this.y > gameState.canvasHeight) {
      this.resetType();
      this.y = this.#generateNonOverlappingY();
      this.x = Math.floor(Math.random() * (gameState.canvasWidth - this.w));
      if (Math.random() < this.movingPlatformChance) {
        this.isMoving = true;
        if (Math.random() < 0.5) {
          this.direction = 1;
        } else {
          this.direction = -1;
        }
      } else if (Math.random() < this.breakingPlatformChance) {
        this.isBreaking = true;
      }
    }
  }

  handleHorizontalBounds() {
    // Ensure platform not going outside of screen
    if (this.x < 0) {
      this.changeDirection();
      this.x = 0;
    }
    if (this.x > gameState.canvasWidth - this.w) {
      this.x = gameState.canvasWidth - this.w;
      this.changeDirection();
    }
  }

  #generateNonOverlappingY() {
    while (true) {
      //generate random Y
      let y = -Math.floor(Math.random() * 100) - gameState.platformHeight;
      //assume no overlap
      let overlapping = false;
      //check against all existing platforms
      for (let p of gameState.platforms) {
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
}
export { Platform };
