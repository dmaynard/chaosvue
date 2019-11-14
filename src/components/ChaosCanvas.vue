<template>
<div class="chaos-canvas-wrapper">
  <canvas ref="chaos-canvas" @click="clickMethod"></canvas>
  <div v-if=paused>
    <button v-on:click="startAnimation">Start</button>
  </div>
  <div v-else>
    <button v-on:click="pauseAnimation">Pause</button>
  </div>
  <button v-on:click="resetAttractor">Next</button>

  <div v-if=darkmode>
    <button v-on:click="toggleLightMode">Light Mode</button>
  </div>
  <div v-else>
    <button v-on:click="toggleLightMode">Dark Mode</button>
  </div>
  <slot></slot>
</div>
</template>

<script>
/* eslint-disable no-console */
export default {
  data() {
    return {
      // By creating the provider in the data property, it becomes reactive,
      // so child components will update when `context` changes.

      // This is the CanvasRenderingContext that children will draw to.
      ctx: null,
      image: null,
      imageData: null,
      putImageData: null,
      data: null,
      a: 0.1,
      b: 0.2,
      c: 0.3,
      d: 0.4,
      x: 0.1,
      y: 0.1,
      darkmode: false,
      doPixel: null,
      iters: 0,
      itersPerFrame: 5000,
      nTouched: 0,
      nMaxed: 0,
      paused: true,
      nFramesMaxedUnchanged: 0,
      xmin: 100,
      xmax: -100,
      ymin: 100,
      ymax: -100,
      xrange: 1.0,
      yrange: 1.0,
      margin: 20,
      startNewAttractor: true,
      displayDelayDefault: 180,
      displayDelay: 0
    }
  },


  mounted() {
    // We can't access the rendering context until the canvas is mounted to the DOM.
    // Once we have it, provide it to all child components.
    this.$refs['chaos-canvas'].width = this.$refs['chaos-canvas'].parentElement.clientWidth
    this.$refs['chaos-canvas'].height = this.$refs['chaos-canvas'].parentElement.clientHeight;
    this.ctx = this.$refs['chaos-canvas'].getContext('2d');
    this.width = this.$refs['chaos-canvas'].width;
    this.height = this.$refs['chaos-canvas'].height;
    this.image = new Image(this.width, this.height);
    this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    this.data = this.imageData.data;
    this.doPixel = this.darkmode ? this.incPixel : this.decPixel;
    var self = this;
    self.initAttractor;
    // canvasImg.src = "/DSMLego350.jpg";
  },
  methods: {
    initAttractor() {
      this.x = 0.1;
      this.y = 0.1;
      this.iters = 0;
      this.nTouched = 0;
      this.nMaxed = 0;
      this.state = "running";
      this.a = 3.0 * ((Math.random() * 2.0) - 1.0);
      this.b = 3.0 * ((Math.random() * 2.0) - 1.0);
      this.c = ((Math.random() * 2.0) - 1.0) + 0.5;
      this.d = ((Math.random() * 2.0) - 1.0) + 0.5;
      this.xmax = -100.0;
      this.xmin = 100.0;
      this.ymax = -100.0;
      this.ymin = 100.0;
      this.nFramesMaxedUnchanged = 0;
    },
    timeIt(context, f, ...params) {
      let elapsed = -new Date().getTime();
      f.call(context, ...params);
      elapsed += new Date().getTime();
      window.console.log(f.name + " : " + elapsed + " ms");
      return elapsed;
    },
    invert(r, g, b) {
      for (var i = 0; i < this.data.length; i += 4) {
        this.data[i] ^= r; // red
        this.data[i + 1] ^= g; // green
        this.data[i + 2] ^= b; // blue
      }
    },
    zeroImage() {
      for (var i = 0; i < this.data.length; i += 4) {
        this.data[i] = 0; // red
        this.data[i + 1] = 0; // green
        this.data[i + 2] = 0; // blue
        this.data[i + 3] = 255; // opaque
      }
    },
    fillImage(r, g, b) {
      for (var i = 0; i < this.data.length; i += 4) {
        this.data[i] = r; // red
        this.data[i + 1] = g; // green
        this.data[i + 2] = b; // blue
        this.data[i + 3] = 255; // opaque
      }
    },
    clickMethod() {
      this.timeIt(this, this.invert, 0xFF, 0xFF, 0xFF);
      this.timeIt(this.ctx, this.ctx.putImageData, this.imageData, 0, 0);
    },
    timeTest() {
      this.zeroImage();
      this.timeIt(this, this.testAttractor);
    },
    doAnimation() {  // called every frame
      if (this.paused) {
        return;
      }
      if (this.displayDelay > 0) {
          this.displayDelay--;
          window.requestAnimationFrame(this.doAnimation);
          return;
      }
      this.iterateAttractor(this.startNewAttractor);
      this.startNewAttractor = false;
      if (this.nTouched > 0 && this.nTouched < 500) {
         this.startNewAttractor = true;
         this.displayDelay = 0;
      }
    
      window.requestAnimationFrame(this.doAnimation);
      return;
    },
    startAnimation() {
      this.paused = false;
      window.requestAnimationFrame(this.doAnimation.call(this));
    },
    pauseAnimation() {
      this.paused = true;
    },
    resetAttractor() {
      this.startNewAttractor = true;
    },
    iterateAttractor(init) {
      // let elapsed = -new Date().getTime();
      let px = 0;
      let py = 0;
      let nx = 0;
      let ny = 0;

      if (init) {
        this.initAttractor();
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.darkmode) {
          this.zeroImage();
        } else {
          this.fillImage(0xFF, 0xFF, 0xFF);
        }
        this.ctx.putImageData(this.imageData, 0, 0);
      }
      let prevMaxed = this.nMaxed;
      for (var i = 0; i < this.itersPerFrame; i++) {
        /* eslint-disable no-console */
        // console.log (" x " + x + " y " + y);
        this.iters++;

        nx = Math.sin(this.y * this.b) - (this.c * Math.sin(this.x * this.b));
        ny = Math.sin(this.x * this.a) + this.d * Math.cos(this.y * this.a);

        this.x = nx;
        this.y = ny;
        if (init) { // first frame we measure range and domain
          if (this.x < this.xmin) this.xmin = this.x;
          if (this.x > this.xmax) this.xmax = this.x;
          if (this.y < this.ymin) this.ymin = this.y;
          if (this.y > this.ymax) this.ymax = this.y;
        } else {
          px = this.pixelx(this.x);
          py = this.pixely(this.y);
          this.doPixel(px, py);
        }
        // this.testPixel(px,py);
      }
      if (init) {
        this.xrange = this.xmax - this.xmin
        this.yrange = this.ymax - this.ymin
      }
    // console.log(" nTouched: " + this.nTouched + " nMaxed " + this.nMaxed + " this.iters " + this.iters + " % touched " +
      //   (this.nTouched * 100.0 / (this.width * this.height)));
      this.ctx.putImageData(this.imageData, 0, 0);
       // elapsed += new Date().getTime();
       // console.log(" elapsed: " + elapsed + " ms");
      if (this.nMaxed == prevMaxed) {
        this.nFramesMaxedUnchanged++;
      }
    },
    pixelx(x) {
      let px = Math.floor(((x - this.xmin) / this.xrange) * (this.width - (2 * this.margin))) + this.margin;
      if ((px < 0) || (px > this.width)) console.log(" bad x " + px + " " + x);
      return px;
    },
    pixely(y) {
      let py = Math.floor(((y - this.ymin) / this.yrange) * (this.height - (2 * this.margin))) + this.margin;
      if ((py < 0) || (py > this.height)) console.log(" bad y " + py + " " + y);
      return py;
    },
    incPixel(x, y) {
      let i = (y * this.width + x) * 4;
      if (this.data[i] == 0) this.nTouched++;
      if (this.data[i] == 254) this.nMaxed++;
      if (this.data[i] < 255) {
        this.data[i] += 1;
        this.data[i + 1] += 1;
        this.data[i + 2] += 1;
      }
      this.data[i + 3] = 255;
    },
    decPixel(x, y) {
      let i = (y * this.width + x) * 4;
      if (this.data[i] == 255) this.nTouched++;
      if (this.data[i] == 1) this.nMaxed++;
      if (this.data[i] > 0) {
        this.data[i] += -1;
        this.data[i + 1] += -1;
        this.data[i + 2] += -1;
      }
      if (this.data[i] !== this.data[i + 1]) {
        console.log(" not grayscale " + this.data[i] + this.data[i + 1]);
      }
      this.data[i + 3] = 255;

    },
    testPixel(x, y) {
      let i = (y * this.width + x) * 4;
      if (this.data[i] !== this.data[i + 1]) {
        console.log(" not grayscale " + this.data[i] + this.data[i + 1]);
      }
      if (this.data[i + 1] !== this.data[i + 2]) {
        console.log(" not grayscale " + this.data[i] + this.data[i + 1]);
      }
    },
    toggleLightMode() {
      this.darkmode = !this.darkmode;
      if (this.darkmode) {
        this.invert(0xFF, 0xFF, 0xFF);
        this.doPixel = this.incPixel;
      } else {
        this.invert(0xFF, 0xFF, 0xFF);
        this.doPixel = this.decPixel;
      }
      this.ctx.putImageData(this.imageData, 0, 0);
    }
  },


}
</script>
