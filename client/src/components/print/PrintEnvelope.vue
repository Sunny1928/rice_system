<template>
  <div class="receipt">
    <div style="position:relative; height: 831.6px; width: 378px; background-color: antiquewhite; font-size: 20px;text-align: start;">
        <div style="position: absolute; top: 280px; right: 100px;writing-mode: vertical-rl;text-orientation: mixed;">
            <p>{{(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)}}</p>
            <p>電話：{{this.customerInfo.homePhone}}</p>
            <p>{{this.customerInfo.address}}</p>
        </div>
        <div style="position: absolute; top: 360px; right: 260px;writing-mode: vertical-rl;text-orientation: mixed; font-size: 24px;">
            <p>{{this.customerInfo.name}} 收</p>
        </div>
    </div>
    
    <v-btn class="print" @click="printFunc">列印</v-btn>
  </div>
</template>

<script>
export default {
  data: () => ({
    printSelect: 0,
    date,
    customerInfo:{},
    trades: [],
    allTrades: [],
  }),

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.customerInfo = this.$store.state.printCustomerInfo
    },
    printFunc(){
      window.print()
    }
  }
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500;900&display=swap');

* {
  font-family: 'Noto Sans TC', sans-serif;
}
.receipt *{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
.receipt{
  margin-left: 0;
  padding:0;
  margin-top: -80px;
}

@media print{
  @page{
    size: auto;
  }

  .print{
    display: none;
  }
}

.receipt:last-child{
  page-break-after: auto;
}
</style>