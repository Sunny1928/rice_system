<template>
  <div class="receipt">
    <div style="position:relative;width: 812px;background-color: antiquewhite; overflow: hidden;">
      <div style="text-align: center;">
          <h3>糧食進出登記簿</h3>
          <p>年昌碾米工廠 地址: 玉里中華路28號</p>
          <p>電話: 03-8883066 03-8882066 傳真: 03-8881066</p>
      </div>
      <div
        v-if="this.$route.query.all == 'false'"
        style="display:flex;">
        <div style="width: 70%;text-align: left;">
            <p>廠商編號： {{customerInfo.taxId}}</p>
            <p>廠商姓名： {{customerInfo.name}}</p>
            <p>廠商地址： {{customerInfo.address}}</p>
        </div>
        <div style="width: 30%;text-align: left;">
            <p>廠商電話： {{customerInfo.homePhone}}</p>
            <p>製表日期： {{(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)}}</p>
        </div>
      </div>
      <div 
        v-if="this.$route.query.all == 'false'"
        style="margin-top: 5px;width:100%;">
        <div style="display: flex; border-top: 2px solid #000; border-bottom: 2px solid #000; ">
            <p style="width:13%; text-align:center;margin:1px 3px;">日期</p>
            <p style="width:9%;text-align:start;margin:1px 3px;">品名</p>
            <p style="width:9%;text-align:end;margin:1px 3px;">轉進</p>
            <p style="width:10%;text-align:end;margin:1px 3px;">轉出</p>
            <p style="width:10%;text-align:end;margin:1px 3px;">小計</p>
            <p style="width:20%;text-align:start;margin:1px 3px;">稻穀紀錄</p>
            <p style="width:24%;text-align:start;margin:1px 3px;">備註</p>
        </div>
        
        <div style="min-height:240px;">
          <div style="display: flex;" v-for="(item, index) in trades">
              <p style="width:13%;  text-align: center;margin:1px 3px;">{{item.made_date.slice(0,10)}}</p>
              <p style="width:15%; text-align: start;margin:1px 3px;">{{item.name}}</p>
              <p style="width:9%; text-align: end;margin:1px 3px;">{{numWithComma(item.in)}}</p>
              <p style="width:9%; text-align: end;margin:1px 3px;">{{numWithComma(item.out)}}</p>
              <p style="width:10%; text-align: end;margin:1px 3px;">{{numWithComma(item.stock)}}</p>
              <p style="width:20%; text-align: start;margin:1px 3px;">{{item.go}}</p>
              <p style="width:24%; text-align: start;margin:1px 3px;">{{item.comment}}</p>
          </div>
        </div>
      </div>
      <div 
        v-else
        style="margin-top: 5px;width:100%;">
        <div style="display: flex; border-top: 2px solid #000; border-bottom: 2px solid #000; ">
          <p style="width:16%; text-align:center; margin:1px 3px;">顧客</p>
          <p style="width:9%; text-align:center;margin:1px 3px;">日期</p>
          <p style="width:12%;text-align:start;margin:1px 3px;">品名</p>
          <p style="width:7%;text-align:end;margin:1px 3px;">轉進</p>
          <p style="width:7%;text-align:end;margin:1px 3px;">轉出</p>
          <p style="width:9%;text-align:end;margin:1px 3px;">小計</p>
          <p style="width:19%;text-align:start;margin:1px 3px;">稻穀紀錄</p>
          <p style="width:21%;text-align:start;margin:1px 3px;">備註</p>
        </div>
        
        <div style="min-height:240px;">
          <div v-for="(item, index) in trades">
            <div v-if="diffIndex.includes(index)" style="border-top: 2px solid #000; border-bottom: 2px solid #000;" class="my-1">
            </div>
            <div style="display: flex;">
              <p style="width:16%; text-align: start; margin:1px 3px;">{{item.customer_name}}</p>
              <p style="width:9%;  text-align: center;margin:1px 3px;">{{item.made_date.slice(0,10)}}</p>
              <p style="width:12%; text-align: start;margin:1px 3px;">{{item.name}}</p>
              <p style="width:7%; text-align: end;margin:1px 3px;">{{numWithComma(item.in)}}</p>
              <p style="width:7%; text-align: end;margin:1px 3px;">{{numWithComma(item.out)}}</p>
              <p style="width:9%; text-align: end;margin:1px 3px;">{{numWithComma(item.stock)}}</p>
              <p style="width:18%; text-align: start;margin:1px 3px;">{{item.go}}</p>
              <p style="width:21%; text-align: start;margin:1px 3px;">{{item.comment}}</p>
            </div>
          </div>
          <div style="border-top: 2px solid #000; border-bottom: 2px solid #000;" class="mt-2">
            </div>
        </div>
      </div>
    </div>
    <v-btn class="print" @click="printFunc">列印</v-btn>
  </div>
</template>



<script>
export default {
  data: () => ({
    customerInfo:{},
    trades: [],
    diffIndex:[]
  }),

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.trades = this.$store.state.printDataArr
      this.customerInfo = this.$store.state.printCustomerInfo

      var formerItem = this.trades[0].customer_name
      this.trades.forEach(item=>{
        if(formerItem != item.customer_name) this.diffIndex.push(this.trades.indexOf(item));
        formerItem = item.customer_name
      })
    },
    printFunc(){
      window.print()
    },
    numWithComma(x){
      return (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  }
}
</script>

<style scoped>
@import url('https://.googleapis.com/css2?family=Noto+Sans+TC:wght@500;900&display=swap');

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
}

p{
  font-size: 12px;
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