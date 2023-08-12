<template>
  <titlepanel title="進 貨 ">
    <v-layout class="ml-4 mr-4">
      <v-flex xs12 offset-xs0>
        <v-row>
          <v-col
            cols="12"
            md="4">
            <v-btn
              color="primary"
              class="d-flex align-center"
              dark
              height="200"
              :to="{
                name: 'inwardsCustomer'
              }">
              <h3>顧客</h3>
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            md="4">
            <v-btn
              color="primary"
              class="d-flex align-center"
              dark
              height="200"
              :to="{
                name: 'inwardsRicekind'
              }">
              <h3>米的種類</h3>
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            md="4">
            <v-btn
              color="primary"
              class="d-flex align-center"
              dark
              height="200"
              :to="{
                name: 'inwardsProduct'
              }">
              <h3>產品</h3>
            </v-btn>
          </v-col>
        </v-row>
        <br>
        <v-row>
          <v-col
            cols="12"
            md="12">
            <v-btn
              color="primary"
              class="d-flex align-center"
              dark
              height="200"
              :to="{
                name: 'inwardsTrade',
                params:{
                  customerName:'null'
                }
              }">
              <h3>交易</h3>
            </v-btn>
          </v-col>
        </v-row>
      </v-flex>
    </v-layout>
  </titlepanel>
</template>

<script>
import Titlepanel from '../TitlePanel.vue'

export default {
  components: { Titlepanel },
  data() {
    return{
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    }
  }
    
}
</script>

<style scoped>
.col-12{
  padding: 12px 6px;
}
</style>