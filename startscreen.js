export class StartScreen {
  show() {
    push();
    fill("white");
    textAlign(CENTER);
    textSize(32);
    text("Doodle Jump!", 200, 150);
    textSize(16);
    text("Press Space to start", 200, 200);
    pop();
  }

  hide() {
    push();
    fill(100, 100, 100);
    rect(0, 0, 400, 400);
    pop();
  }

  showEndScreen() {
    push();
    fill("white");
    textAlign(CENTER);
    textSize(32);
    text("Game Over!", 200, 150);
    textSize(16);
    text("Score: " + score, 200, 180);
    text("Press Space to restart", 200, 220);
    pop();
  }
}
export { StartScreen };