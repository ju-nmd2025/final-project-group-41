export let platform = {
  x: 160,
  y: 230,
  w: 80,
  h: 20,

  draw() {
    push();
    fill("green");
    rect(this.x, this.y, this.w, this.h);
    pop();
  },
}
export let platform2 = {
  x: 160,
  y: 230,
  w: 80,
  h: 20,
  draw() {
    push();
    fill("green");
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
}
export let platform3 = {
  x:50,
  y:100,
  w:80,
  h:20,
  draw() {
    push();
    fill("green");
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
}