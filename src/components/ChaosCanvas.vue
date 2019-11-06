<template>
<div class="chaos-canvas-wrapper">
  <canvas ref="chaos-canvas" @click="clickMethod"></canvas>
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
      data: null
    }
  },


  mounted() {
    // We can't access the rendering context until the canvas is mounted to the DOM.
    // Once we have it, provide it to all child components.
    this.ctx = this.$refs['chaos-canvas'].getContext('2d')

    // Resize the canvas to fit its parent's width.
    // Normally you'd use a more flexible resize system.
    // this.$refs['chaos-canvas'].width = this.$refs['chaos-canvas'].parentElement.clientWidth
    // this.$refs['chaos-canvas'].height = this.$refs['chaos-canvas'].parentElement.clientHeight / 2;
    const self = this;
    var canvasImg = new Image();
    canvasImg.onload = function() {
      self.image = this;
      self.$refs['chaos-canvas'].width = this.width;
      self.$refs['chaos-canvas'].height = this.height;
      self.ctx.drawImage(canvasImg, 0, 0);
      self.imageData = self.ctx.getImageData(0, 0, this.width, this.height);
      self.data = self.imageData.data;
    };

    canvasImg.src = "/logo.png";
  },
  methods: {
    timeit(f, ...params) {
      let elapsed = -new Date().getTime();
      let args = [...params]
      window.console.log(args.length + " args");
      switch (args.length) {
        case 0:
          {
            f();
            break;
          }
        case 1:
          {
            f(args[0]);
            break;
          }
        case 2:
          {
            f(args[0], args[1]);
            break;
          }
        case 3:
          {
            f(args[0], args[1], args[2]);
            break;
          }
        case 4:
          {
            f(args[0], args[1], args[2], args[3]);
            break;
          }
        case 5:
          {
            f(args[0], args[1], args[2], args[3], args[4]);
            break;
          }
        default:
          {
            throw new Error(" too many arguments for timeit")
          }

      }
      elapsed += new Date().getTime();
      window.console.log(f.name + " : " + elapsed + " ms");
      return elapsed;
    },
    invert(r, g, b=0xFF) {
      for (var i = 0; i < this.data.length; i += 4) {
        this.data[i] ^= r; // red
        this.data[i + 1] ^= g; // green
        this.data[i + 2] ^= b; // blue
      }

    },

    clickMethod() {
      this.timeit(this.invert, 0xFF, 0xFF, 0xFF);

      let elapsed = -new Date().getTime();
      // let func = this.ctx.putImageData;
      this.ctx.putImageData(this.imageData, 0, 0);
      // func(this.imageData, 0, 0).bind(this.ctx);
      elapsed += new Date().getTime();
      window.console.log("putImageData: " + elapsed + " ms")
      // this.timeit(this.ctx.putImageData, this.imageData, 0, 0);
    }

  },
}
</script>
