<template>
<div class="chaos-canvas-wrapper">
  <canvas ref="chaos-canvas" @click="clickMethod"></canvas>
  <button v-on:click="startAttractor">Start Attractor</button>
  <button v-on:click="continueAttractor">Continue</button>

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
      darkmode: false,
      doPixel: null,
      iters: 0,
      itersPerFrame: 10000,
      nTouched: 0,
      nMaxed: 0,
      state: "paused"

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
    this.doPixel = this.darkmode? this.incPixel : this.decPixel;

    // canvasImg.src = "/DSMLego350.jpg";
  },
  methods: {
    initAttractor () {
      this.iters = 0;
      this.itersPerFrame = 100000,
      this.nTouched = 0;
      this.nMaxed = 0;
      this.state = "running";
      this.a = 3.0 * ((Math.random() * 2.0) - 1.0);
      this.b = 3.0 * ((Math.random() * 2.0) - 1.0);
      this.c = ((Math.random() * 2.0) - 1.0) + 0.5;
      this.d = ((Math.random() * 2.0) - 1.0) + 0.5;
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
    startAttractor() {
       this.iterateAttractor(true);
    },
    continueAttractor() {
       this.iterateAttractor(false);
    },
    iterateAttractor(init) {
      let elapsed = - new Date().getTime();
      let px = 0;
      let py = 0;

      let x = 0.1;
      let y = 0.1;
      let nx = 0;
      let ny = 0;
      let xmin = 100;
      let xmax = -100;
      let ymin = 100;
      let ymax = -100;

      if (init ) {
      this.initAttractor();
      this.ctx.clearRect(0, 0, this.width, this.height);
      if (this.darkmode) {
        this.zeroImage();
      } else {
        this.fillImage(0xFF, 0xFF, 0xFF);
      }
      this.ctx.putImageData(this.imageData, 0, 0);
      }
      for (var i = 0; i < this.itersPerFrame; i++) {
        /* eslint-disable no-console */
        // console.log (" x " + x + " y " + y);
        this.iters++;

        nx = Math.sin(y * this.b) - (this.c * Math.sin(x * this.b));
        ny = Math.sin(x * this.a) + this.d * Math.cos(y * this.a);

        x = nx;
        y = ny;
        if (x < xmin) xmin = x;
        if (x > xmax) xmax = x;
        if (y < ymin) ymin = y;
        if (y > ymax) ymax = y;
        px = this.pixelx(x);
        py = this.pixely(y);
        this.doPixel(px, py);
        // this.testPixel(px,py);
      }

      console.log(" nTouched: " + this.nTouched + " nMaxed " + this.nMaxed + " this.iters " + this.iters + " % touched " +
       (this.nTouched * 100.0 / (this.width * this.height)));
      this.ctx.putImageData(this.imageData, 0, 0);
      elapsed += new Date().getTime();
      console.log(" elapsed: " + elapsed + " ms");
      this.state = "paused";
    },
    pixelx(x) {
      let px = Math.floor(x * this.width / 6) + this.width / 2;
      if ((px < 0) || (px > this.width)) console.log(" bad x " + px + " " + x);
      return px;
    },
    pixely(y) {
      let py = Math.floor(y * this.height / 6) + this.height / 2;
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
      if (this.data[i+1] !== this.data[i + 2]) {
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
