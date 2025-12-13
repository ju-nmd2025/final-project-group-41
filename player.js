import platforms from "platforms";

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
  }

  jump() {
    if (this.allowJumping) {
      let onPlatform = false;
      for(let platform of platforms){
      if (this.isColliding(this, platform) {
        onPlatform = true;
        break;
      }
    }
        if(onPlatform || this.y + this.h >= 350) {
        console.log("jumping");
        this.velocity -= this.jumpStrength;
      }
    }
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
