<template>
  <div class="receipt">
    <div style="position:relative;width: 812px;background-color: antiquewhite; overflow: hidden;">
      <div style="text-align: center;">
        <h3>交 易 紀 錄</h3>
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
            <p>列印日期： {{(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)}}</p>
        </div>
      </div>
      <div 
        v-if="this.$route.query.all == 'false'"
        style="margin-top: 5px;width:100%;">
        <div style="display: flex; border-top: 2px solid #000; border-bottom: 2px solid #000; ">
            <p style="width:10%; text-align:center; margin:1px 3px;">日期</p>
            <p style="width:17%;text-align:start; margin:1px 3px;">品名</p>
            <p style="width:10%;text-align:end; margin:1px 3px;">數量</p>
            <p style="width:5%; text-align:end; margin:1px 3px;">單位</p>
            <p style="width:5%;text-align:end; margin:1px 3px;">單價</p>
            <p style="width:11%;text-align:end; margin:1px 3px;">小計</p>
            <p style="width:11%;text-align:end; margin:1px 3px;">累計</p>
            <p style="width:11%;text-align:start;margin:1px 3px;">貨運</p>
            <p style="width:20%;text-align:start; margin:1px 3px;">備註</p>
        </div>
          
        <div style="min-height:240px;">
          <div style="display: flex;" v-for="(item, index) in trades">
            <p style="width:10%; text-align: center; margin:1px 3px;">{{item.made_date.slice(0,10)}}</p>
            <p style="width:17%; text-align: start; margin:1px 3px;">{{item.name}}</p>
            <p style="width:10%; text-align: end; margin:1px 3px;">{{numWithComma(item.totalNumber)}}</p>
            <p style="width:5%; text-align:end; margin:1px 3px;">{{item.sellUint}}</p>
            <p style="width:5%; text-align: end; margin:1px 3px;">{{numWithComma(item.uintPrice)}}</p>
            <p style="width:11%; text-align: end; margin:1px 3px;">{{numWithComma(item.aTradePrice)}}</p>
            <p style="width:11%; text-align: end; margin:1px 3px;">{{numWithComma(item.grandPrice)}}</p>
            <p style="width:11%; text-align: start; margin:1px 3px;">{{item.transport}}</p>
            <p style="width:20%; text-align: start; margin:1px 3px;">{{item.comment}}</p>
          </div>
        </div>

        <div style="width: 99%; display: flex; border-top: 2px solid #000; border-bottom: 2px solid #000; margin-top: 20px;padding-left: 10px;">
          <p style="width:25%;text-align:start;">本次銷售：{{(""+this.$route.query.sum).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}元</p>
          <p style="width:25%;text-align:start;">前次累積：{{(""+this.$route.query.formerSum).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}元</p>
          <p style="width:25%;text-align:start;">貸款總計：{{(""+(parseInt(this.$route.query.sum)+parseInt(this.$route.query.formerSum))).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}元</p>
        </div>
      </div>
      <div 
        v-else
        style="margin-top: 5px;width:100%;">
        <div style="display: flex; border-top: 2px solid #000; border-bottom: 2px solid #000; ">
            <p style="width:14%; text-align:center; margin:1px 3px;">顧客</p>
            <p style="width:9%; text-align:center; margin:1px 3px;">日期</p>
            <p style="width:18%;text-align:start; margin:1px 3px;">品名</p>
            <p style="width:6%;text-align:end; margin:1px 3px;">數量</p>
            <p style="width:4%; text-align:end; margin:1px 3px;">單位</p>
            <p style="width:5%;text-align:end; margin:1px 3px;">單價</p>
            <p style="width:9%;text-align:end; margin:1px 3px;">小計</p>
            <p style="width:9%;text-align:end; margin:1px 3px;">累計</p>
            <p style="width:7%;text-align:start; margin:1px 3px;">運輸</p>
            <p style="width:18%;text-align:start; margin:1px 3px;">備註</p>
        </div>
          
        <div style="min-height:240px;">
          <div v-for="(item, index) in trades">
            <div v-if="diffIndex.includes(index)" style="border-top: 2px solid #000; border-bottom: 2px solid #000;" class="my-1">
            </div>
            <div style="display: flex;">
              <p style="width:14%; text-align: start; margin:1px 3px;">{{item.customer_name}}</p>
              <p style="width:9%; text-align: start; margin:1px 3px;">{{item.made_date.slice(0,10)}}</p>
              <p style="width:18%; text-align: start; margin:1px 3px;">{{item.name}}</p>
              <p style="width:6%; text-align: end; margin:1px 3px;">{{numWithComma(item.totalNumber)}}</p>
              <p style="width:4%; text-align:end; margin:1px 3px;">{{item.sellUint}}</p>
              <p style="width:5%; text-align: end; margin:1px 3px;">{{numWithComma(item.uintPrice)}}</p>
              <p style="width:9%; text-align: end; margin:1px 3px;">{{numWithComma(item.aTradePrice)}}</p>
              <p style="width:9%; text-align: end; margin:1px 3px;">{{numWithComma(item.grandPrice)}}</p>
              <p style="width:7%; text-align: start; margin:1px 3px;">{{item.transport}}</p>
              <p style="width:18%; text-align: start; margin:1px 3px;">{{item.comment}}</p>
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
      return x? (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ","): 0
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

p{
  font-size: 12px;
}


</style>