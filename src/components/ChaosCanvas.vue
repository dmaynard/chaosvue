<template>
  <div class="chaos-canvas-wrapper">
    <canvas ref="chaos-canvas"></canvas>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // By creating the provider in the data property, it becomes reactive,
      // so child components will update when `context` changes.
      provider: {
        // This is the CanvasRenderingContext that children will draw to.
        context: null
      }
    }
  },

  // Allows any child component to `inject: ['provider']` and have access to it.
  provide () {
    return {
      provider: this.provider
    }
  },

  mounted () {
    // We can't access the rendering context until the canvas is mounted to the DOM.
    // Once we have it, provide it to all child components.
    this.provider.context = this.$refs['chaos-canvas'].getContext('2d')

    // Resize the canvas to fit its parent's width.
    // Normally you'd use a more flexible resize system.
    this.$refs['chaos-canvas'].width = this.$refs['chaos-canvas'].parentElement.clientWidth
    this.$refs['chaos-canvas'].height = this.$refs['chaos-canvas'].parentElement.clientHeight/2;
    const self = this;

      var canvasImg = new Image();

      canvasImg.onload = function() {
          self.provider.context.drawImage(canvasImg, 0, 0);
      };

      canvasImg.src = "/logo.png";
}
}
</script>
