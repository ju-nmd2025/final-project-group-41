export class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.allowJumping = false;
    this.jumpStrength = 7;
    this.velocity = 0;
    this.platforms = [];
    this.floor = 350;
  }

  toggleJumping() {
    this.allowJumping = !this.allowJumping;
  }

  draw() {
    rect(this.x, this.y, this.w, this.h);
  }

  jump() {
    // legacy: do nothing (jump is now triggered explicitly with `attemptJump`)
  }

  attemptJump() {
    if (!this.allowJumping) return;
    let onPlatform = false;
    if (this.platforms && this.platforms.length) {
      for (let platform of this.platforms) {
        if (this.isColliding(this, platform)) {
          onPlatform = true;
          break;
        }
      }
    }
    const groundY = this.floor ?? 350;
    // allow a small epsilon so standing on the floor/platform counts
    if (onPlatform || this.y + this.h >= groundY - 1) {
      this.velocity -= this.jumpStrength;
    }
  }

  setPlatforms(platforms) {
    this.platforms = platforms;
  }

  setFloor(y) {
    this.floor = y;
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
