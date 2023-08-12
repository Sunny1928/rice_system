<template>
  <IndexHeader>
    <v-container v-if="!$store.state.isUserLoggedIn">
      You have not login in yet
    </v-container>
    
    <v-container v-else>
      <h1>{{title}} 系 統</h1>
      <br>

      <slot>
        No slot content defined.
      </slot>
      
    </v-container>
  </IndexHeader>
</template>

<script>
import IndexHeader from '@/components/IndexHeader.vue'

export default {
  props:[
    'title'
  ],
  components: {
    IndexHeader
  }
}
</script>

<style scoped>
</style>