<template>
<div class="chaos-canvas-wrapper" >
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
      context: null,
      image: null,
      imageData: null,
      data: null
    }
  },


  mounted() {
    // We can't access the rendering context until the canvas is mounted to the DOM.
    // Once we have it, provide it to all child components.
    this.context = this.$refs['chaos-canvas'].getContext('2d')

    // Resize the canvas to fit its parent's width.
    // Normally you'd use a more flexible resize system.
    this.$refs['chaos-canvas'].width = this.$refs['chaos-canvas'].parentElement.clientWidth
    this.$refs['chaos-canvas'].height = this.$refs['chaos-canvas'].parentElement.clientHeight / 2;
    const self = this;
    var canvasImg = new Image();
    canvasImg.onload = function() {
      self.image = this;
      self.context.drawImage(canvasImg, 0, 0);
      self.imageData = self.context.getImageData(0, 0, this.width, this.height);
      self.data = self.imageData.data;
    };

    canvasImg.src = "/logo.png";
  },
  methods: {
  invert() {
  for (var i = 0; i < this.data.length; i += 4) {
    this.data[i]     ^= 0xFF; // red
    this.data[i + 1] ^= 0xFF; // green
    this.data[i + 2] ^= 0xFF; // blue
  }

  },

    clickMethod() {
      window.console.log("click");
      this.invert();
      this.context.putImageData(this.imageData, 0, 0);
    }

  },
}
</script>
