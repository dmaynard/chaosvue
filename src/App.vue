<template>
  <div id="app">
    <h2>Chaotic Attractor</h2>
    <!-- These are the custom components we'll create -->
    <!-- Values for `my-box` are percentages of the width of the canvas. -->
    <!-- Each bar will take up an equal space of the canvas. -->
    <chaos-canvas style="width: 100%; height: 400px; background-color:powderblue;">
    </chaos-canvas>


  </div>
</template>

<script>
import ChaosCanvas from './components/ChaosCanvas.vue';

export default {
  name: 'app',
  components: {
    ChaosCanvas
  },

  data () {
    return {
      a: 0.1,
      b: 0.2,
      c: 0.3,
      d: 0.4
    }
  }

  // Randomly selects a value to randomly increment or decrement every 16 ms.
  // Not really important, just demonstrates that reactivity still works.




}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

#app {
  position: relative;
  height: 100vh;
  width: 100vw;
  padding: 20px;
  box-sizing: border-box;
}
</style>
