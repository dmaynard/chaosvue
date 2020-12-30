<template>
  <div class="chaos-canvas-wrapper">
    <canvas ref="chaos-canvas" @click="resetAttractor(false)"></canvas>
    <span class="menu-wrapper" style="width: 150px ">
      <div v-if="menuUp">
        <button
          class="close labeltag"
          v-bind:class="{ dark: darkmode, light: !darkmode }"
          v-on:click="toggleMenuUp"
        >
          X
        </button>
        <div v-if="paused">
          <button
            ref="resume"
            class="uiButton"
            v-bind:class="{ dark: darkmode, light: !darkmode }"
            v-on:click="startAnimation"
          >
            Resume
          </button>
        </div>
        <div v-else>
          <button
            ref="pause"
            class="uiButton"
            id="pauseButton"
            v-bind:class="{ dark: darkmode, light: !darkmode }"
            v-on:click="pauseAnimation"
          >
            Pause
          </button>
        </div>
        <button
          ref="next"
          class="uiButton"
          v-bind:class="{ dark: darkmode, light: !darkmode }"
          v-on:click="resetAttractor(true)"
        >
          Next
        </button>

        <div v-if="darkmode">
          <button
            class="uiButton"
            v-bind:class="{ dark: darkmode, light: !darkmode }"
            v-on:click="toggleLightMode"
          >
            &#x2600;
          </button>
        </div>
        <div v-else>
          <button
            class="uiButton"
            v-bind:class="{ dark: darkmode, light: !darkmode }"
            v-on:click="toggleLightMode"
          >
            &#x263E;
          </button>
        </div>
        <button
          class="uiButton"
          v-bind:class="{ dark: darkmode, light: !darkmode }"
          v-on:click="doAbout"
        >
          About
        </button>
        <div class="checkdiv">
          <input
            class="inline"
            type="checkbox"
            id="autoPause"
            v-model="autoPause"
          />
          <label
            class="inline"
            for="autoPause"
            v-bind:class="{ labeldark: darkmode, labellight: !darkmode }"
          >
            Auto Pause</label
          >
        </div>
        <div class="checkdiv">
          <input
            class="inline"
            type="checkbox"
            id="showPath"
            background-color="Transparent"
            v-model="showPaths"
          />
          <label
            class="inline"
            for="showPath"
            v-bind:class="{ labeldark: darkmode, labellight: !darkmode }"
          >
            Show Paths</label
          >
        </div>
        <div class="checkdiv">
          <input
            class="inline"
            type="checkbox"
            id="advanceMode"
            background-color="Transparent"
            v-model="advancedMode"
          />
          <label
            class="inline"
            for="advanceMode"
            v-bind:class="{ labeldark: darkmode, labellight: !darkmode }"
          >
            Advanced</label
          >
        </div>
        <div v-if="advancedMode">
          <vue-speedometer
            id="Iterations"
            :value="meanItersPerMillisonds"
            :width="150"
            :height="100"
            :maxValue="800"
          />
          <label
            align="center"
            for="Iterations"
            v-bind:class="{ labeldark: darkmode, labellight: !darkmode }"
            >Iterations/ms</label
          >
          <vue-speedometer
            id="Frames"
            :value="framesPerSecond"
            :width="150"
            :height="100"
            :maxValue="60"
          />
          <label
            align="center"
            for="Frames"
            v-bind:class="{ labeldark: darkmode, labellight: !darkmode }"
            >Frames/second</label
          >
          <button
            ref="redraw"
            class="uiButton"
            id="redrawButton"
            v-bind:class="{ dark: darkmode, light: !darkmode }"
            v-on:click="redrawAttractor"
          >
            Clear
          </button>
          <div class="checkdiv">
            <input
              class="inline"
              type="checkbox"
              id="redcheck"
              background-color="Transparent"
              v-model="red"
            />
            <label
              class="inline"
              for="redcheck"
              v-bind:class="{ labeldark: darkmode, labellight: !darkmode }"
              >{{ colors[0] }}</label
            >
          </div>
          <div class="checkdiv">
            <input
              class="inline"
              type="checkbox"
              background-color="Transparent"
              id="greencheckbox"
              v-model="green"
            />
            <label
              class="inline"
              for="greencheckbox"
              v-bind:class="{ labeldark: darkmode, labellight: !darkmode }"
              >{{ colors[1] }}</label
            >
          </div>
          <div class="checkdiv">
            <input
              class="inline"
              type="checkbox"
              background-color="Transparent"
              id="bluecheckbox"
              v-model="blue"
            />
            <label
              class="inline"
              for="bluecheckbox"
              v-bind:class="{ labeldark: darkmode, labellight: !darkmode }"
              >{{ colors[2] }}</label
            >
          </div>

          <input
            v-bind:class="{ numInputDark: darkmode, numInputLight: !darkmode }"
            v-model="paramStrings[0]"
            v-on:click="parseParams(0)"
            v-on:keyup.enter="parseParams(0)"
            @change="onInputChange(0)"
          />
          <span>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(0, 0)"
            >
              &#x27F1;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(0, 1)"
            >
              &#x2B07;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(0, 2)"
            >
              &#x2B06;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(0, 3)"
            >
              &#x27F0;
            </button>
          </span>

          <input
            v-bind:class="{ numInputDark: darkmode, numInputLight: !darkmode }"
            v-model="paramStrings[1]"
            v-on:click="parseParams(1)"
            v-on:keyup.enter="parseParams(1)"
            @change="onInputChange(1)"
          />
          <span>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(1, 0)"
            >
              &#x27F1;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(1, 1)"
            >
              &#x2B07;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(1, 2)"
            >
              &#x2B06;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(1, 3)"
            >
              &#x27F0;
            </button>
          </span>

          <input
            v-bind:class="{ numInputDark: darkmode, numInputLight: !darkmode }"
            v-model="paramStrings[2]"
            v-on:click="parseParams(2)"
            v-on:keyup.enter="parseParams(2)"
            @change="onInputChange(2)"
          />
          <span>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(2, 0)"
            >
              &#x27F1;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(2, 1)"
            >
              &#x2B07;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(2, 2)"
            >
              &#x2B06;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(2, 3)"
            >
              &#x27F0;
            </button>
          </span>
          <input
            v-bind:class="{ numInputDark: darkmode, numInputLight: !darkmode }"
            v-model="paramStrings[3]"
            v-on:click="parseParams(3)"
            v-on:keyup.enter="parseParams(3)"
            @change="onInputChange(3)"
          />
          <span>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(3, 0)"
            >
              &#x27F1;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(3, 1)"
            >
              &#x2B07;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(3, 2)"
            >
              &#x2B06;
            </button>
            <button
              class="arrow"
              v-bind:class="{ dark: darkmode, light: !darkmode }"
              v-on:click="tweakParams(3, 3)"
            >
              &#x27F0;
            </button>
          </span>
        </div>
      </div>
      <div v-else>
        <button
          style="float: left"
          class="close labeltag"
          v-bind:class="{ dark: darkmode, light: !darkmode }"
          v-on:click="toggleMenuUp"
        >
          &#9776;
        </button>
      </div>
    </span>
  </div>
