export let platforms = {
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
};
{
  x: 300,
  y: 150,
  w: 100,
  h: 20,
  draw() {
    push();
    fill("green");
    rect(this.x, this.y, this.w, this.h);
    pop();
  }
}
{
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