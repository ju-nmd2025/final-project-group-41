export class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.allowJumping = false;
    this.jumpStrength = 10;
    this.velocity = 0;
  }

  toggleJumping() {
    this.allowJumping = !this.allowJumping;
  }

  draw() {
    rect(this.x, this.y, this.w, this.h);
  }

  jump() {
    if (!this.allowJumping) return;
    // If player is on a platform or the floor, allow jumping
    if (this.isOnPlatform() || this.y + this.h >= floor) {
      if (this.velocity >= 0) {
        this.velocity -= this.jumpStrength;
      }
    }
  }

  isOnPlatform() {
    let onPlatform = false;
    if (platforms && platforms.length) {
      for (let platform of platforms) {
        if (this.isColliding(this, platform)) {
          onPlatform = true;
          return onPlatform;
        }
      }
    }
    return onPlatform;
  }

  isColliding(player, platform) {
    let playerBottom = player.y + player.h;
    if (
      playerBottom >= platform.y &&
      playerBottom <= platform.y + platform.h &&
      player.x + player.w >= platform.x &&
      player.x <= platform.x + platform.w
    ) {
      return true;
    } else {
      return false;
    }
  }

  listenForInput() {
    // Move left
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
    }
    // Move right
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
    }
  }
}
