<template>
  <div class="white elevation-2">
    <v-app-bar flat dense color="primary" dark>
      <v-app-bar-title>{{title}}</v-app-bar-title>
    </v-app-bar>

    <slot>
      No slot content defined.
    </slot>
    
  </div>
</template>

<script>
  export default {
    props:[
      'title'
    ]
  }
</script>