</template>

<script>
/* eslint-disable no-console */
import VueSpeedometer from "vue-speedometer";
import { RingBuffer } from "../modules/RingBuffer";
const logPerfArraySize = 8; // 2**8 = 256 perfSamples
export default {
  data() {
    return {
      // This is the CanvasRenderingContext that children will draw to.
      ctx: null,
      image: null,
      imageData: null,
      putImageData: null,
      data: null,
      params: [0.1, 0.2, 0.3, 0.4, 0.1, 0.1],
      paramStrings: ["", "", "", "", "", ""],

      randomize: true,
      darkmode: false,
      doPixel: null,
      frames: 0,
      iters: 0,
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
        height: 0,
      },
      progressBar: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      spinner: {
        x: 0,
        y: 0,
        radius: 0,
      },
      frameAngle: Math.PI / 3.0 / 60.0,
      animationRequestID: null,
      aboutUrl: "https://software-artist.com/chaotic-attractor",
      advancedMode: false,
      showPaths: false,
      autoPause: false,
      msFrameBudget: 15, // should be less than 16 for 60 fps.
      clearScreen: true,
      red: true,
      green: true,
      blue: true,
      additiveColors: [" Red", " Green", " Blue"],
      subtractiveColors: [" Cyan", " Magenta", " Yellow"],
      colors: [],
      tweakAmounts: [0.99, 0.999, 1.001, 1.01],
      ringBuffer: null,
      ringBufferSize: 30,
      framePerfs: new Array(2 ** logPerfArraySize),
      meanItersPerMillisonds: 0,
      attractorStartTime: 0,
    };
  },

  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
    if (this.animationRequestID) {
      window.cancelAnimationFrame(this.animationRequestID);
    }
  },

  mounted() {
    // We can't access the rendering context until the canvas is mounted to the DOM.
    // Once we have it, provide it to all child components.
    this.$refs["chaos-canvas"].width = this.$refs[
      "chaos-canvas"
    ].parentElement.clientWidth;
    this.$refs["chaos-canvas"].height = this.$refs[
      "chaos-canvas"
    ].parentElement.clientHeight;
    this.ctx = this.$refs["chaos-canvas"].getContext("2d");
    this.width = this.$refs["chaos-canvas"].width;
    this.height = this.$refs["chaos-canvas"].height;
    this.image = new Image(this.width, this.height);
    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.width,
      this.height,
      0,
      0,
      this.width,
      this.height
    );
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    this.data = this.imageData.data;
    this.doPixel = this.darkmode ? this.incPixel : this.decPixel;
    this.paused = false;
    this.progressBar = this.$refs["next"].getBoundingClientRect();
    this.spinner.radius = this.progressBar.height / 2 - 4;
    this.spinner.x = this.progressBar.x + this.progressBar.width / 2;
    this.spinner.y = this.progressBar.y + this.progressBar.height / 2;
    this.animationRequestID = window.requestAnimationFrame(this.doAnimation);
    this.dateObject = new Date();
    this.colors = this.darkMode ? this.additaveColors : this.subtractiveColors;

    this.ringBuffer = new RingBuffer(this.ringBufferSize);
  },
  methods: {
    initImageData(w, h) {
      console.log("resize: w = " + w + " h = " + h);
      this.width = w;
      this.height = h;
      this.$refs["chaos-canvas"].width = w;
      this.$refs["chaos-canvas"].height = h;
      this.ctx = this.$refs["chaos-canvas"].getContext("2d");
      this.width = this.$refs["chaos-canvas"].width;
      this.height = this.$refs["chaos-canvas"].height;
      this.image = new Image(this.width, this.height);
      this.ctx.drawImage(
        this.image,
        0,
        0,
        this.width,
        this.height,
        0,
        0,
        this.width,
        this.height
      );
      this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
      this.data = this.imageData.data;
      if (this.darkmode) {
        this.zeroImage();
      } else {
        this.fillImage(0xff, 0xff, 0xff);
      }
      this.ctx.putImageData(this.imageData, 0, 0);
    },
    handleResize() {
      if (this.$refs["chaos-canvas"] && !this.advancedMode) {
        // Has Vue loaded yet?
        this.initImageData(window.innerWidth, window.innerHeight);
      }
    },
    initAttractor(randomize) {
      this.x = 0.1;
      this.y = 0.1;
      this.frames = 0;
      this.attractorStartTime = performance.now();
      this.iters = 0;
      this.nTouched = 0;
      this.nMaxed = 0;
      this.state = "running";
      if (randomize) {
        this.params[0] = 3.0 * (Math.random() * 2.0 - 1.0);
        this.params[1] = 3.0 * (Math.random() * 2.0 - 1.0);
        this.params[2] = Math.random() * 2.0 - 1.0 + 0.5;
        this.params[3] = Math.random() * 2.0 - 1.0 + 0.5;
      }
      this.paramStrings[0] = this.params[0].toString();
      this.paramStrings[1] = this.params[1].toString();
      this.paramStrings[2] = this.params[2].toString();
      this.paramStrings[3] = this.params[3].toString();
      this.xmax = -100.0;
      this.xmin = 100.0;
      this.ymax = -100.0;
      this.ymin = 100.0;
      this.nFramesSame = 0;
      this.progress = 0;
      // console.log(" Ran for " + Math.floor((this.elapsedCPU * 1 / 1000 / 60)) + " minutes " +
      // Math.floor((this.elapsedCPU / 1000 % 60)) + " seconds");
      this.elapsedCPU = 0;
      this.ringBuffer.reset();
    },
    timeIt(context, f, ...params) {
      let elapsed = -performance.now();
      f.call(context, ...params);
      elapsed += performance.now();
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
      this.timeIt(this, this.invert, 0xff, 0xff, 0xff);
      this.timeIt(this.ctx, this.ctx.putImageData, this.imageData, 0, 0);
    },
    timeTest() {
      this.zeroImage();
      this.timeIt(this, this.testAttractor);
    },
    doAnimation: function() {
      // called every frame
      const frameStartTime = performance.now();
      if (this.paused) {
        this.animationRequestID = window.requestAnimationFrame(
          this.doAnimation
        );
        return; // breaks the animation callback chain
      }
      if (this.displayDelay > 0) {
        this.displayDelay--;
        if (this.displayDelay == 0 && this.autoPause) {
          this.paused = true;
        }
        this.ctx.putImageData(this.imageData, 0, 0);
        this.drawProgressBar(this.progress);
        if (this.showPaths) {
          this.drawPaths();
        }
        this.animationRequestID = window.requestAnimationFrame(
          this.doAnimation
        );
        return;
      }
      this.prevMaxed = this.nMaxed;
      this.prevTouched = this.nTouched;

      this.iterateAttractor(
        this.startNewAttractor,
        this.randomize,
        this.clearScreen
      );
      this.startNewAttractor = false;
      this.clearScreen = true;
      if (!this.showPaths && this.nTouched > 0 && this.nTouched < 500) {
        this.startNewAttractor = true;
        this.displayDelay = 0;
      }
      if (this.nTouched == this.prevTouched && this.nMaxed == this.prevMaxed) {
        this.nFramesSame++;
        if (this.nFramesSame > 120) {
          // console.log("no changes for 120 frames, abort or pause this attractor")
          if (this.advancedMode) {
            this.paused = true;
          } else {
            this.startNewAttractor = true;
            this.progress = 100;
            this.displayDelay = this.displayDelayDefault;
          }
        }
      } else {
        this.nFramesSame = 0;
      }

      let percentMaxed = (this.nMaxed * 100) / this.nTouched;
      this.progress = Math.min((percentMaxed * 100) / this.enoughMaxed, 100);
      this.drawProgressBar(this.progress);
      if (percentMaxed > this.enoughMaxed && !this.advancedMode) {
        this.startNewAttractor = true;
        this.displayDelay = this.nTouched > 5000 ? this.displayDelayDefault : 0;
        // console.log(this.nTouched + " touched " + this.nMaxed + " maxed " +
        //  percentMaxed + " percent " + "  Progress " + this.progress);

        console.log(" Enough ");
      }

      this.drawProgressBar(this.progress);
      this.elapsedCPU += performance.now() - frameStartTime;
      if (this.elapsedCPU < 0) {
        console.log(" impossible ");
      }
      this.framesPerSecond = Math.floor(
        0.5 +
          (this.frames * 1000) / (performance.now() - this.attractorStartTime)
      );
      // console.log(" frames per second: " + this.framesPerSecond);
      this.animationRequestID = window.requestAnimationFrame(this.doAnimation);
      return;
    },
    startAnimation: function() {
      this.paused = false;
      // this.animationRequestID = window.requestAnimationFrame(this.doAnimation);
    },
    pauseAnimation() {
      this.paused = true;
    },
    resetAttractor(forceNext) {
      if (this.advancedMode && !forceNext) {
        return;
      }
      if (this.paused) {
        this.paused = false;
        // this.animationRequestID = window.requestAnimationFrame(this.doAnimation);
      }
      this.displayDelay = 0;
      this.startNewAttractor = true;
      this.randomize = true;
      this.clearScreen = true;
    },
    iteratePoint: function(x, y) {
      let nx =
        Math.sin(y * this.params[1]) -
        this.params[2] * Math.sin(x * this.params[1]);
      let ny =
        Math.sin(x * this.params[0]) +
        this.params[3] * Math.cos(y * this.params[0]);
      return [nx, ny];
    },

    iterateAttractor(init, randomize, clearScreen) {
      let px = 0;
      let py = 0;
      // let nx = 0;
      // et ny = 0;
      let frameStartTime = performance.now();
      let msElapsed = 0;
      let loopCount = 0;

      if (init) {
        this.initAttractor(randomize);
        if (clearScreen) {
          this.ctx.fillStyle = this.darkmode
            ? "rgba(0,0,0,1.0)"
            : "rgba(255,255,255,1.0)";
          this.ctx.fillRect(0, 0, this.width, this.height);
          this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
          this.data = this.imageData.data;
        }

        // this.randomize = true;
      }
      this.frames++;
      while (msElapsed < this.msFrameBudget) {
        /* eslint-disable no-console */
        // console.log (" x " + x + " y " + y);
        this.iters++;
        loopCount++;
        [this.x, this.y] = this.iteratePoint(this.x, this.y);
        // this.x = nx;
        // this.y = ny;
        if (init) {
          // first frame we measure range and domain
          if (this.x < this.xmin) this.xmin = this.x;
          if (this.x > this.xmax) this.xmax = this.x;
          if (this.y < this.ymin) this.ymin = this.y;
          if (this.y > this.ymax) this.ymax = this.y;
        } else {
          px = this.pixelx(this.x);
          py = this.pixely(this.y);
          this.doPixel(px, py);
        }
        if ((loopCount & 0x3f) == 0) {
          msElapsed = performance.now() - frameStartTime;
        }
        if (!init && this.showPaths) {
          // Add one iteration point per frame to the RingBuffer
          this.ringBuffer.enqueue([px, py]);
          break;
        }
      }
      // console.log(loopCount + " iters in " + msElapsed + " msec");
      // record iterations per millisecond
      // the "&" below is faster than a mod % operation
      this.framePerfs[this.frames & (2 ** logPerfArraySize - 1)] =
        loopCount / msElapsed;

      this.meanItersPerMillisonds = Math.round(
        this.framePerfs.reduce((a, b) => a + b, 0) / this.framePerfs.length
      );
      // console.log(
      //   " iterations per ms: " + Math.floor(this.meanItersPerMillisonds)
      // );
      if (init) {
        this.xrange = this.xmax - this.xmin;
        this.yrange = this.ymax - this.ymin;
      } else {
        this.ctx.putImageData(this.imageData, 0, 0);
        if (this.showPaths) {
          this.drawPaths();
        }
      }
    },
    pixelx(x) {
      let px =
        Math.floor(
          ((x - this.xmin) / this.xrange) * (this.width - 2 * this.margin)
        ) + this.margin;
      // if ((px < 0) || (px > this.width)) console.log(" bad x " + px + " " + x);
      px = px < 0 ? 0 : px;
      px = px > this.width - 1 ? this.width - 1 : px;
      return px;
    },
    pixely(y) {
      let py =
        Math.floor(
          ((y - this.ymin) / this.yrange) * (this.height - 2 * this.margin)
        ) + this.margin;
      // if ((py < 0) || (py > this.height)) console.log(" bad y " + py + " " + y);
      py = py < 0 ? 0 : py;
      py = py > this.height - 1 ? this.height - 1 : py;
      return py;
    },
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
    },
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
        document.body.style.background = "black";
      } else {
        document.body.style.background = "white";
      }
      if (this.darkmode) {
        this.invert(0xff, 0xff, 0xff);
        this.doPixel = this.incPixel;
        this.colors = this.additiveColors;
      } else {
        this.invert(0xff, 0xff, 0xff);
        this.doPixel = this.decPixel;
        this.colors = this.subtractiveColors;
      }
      this.ctx.putImageData(this.imageData, 0, 0);
    },
    toggleMenuUp() {
      this.menuUp = !this.menuUp;
      this.ctx.putImageData(this.imageData, 0, 0);
    },
    drawAttractor() {
      this.displayDelay = 0;
      this.clearScreen = false;
      this.randomize = false;
    },
    redrawAttractor() {
      this.displayDelay = 0;
      this.startNewAttractor = true;
      if (this.darkmode) {
        this.fillImage(0, 0, 0);
      } else {
        this.fillImage(255, 255, 255);
      }
      this.ctx.putImageData(this.imageData, 0, 0);
      this.randomize = false;
    },
    doAbout() {
      window.open(
        this.aboutUrl,
        "_blank" // <- This is what makes it open in a new window.
      );
    },
    parseParams(which) {
      // console.log(" param " + which + " " + this.params[which])
      let x = parseFloat(this.paramStrings[which]);
      if (!isNaN(x) && x !== this.params[which]) {
        // console.log(" new parameter " + x);
        this.params[which] = x;
        this.paramStrings[which] = this.params[which].toString();
      }
    },
    onInputChange(which) {
      console.log(" onInputChange " + which + " " + this.params[which]);
    },

    tweakParams(which, howMuch) {
      // console.log(" param " + which + " " + this.params[which])
      this.params[which] = this.params[which] * this.tweakAmounts[howMuch];
      //this.paramStrings[which] = this.params[which].toString();
      this.$set(this.paramStrings, which, this.params[which].toString());
    },
    drawPaths() {
      let p = [0, 0];
      if (this.ringBuffer.size <= 1) {
        return;
      }
      this.ctx.strokeStyle = "rgba(0,250,0,1.0)";
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      p = this.ringBuffer.peek();
      this.ctx.moveTo(p[0], p[1]);
      for (var point of this.ringBuffer) {
        this.ctx.lineTo(point[0], point[1]);
      }
      this.ctx.stroke();
    },

    drawProgressBar(progress) {
      let pButton = this.$refs["next"];
      if (pButton) {
        // the button is showing
        if (!this.advancedMode) {
          if (this.displayDelay == 0) {
            this.ctx.fillStyle = "rgba(0,225,0,0.3)";
            this.ctx.fillRect(
              this.progressBar.x,
              this.progressBar.y + 1,
              (progress * pButton.clientWidth) / 100,
              pButton.clientHeight
            );
          } else {
            this.ctx.fillStyle = "rgba(0,225,0,0.5)";
            this.ctx.fillRect(
              this.progressBar.x,
              this.progressBar.y + 1,
              pButton.clientWidth,
              pButton.clientHeight
            );
            this.ctx.fillStyle = "rgba(225,255,0,0.5)";
            this.ctx.fillRect(
              this.progressBar.x,
              this.progressBar.y + 1,
              ((this.displayDelayDefault - this.displayDelay) /
                this.displayDelayDefault) *
                pButton.clientWidth,
              pButton.clientHeight
            );
          }
        } else {
          this.ctx.strokeStyle = "rgba(0,250,0,0.3)";
          this.ctx.lineWidth = 4;

          let angleInc = this.frameAngle * (this.frames % 120);
          let startAngle = angleInc;
          for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.arc(
              this.spinner.x,
              this.spinner.y,
              this.spinner.radius,
              startAngle,
              startAngle + Math.PI / 3
            );
            this.ctx.stroke();
            startAngle = startAngle + (2.0 * Math.PI) / 3.0;
          }
        }
      }
    },
  },
  components: {
    VueSpeedometer,
  },
};
</script>
<style scoped>
button.uiButton {
  width: 100%;
  height: 44px;
  text-align: centered;
  border-radius: 4px;
  background-color: Transparent;
  background-repeat: no-repeat;
  font-size: 16px;
}

