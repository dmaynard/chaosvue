<template>
<div class="chaos-canvas-wrapper">
  <canvas ref="chaos-canvas" @click="resetAttractor"></canvas>
  <span class="menu-wrapper" style="width: 60px ">
    <div v-if=menuUp>
      <button style="float: right" class="close" v-on:click="toggleMenuUp">X</button>
      <div v-if=paused>
        <button ref="resume" class="uiButton" v-on:click="startAnimation">Resume</button>
      </div>
      <div v-else>
        <button ref="pause" class="uiButton" id="pauseButton" v-on:click="pauseAnimation">Pause</button>
      </div>
      <button ref="next" class="uiButton" v-on:click="resetAttractor">Next</button>

      <div v-if=darkmode>
        <button class="uiButton" v-on:click="toggleLightMode">&#x2600;</button>
      </div>
      <div v-else>
        <button class="uiButton" v-on:click="toggleLightMode">&#x263E;</button>
      </div>
    </div>
    <div v-else>
      <button style="float: left" class="close" v-on:click="toggleMenuUp">&#9776;</button>
    </div>

  </span>

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
      frames: 0,
      iters: 0,
      itersPerFrame: 5000,
      itersFirstFrame: 1000,
      nTouched: 0,
      nMaxed: 0,
      paused: false,
      xmin: 100,
      xmax: -100,
      ymin: 100,
      ymax: -100,
      xrange: 1.0,
      yrange: 1.0,
      margin: 20,
      startNewAttractor: true,
      displayDelayDefault: 600,
      displayDelay: 0,
      elapsedCPU: 0,
      enoughMaxed: 10.0,
      progress: 0,
      menuUp: true,
      prevMaxed: 0,
      prevTouched: 0,
      nFramesSame: 0,
      window: {
        width: 0,
        height: 0
      },
      progressBar: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      animationRequestID: null
    }
  },

  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize();

  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
    if (this.animationRequestID) {
      window.cancelAnimationFrame(this.animationRequestID);
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
    this.ctx.drawImage(this.image, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    this.data = this.imageData.data;
    this.doPixel = this.darkmode ? this.incPixel : this.decPixel;
    this.paused = false;
    this.progressBar = this.$refs['next'].getBoundingClientRect();
    this.animationRequestID = window.requestAnimationFrame(this.doAnimation);
  },
  methods: {
    initImageData(w, h) {
      // console.log("resize: w = " + w + " h = " + h);
      this.width = w;
      this.height = h;
      this.$refs['chaos-canvas'].width = w;
      this.$refs['chaos-canvas'].height = h;
      this.ctx = this.$refs['chaos-canvas'].getContext('2d');
      this.width = this.$refs['chaos-canvas'].width;
      this.height = this.$refs['chaos-canvas'].height;
      this.image = new Image(this.width, this.height);
      this.ctx.drawImage(this.image, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
      this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
      this.data = this.imageData.data;
      if (this.darkmode) {
        this.zeroImage();
      } else {
        this.fillImage(0xFF, 0xFF, 0xFF);
      }

      this.ctx.putImageData(this.imageData, 0, 0);

    },
    handleResize() {
      if (this.$refs['chaos-canvas']) { // Has Vue loaded yet?
        this.initImageData(window.innerWidth, window.innerHeight);
      }
    },
    initAttractor() {
      this.x = 0.1;
      this.y = 0.1;
      this.frames = 0;
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
      this.nFramesSame = 0;
      this.progress = 0;
      // console.log(" Ran for " + Math.floor((this.elapsedCPU * 1 / 1000 / 60)) + " minutes " +
      // Math.floor((this.elapsedCPU / 1000 % 60)) + " seconds");
      this.elapsedCPU = 0;
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
    doAnimation: function() { // called every frame
      const startTime = new Date().getTime();
      if (this.paused) {
        return; // breaks the animation callback chain
      }
      if (this.displayDelay > 0) {
        this.displayDelay--;
        this.ctx.putImageData(this.imageData, 0, 0);
        this.drawProgressBar(this.progress);
        this.animationRequestID = window.requestAnimationFrame(this.doAnimation);
        return;
      }
      this.prevMaxed = this.nMaxed;
      this.prevTouched = this.nTouched;

      this.iterateAttractor(this.startNewAttractor);
      this.startNewAttractor = false;
      if (this.nTouched > 0 && this.nTouched < 500) {
        this.startNewAttractor = true;
        this.displayDelay = 0;
      }
      if ((this.nTouched == this.prevTouched) && (this.nMaxed == this.prevMaxed)) {
        this.nFramesSame++
        if (this.nFramesSame > 60) {
          // console.log("no changes for 60 frames, abort this attractor")
          this.startNewAttractor = true;
          this.progress = 100;
          this.displayDelay = this.displayDelayDefault;
        }
      }

      let percentMaxed = (this.nMaxed * 100 / this.nTouched);
      this.progress = Math.min(((percentMaxed * 100.) / this.enoughMaxed), 100.);
      this.drawProgressBar(this.progress);
      if (percentMaxed > this.enoughMaxed) {
        this.startNewAttractor = true;
        this.displayDelay = (this.nTouched > 5000) ? this.displayDelayDefault : 0;
        // console.log(this.nTouched + " touched " + this.nMaxed + " maxed " +
        //  percentMaxed + " percent " + "  Progress " + this.progress);

        // console.log(" Enough ");
      }

      this.drawProgressBar(this.progress);
      this.elapsedCPU += (new Date().getTime()) - startTime;
      if (this.elapsedCPU < 0) {
        console.log(" impossible ");
      }
      this.animationRequestID = window.requestAnimationFrame(this.doAnimation);
      return;
    },
    startAnimation: function() {
      this.paused = false;
      this.animationRequestID = window.requestAnimationFrame(this.doAnimation);
    },
    pauseAnimation() {
      this.paused = true;
    },
    resetAttractor() {
      if (this.paused) {
        this.paused = false;
        this.animationRequestID = window.requestAnimationFrame(this.doAnimation);
      }
      this.displayDelay = 0;
      this.startNewAttractor = true;
    },
    iteratePoint: function(x, y) {
      let nx = Math.sin(y * this.b) - (this.c * Math.sin(x * this.b));
      let ny = Math.sin(x * this.a) + this.d * Math.cos(y * this.a);
      return [nx, ny];
    },

    iterateAttractor(init) {

      let px = 0;
      let py = 0;
      // let nx = 0;
      // et ny = 0;

      if (init) {
        this.initAttractor();
        this.ctx.fillStyle = this.darkmode ? 'rgba(0,0,0,1.0)' : 'rgba(255,255,255,1.0)'
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        this.data = this.imageData.data;
      }
      this.frames++;
      for (var i = 0; i < (init ? this.itersFirstFrame : this.itersPerFrame); i++) {
        /* eslint-disable no-console */
        // console.log (" x " + x + " y " + y);
        this.iters++;

        // nx = Math.sin(this.y * this.b) - (this.c * Math.sin(this.x * this.b));
        // ny = Math.sin(this.x * this.a) + this.d * Math.cos(this.y * this.a);
        [this.x, this.y] = this.iteratePoint(this.x, this.y)
        // this.x = nx;
        // this.y = ny;
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
      }
      if (init) {
        this.xrange = this.xmax - this.xmin
        this.yrange = this.ymax - this.ymin
      }
      this.ctx.putImageData(this.imageData, 0, 0);
    },
    pixelx(x) {
      let px = Math.floor(((x - this.xmin) / this.xrange) * (this.width - (2 * this.margin))) + this.margin;
      // if ((px < 0) || (px > this.width)) console.log(" bad x " + px + " " + x);
      px = (px < 0) ? 0 : px;
      px = (px > this.width - 1) ? this.width - 1 : px;
      return px;
    },
    pixely(y) {
      let py = Math.floor(((y - this.ymin) / this.yrange) * (this.height - (2 * this.margin))) + this.margin;
      // if ((py < 0) || (py > this.height)) console.log(" bad y " + py + " " + y);
      py = (py < 0) ? 0 : py;
      py = (py > this.height - 1) ? this.height - 1 : py;
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
      // this.data[i + 3] = 255;
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
      // this.data[i + 3] = 255;
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
    setMenuText(darkMode) {
      let newColor = darkMode ? 'white' : 'black';
      document.getElementsByClassName("uiButton").forEach(function(element) {
        element.style.color = newColor;
      });
    },
    toggleLightMode() {
      this.darkmode = !this.darkmode;
      this.setMenuText(this.darkmode);
      if (this.darkmode) {
        this.invert(0xFF, 0xFF, 0xFF);
        this.doPixel = this.incPixel;
      } else {
        this.invert(0xFF, 0xFF, 0xFF);
        this.doPixel = this.decPixel;
      }
      this.ctx.putImageData(this.imageData, 0, 0);
    },
    toggleMenuUp() {
      this.menuUp = !this.menuUp;
      this.ctx.putImageData(this.imageData, 0, 0);
    },
    drawProgressBar(progress) {
      let pButton = this.$refs['next'];

      if (pButton) {
        if (this.displayDelay == 0) {
          this.ctx.fillStyle = 'rgba(0,225,0,0.3)';
          this.ctx.fillRect(this.progressBar.x, this.progressBar.y + 1,
            (progress * pButton.clientWidth / 100.), pButton.clientHeight);
        } else {
          this.ctx.fillStyle = 'rgba(0,225,0,0.5)';
          this.ctx.fillRect(this.progressBar.x, this.progressBar.y + 1,
            pButton.clientWidth, pButton.clientHeight)
          this.ctx.fillStyle = 'rgba(225,255,0,0.5)';
          this.ctx.fillRect(this.progressBar.x, this.progressBar.y + 1,
            (((this.displayDelayDefault - this.displayDelay) / this.displayDelayDefault) * pButton.clientWidth), pButton.clientHeight);
        }

      }
    }
  },


}
</script>
<style scoped>
button.uiButton {
  width: 100%;
  text: centered;
  border-radius: 4px;
  background-color: Transparent;
  background-repeat: no-repeat;
  font-size: 12px;
}

button.close {
  width: 25px;
  float: right;
  border-radius: 2px;
}

canvas {
  display: span;
}

span.menu-wrapper {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
