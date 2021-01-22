// Attractor
export class AttractorObj {
  constructor(randomize) {
    this.x = 0.1;
    this.y = 0.1;
    this.frames = 0;
    this.attractorStartTime = performance.now();
    this.iters = 0;
    this.nTouched = 0;
    this.nMaxed = 0;
    this.state = "running";
    this.params = [0.1, 0.2, 0.3, 0.4, 0.1, 0.1];
    if (randomize) {
      this.params[0] = 3.0 * (Math.random() * 2.0 - 1.0);
      this.params[1] = 3.0 * (Math.random() * 2.0 - 1.0);
      this.params[2] = Math.random() * 2.0 - 1.0 + 0.5;
      this.params[3] = Math.random() * 2.0 - 1.0 + 0.5;
    }
    this.xmax = -100.0;
    this.xmin = 100.0;
    this.ymax = -100.0;
    this.ymin = 100.0;
    this.nFramesSame = 0;
    this.progress = 0;
    this.elapsedCPU = 0;
    // this.ringBuffer.reset();
  }

  iteratePoint(x, y) {
    let nx =
      Math.sin(y * this.params[1]) -
      this.params[2] * Math.sin(x * this.params[1]);
    let ny =
      Math.sin(x * this.params[0]) +
      this.params[3] * Math.cos(y * this.params[0]);
    return [nx, ny];
  }
}
