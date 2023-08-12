<template>
  <titlepanel title="進 貨 ">
    <div class="white">
      <div class="subTitle">
          <b>篩選條件</b>
      </div>
      <v-row>
        <v-col
          cols="12"
          md="4"
          class="d-flex">
          <v-autocomplete
          hide-details
            v-model="searchCustomer"
            :items="customerNames"
            label="顧客選項"
            dense
            outlined
            flat
            solo
            />
          <v-btn
            class="ml-1"
            depressed
            :disabled = "searchCustomer == 'null'"
            :to="{
              name: 'inwardsTrade',
              params: {
                customerName: searchCustomer
              }
            }"
            @click="$router.go()">
            搜尋
          </v-btn>
        </v-col>
      
        <v-col
          cols="12"
          md="6"
          class="d-flex flex-row">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="dates"
            transition="scale-transition"
            offset-y
            min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateText"
                label="篩選日期"
                prepend-icon="mdi-calendar"
                readonly
                dense
                outlined
                flat
                solo
                v-bind="attrs"
                v-on="on">
              </v-text-field>
            </template>
            <v-date-picker
              v-model="dates"
              no-title
              range>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="menu = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(dates); filterTrades();">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <div class="ml-1">
            <v-btn @click="changeDate('today')">今日</v-btn>
            <v-btn @click="changeDate('week')">前七日</v-btn>
            <v-btn @click="changeDate('month')">前一個月</v-btn>
            <v-btn @click="changeDate('year')">前一年</v-btn>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="2">
          <v-sheet
            class="mx-auto transition-swing rounded-lg py-1"
            elevation="3"
            width="100%"
          >
            <h4>客戶往來最後交易金額</h4>
            <h4
              v-if="lastOtherTrade.grandPrice<0" 
              class="blue-text">
              {{ lastOtherTradeGrandPrice }}
            </h4>
            <h4
              v-else 
              class="red-text">
              {{ lastOtherTradeGrandPrice }}
            </h4>
          </v-sheet>

          
        </v-col>
      </v-row>
    </div>
    <div v-if="customerName=='null'">
      請選擇上面的顧客選項
    </div>
    <div v-else>
      <Trade 
        ref="riceTrade"
        :dates="dates" />
      <OtherTrade 
        ref="otherTrade"
        :dates="dates" />
    </div>
  </titlepanel>
</template>

<script>
import Titlepanel from '../TitlePanel.vue'
import CustomerService from '@/services/inwards/CustomerService'
import Trade from './Trade.vue'
import OtherTrade from './OtherTrade.vue'
import OtherTradeService from '@/services/inwards/OtherTradeService'


export default {
  components: { Titlepanel, Trade, OtherTrade },
  data: () => ({
    today: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    dateText: '',
    dates: [],
    menu: false,

    searchCustomer:'null',
    customerNames: [],
    customerName: '',
    customerInfo:{},
    lastOtherTrade:{},

  }),

  mounted () {
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增糧食進出交易' : '編輯糧食進出交易'
    },
    lastOtherTradeGrandPrice () {
      if (this.lastOtherTrade.grandPrice==undefined){
        return 0
      }else{
        return (""+this.lastOtherTrade.grandPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    },
    
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    dialogCashTime (val){
      val || this.closeCashTime()
    }
  },

  created () {
    this.$loading(true)
    this.initialize()
    this.$loading(false)
  },

  methods: {
    
    printEnvelope(){
      let routeData = this.$router.resolve({name: 'printEnvelope'});
      this.$store.dispatch('setPrintCustomer', this.customerInfo)
      window.open(routeData.href, '_blank')

    },
    printReceipt(){
      let routeData = this.$router.resolve({name: 'printInwardsTrade', query: {date: this.dates[0]}});
      this.$store.dispatch('setPrintData', this.trades)
      this.$store.dispatch('setPrintCustomer', this.customerInfo)
      window.open(routeData.href, '_blank')

    },

    checkInp(x){
      if (isNaN(x)){
        this.error="請輸入正確格式";
        return true;
      }
      return false;
    },


    dateRangeText () {
      if(this.dates[1] == undefined){
        this.dates[1] = this.dates[0]
      }
      if(new Date(this.dates[0])> new Date(this.dates[1])){
        var tempDate = this.dates[1]
        this.dates[1] = this.dates[0]
        this.dates[0] = tempDate
      }
      this.dateText = this.dates[0] + '~' + this.dates[1]
    },

    changeDate (x){
      var date
      if(x=='today'){
        this.dates[0] = this.today
        this.dates[1] = this.today
      }else if(x=='week'){
        date = new Date(this.dates[0])
        date.setDate(date.getDate() - 7);
        this.dates[0] = date.toISOString().substr(0, 10)
      }else if(x=='month'){
        date = new Date(this.dates[0])
        date.setDate(date.getDate() - 30);
        this.dates[0] = date.toISOString().substr(0, 10)
      }else if(x=='year'){
        date = new Date(this.dates[0])
        date.setFullYear(date.getFullYear()-1);
        this.dates[0] = date.toISOString().substr(0, 10)
      }
      this.dateRangeText()
      this.$refs.riceTrade.filterTrades()
      this.$refs.otherTrade.filterTrades()
    },

    filterTrades (){
      this.dateRangeText()
      this.$refs.riceTrade.filterTrades()
      this.$refs.otherTrade.filterTrades()
    },

    async search(){
      // all customer names
      try{
        var customerData = (await CustomerService.index()).data
        this.customerNames = customerData.map(value => value.name)

        // get this customer
        this.customerName = this.$store.state.route.params.customerName
        if(this.customerName == 'null') {
          return
        }

        // customer info
        customerData.forEach(item=>{
          if(item.name == this.customerName) this.customerInfo = item
        })

        // console.log(this.dates)
        this.$refs.riceTrade.dates = this.dates
        this.$refs.riceTrade.customerName = this.customerName
        this.$refs.riceTrade.customerNames = this.customerNames
        this.$refs.riceTrade.customerInfo = this.customerInfo
        this.$refs.riceTrade.initialize()

        this.$refs.otherTrade.dates = this.dates
        this.$refs.otherTrade.customerName = this.customerName
        this.$refs.otherTrade.customerNames = this.customerNames
        this.$refs.otherTrade.customerInfo = this.customerInfo
        this.$refs.otherTrade.initialize()

        // get last trade
        this.lastOtherTrade = (await OtherTradeService.getLastTrade(this.customerName)).data

      }catch(err){
        console.log(err)
      }
      

    },

    initialize () {
      // get dates range
      // var date = new Date(this.today)
      // date.setDate(date.getDate() - 30);
      // this.dates[0] = date.toISOString().substr(0, 10)
      // this.dates[1] = this.today
      // this.dateRangeText()

      this.search()

      
    },

  }
}
</script>

