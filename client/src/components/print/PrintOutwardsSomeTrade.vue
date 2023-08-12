<template>
  <div class="receipt">
    <div  style="position:relative;width: 812px;background-color: antiquewhite; padding: 5px; overflow: hidden;">
      <div style="text-align: center;">
        <h3>出  貨  單</h3>
        <p>年昌碾米工廠 地址: 玉里中華路28號</p>
        <p>電話: 03-8883066 03-8882066 傳真: 03-8881066</p>
      </div>
      <div style="display:flex;">
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
      <div style="margin-top: 5px;width:100%;">
        <div style="display: flex; border-top: 2px solid #000; border-bottom: 2px solid #000; ">
          <p style="width:3%; text-align:center;margin:1px 3px;">NO</p>
          <p style="width:18%;text-align:start;margin:1px 3px;">品名</p>
          <p style="width:8%;text-align:end;margin:1px 3px;">數量</p>
          <p style="width:8%;text-align:end;margin:1px 3px;">包數</p>
          <p style="width:10%;text-align:end;margin:1px 3px;">總數量</p>
          <p style="width:5%; text-align:end;margin:1px 3px;">單位</p>
          <p style="width:8%;text-align:end;margin:1px 3px;">單價</p>
          <p style="width:12%;text-align:end;margin:1px 3px;">小計</p>
          <p style="width:11%;text-align:center;margin:1px 3px;">貨運</p>
          <p style="width:15%;text-align:start;margin:1px 3px;">備註</p>
        </div>
          
        <div style="min-height:240px;">
          <div style="display: flex;" v-for="(item, index) in trades">
            <p style="width:3%;  text-align: center;margin:1px 3px;">{{index+1}}</p>
            <p style="width:18%; text-align: start;margin:1px 3px;">{{item.name}}</p>
            <p style="width:8%; text-align: end;margin:1px 3px;">{{item.amount}}</p>
            <p style="width:8%; text-align: end;margin:1px 3px;">{{item.package}}</p>
            <p style="width:10%; text-align: end;margin:1px 3px;">{{item.totalNumber}}</p>
            <p style="width:5%;  text-align: end;margin:1px 3px;">{{item.sellUint}}</p>
            <p style="width:8%; text-align: end;margin:1px 3px;">{{item.uintPrice}}</p>
            <p style="width:12%; text-align: end;margin:1px 3px;">{{item.aTradePrice}}</p>
            <p style="width:11%; text-align: center;margin:1px 3px;">{{item.transport}}</p>
            <p style="width:15%; text-align: start;margin:1px 3px;">{{item.comment}}</p>
          </div>
        </div>

        <div style="width: 99%; display: flex; border-top: 2px solid #000; border-bottom: 2px solid #000; margin-top: 20px;padding-left: 10px;">
          <p style="width:25%;text-align:start;">本次銷售：{{(""+this.sum).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}元</p>
          <p style="width:25%;text-align:start;">前次累積：{{(""+this.formerSum).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}元</p>
          <p style="width:25%;text-align:start;">貸款總計：{{(""+(parseInt(this.sum)+parseInt(this.formerSum))).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}}元</p>
          <p style="width:25%;text-align:start;">總重量：{{this.weight}}公斤</p>
        </div>
      </div>
    </div>

    <v-btn class="print" @click="printFunc">列印</v-btn>
  </div>
</template>



<script>
export default {
  data: () => ({
    formerSum: 0,
    sum: 0,
    weight: 0,
    customerInfo:{},
    trades: [],
    allTrades: [],
  }),

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.formerSum = this.$route.query.formerSum
      this.sum = this.$route.query.sum
      this.weight = this.$route.query.weight
      this.trades = this.$store.state.printDataArr
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