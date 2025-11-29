<template>
  <div class="home">
    <h1>Hello World!</h1>
    <button type="button" class="btn btn-primary">Primary</button>
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'


export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    
  }
}
</script>
