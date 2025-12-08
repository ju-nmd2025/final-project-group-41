import platform from "platform";

export default class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.allowJumping = false;
    this.jumpStrength = 7;
    this.velocity = 0;
  }

  toggleJumping() {
    this.allowJumping = !this.allowJumping;
  }

  draw() {
    rect(this.x, this.y, this.w, this.h);
    if (this.allowJumping) {
      if (this.isColliding(this, platform) || this.y + this.h >= 350) {
        //jump if colliding with platform
        this.velocity -= this.jumpStrength;
      }
    }
  }

  isColliding(player, platform) {
    if (
      player.y + player.h === platform.y &&
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
