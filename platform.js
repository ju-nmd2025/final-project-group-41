export class Platform {
  constructor(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    push();
    fill("green");
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
}