button.dark {
  color: white;
}

button.light {
  color: black;
}

button.arrow.light {
  display: block;
  color: black;
  float: left;
  width: 35px;
  height: 40px;
  margin-top: 0;
  padding-top: 2px;
  margin-bottom: 10px;
  background-color: Transparent;
  font-size: 14px;
  text-align: center;
}

button.arrow.dark {
  display: block;
  color: white;
  float: left;
  width: 35px;
  height: 40px;
  margin-top: 0;
  padding-top: 2px;
  margin-bottom: 10px;
  background-color: Transparent;
  font-size: 14px;
  text-align: center;
}

button.close {
  width: 44px;
  float: right;
  text: centered;
  height: 44px;
  border-radius: 2px;
  font-size: 16px;
  background-color: Transparent;
}

canvas {
  display: span;
}

div.checkdiv {
  height: 40px;
}

label.labellight {
  color: black;
  display: inline-block;
  width: 120px;
}

label.labeldark {
  color: white;
  display: inline-block;
  width: 120px;
}

input.numInputDark {
  height: 20px;
  width: 100%;
  padding: 0px;
  border: 0px;
  text-align: center;
  color: white;
  margin-bottom: 0;
  padding-bottom: 0px;
  background-color: Transparent;
}

input.numInputLight {
  height: 20px;
  width: 100%;
  padding: 0px;
  border: 0px;
  text-align: center;
  color: black;
  margin-bottom: 0;
  padding-bottom: 0px;
  background-color: Transparent;
}

input[type="checkbox"] {
  margin-top: 10px;
}

span.menu-wrapper {
  position: absolute;
  top: 10px;
  left: 10px;
}

.inline {
  margin-top: 10px;
  vertical-align: middle;
}
</style>
