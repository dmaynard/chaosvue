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
      putImageData: null,
      data: null
    }
  },


  mounted() {
    // We can't access the rendering context until the canvas is mounted to the DOM.
    // Once we have it, provide it to all child components.
    this.ctx = this.$refs['chaos-canvas'].getContext('2d');
    this.putImageData = this.$refs['chaos-canvas'].getContext('2d').putImageData;
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

    canvasImg.src = "/DSMLego350.jpg";
  },
  methods: {
    timeit(context, f, ...params) {
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

    clickMethod() {
      let invertfunc = this.invert;
      this.timeit(this, this.invert, Math.random()*255, 0xFF, 0xFF);

       let func = this.ctx.putImageData;
      // this.ctx.putImageData(this.imageData, 0, 0);
       this.timeit(this.ctx, func, this.imageData, 0, 0);

    }

  },
}
</script>
