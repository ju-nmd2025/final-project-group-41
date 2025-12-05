import platform from "platform";

export default class Character {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.allowJumping = false;
    this.jumpHeight = 120;
    this.jumpStrength = 4;
  }

  toggleJumping() {
    this.allowJumping = !this.allowJumping;
  }

  draw() {
    rect(this.x, this.y, this.w, this.h);
    if (this.allowJumping) {
      if (this.isColliding(this, platform)) {
        //jump if colliding with platform

        this.y -= this.jumpHeight;
      }
    }
  }

  isColliding(character, platform) {
    if (
      platform.y === character.y + character.w &&
      platform.x <= character.x + character.w
    ) {
      return true;
    } else {
      return false;
    }
  }
}
