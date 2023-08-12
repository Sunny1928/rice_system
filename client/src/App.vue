<template>
  <div id="app">
    <v-app>
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.danger-alert {
  color: red;
}

.text1{
  height: auto;
  text-align: left;
  font-size: 24px;
  padding: 5px 10px;
  color: white;
  background-color: #1976D2;
  border-radius: 10px;
}

.subTitle{
  text-align: left;
}

.red-text{
  color: #E53935;
}

.blue-text{
  color: #1976D2;
  font-weight: bold;
}

@media (min-width: 960px){
  .container {
      max-width: none !important;
  }
}
</style>