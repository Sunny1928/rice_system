<template>
  <titlepanel title="出 貨 ">
    <v-layout>
      <v-flex xs12 offset-xs0>
        <v-row>
          <v-col
            cols="12"
            md="3">
            <v-btn
              color="primary"
              class="d-flex align-center"
              dark
              height="200"
              :to="{
                name: 'customer'
              }">
              <h3>顧客</h3>
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            md="3">
            <v-btn
              color="primary"
              class="d-flex align-center"
              dark
              height="200"
              :to="{
                name: 'product'
              }">
              <h3>產品</h3>
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            md="2">
            <v-btn
              color="primary"
              class="d-flex align-center"
              dark
              height="200"
              :to="{
                name: 'sellUint'
              }">
              <h3>販賣單位</h3>
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            md="2">
            <v-btn
              color="primary"
              class="d-flex align-center"
              dark
              height="200"
              :to="{
                name: 'cashMethod'
              }">
              <h3>入帳方式</h3>
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            md="2">
            <v-btn
              color="primary"
              class="d-flex align-center"
              dark
              height="200"
              :to="{
                name: 'transport'
              }">
              <h3>貨運</h3>
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
                name: 'trade',
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
  }
}
</script>

<style scoped>
.col-12{
  padding: 12px 6px;
}



</style>