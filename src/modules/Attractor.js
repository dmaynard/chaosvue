// Attractor
export class AttractorObj {
  constructor(randomize, width, height, darkmode) {
    this.x = 0.1;
    this.y = 0.1;
    this.width = width;
    this.height = height;
    this.frames = 0;
    this.attractorStartTime = performance.now();
    this.nTouched = 0;
    this.nMaxed = 0;
    this.red = true;
    this.green = true;
    this.blue = true;
    this.state = "running";
    this.params = [0.1, 0.2, 0.3, 0.4, 0.1, 0.1];
    this.margin = 20;
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
    this.data = new Uint8ClampedArray(width * height * 4).map(() => 255); // RGBA
    this.darkmode = darkmode;
  }

  iteratePoint(x, y, firstFrame) {
    let nx =
      Math.sin(y * this.params[1]) -
      this.params[2] * Math.sin(x * this.params[1]);
    let ny =
      Math.sin(x * this.params[0]) +
      this.params[3] * Math.cos(y * this.params[0]);

    if (firstFrame) {
      if (nx < this.xmin) this.xmin = nx;
      if (nx > this.xmax) this.xmax = nx;
      if (ny < this.ymin) this.ymin = ny;
      if (ny > this.ymax) this.ymax = ny;
    } else {
      // should toggle on darkmode to decPixel
      this.decPixel(this.pixelx(nx), this.pixely(ny));
    }
    return [nx, ny];
  }
  pixelx(x) {
    let px =
      Math.floor(
        ((x - this.xmin) / (this.xmax - this.xmin)) *
          (this.width - 2 * this.margin)
      ) + this.margin;
    // if ((px < 0) || (px > this.width)) console.log(" bad x " + px + " " + x);
    px = px < 0 ? 0 : px;
    px = px > this.width - 1 ? this.width - 1 : px;
    return px;
  }
  pixely(y) {
    let py =
      Math.floor(
        ((y - this.ymin) / (this.ymax - this.ymin)) *
          (this.height - 2 * this.margin)
      ) + this.margin;
    // if ((px < 0) || (px > this.width)) console.log(" bad x " + px + " " + x);
    py = py < 0 ? 0 : py;
    py = py > this.height - 1 ? this.height - 1 : py;
    return py;
  }
  incPixel(x, y) {
    let i = (y * this.width + x) * 4;
    if (this.data[i] == 0 && this.data[i + 1] == 0 && this.data[i + 2] == 0) {
      this.nTouched++;
    }
    if (
      this.data[i] == 254 ||
      this.data[i + 1] == 254 ||
      this.data[i + 2] == 254
    ) {
      this.nMaxed++;
    }
    if (this.data[i] < 255) {
      this.data[i] += this.red ? 1 : 0;
      this.data[i + 1] += this.green ? 1 : 0;
      this.data[i + 2] += this.blue ? 1 : 0;
    }
    // this.data[i + 3] = 255;
  }
  decPixel(x, y) {
    let i = (y * this.width + x) * 4;
    if (
      this.data[i] == 255 &&
      this.data[i + 1] == 255 &&
      this.data[i + 2] == 255
    ) {
      this.nTouched++;
    }
    if (this.data[i] == 1 || this.data[i + 1] == 1 || this.data[i + 2] == 1) {
      this.nMaxed++;
    }
    if (this.data[i] > 0) {
      this.data[i] += this.red ? -1 : 0;
      this.data[i + 1] += this.green ? -1 : 0;
      this.data[i + 2] += this.blue ? -1 : 0;
    }
    // this.data[i + 3] = 255;
  }
}
