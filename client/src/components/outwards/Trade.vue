<template>
  <titlepanel title="出 貨 ">
    <div class="white">
      <div class="subTitle">
        <b>篩選條件</b>
      </div>
      <v-row>
        <v-col
          cols="12"
          md="3">
          <v-autocomplete
            v-model="searchCustomer"
            :items="customerNames"
            label="顧客選項"
            dense
            outlined
            solo/>
        </v-col>

        <v-col
          cols="12"
          md="1"
          class="pt-3">
          <v-btn
            class="d-flex"
            depressed
            :disabled = "searchCustomer == 'null'"
            :to="{
              name: 'trade',
              params: {
                customerName: searchCustomer
              }
            }"
            @click="this.initialize">
            搜尋
          </v-btn>
        </v-col>
      
        <v-col
          cols="12"
          md="3">
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
        </v-col>

        <v-col
          cols="12"
          md="4"
          class="d-flex flex-row">
          <v-btn @click="changeDate('today')">今日</v-btn>
          <v-btn @click="changeDate('week')">前七日</v-btn>
          <v-btn @click="changeDate('month')">前一個月</v-btn>
          <v-btn @click="changeDate('year')">前一年</v-btn>
        </v-col>
      </v-row>
    </div> 
    <div v-if="customerName=='null'">
      請選擇上面的顧客選項
    </div>
    <v-data-table
      :headers="headers"
      :items="trades"
      :items-per-page="10"
      class="elevation-1"
      v-else>

      <template v-slot:footer>
        <v-toolbar flat>
          <div>
            <v-toolbar-title>{{customerName}} 交易資料</v-toolbar-title>
            <p>{{customerInfo.homePhone}} | {{customerInfo.phone}}</p>
          </div>
          <v-divider
            class="mx-4"
            inset
            vertical></v-divider>
          <v-spacer></v-spacer>

          <v-dialog
            
            v-model="dialog"
            max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <download-excel
                class="btn"
                :header="`交 易 紀 錄\n年昌碾米工廠 地址: 玉里中華路28號\n電話: 03-8883066 03-8882066 傳真: 03-8881066\n 廠商編號：${customerInfo.taxId} 廠商姓名： ${customerInfo.name}\n 廠商地址： ${customerInfo.address}\n 廠商手機： ${customerInfo.homePhone} 廠商手機： ${customerInfo.phone}`"
                :data="trades"
                :fields="json_fields"
                worksheet="出貨統計"
                :name="customerName+'出貨交易.xls'">
                下載Excel
              </download-excel>

              <v-btn
                class="mb-2 mr-2"
                @click="printEnvelope">
                列印信封
              </v-btn>

              <v-btn
                class="mb-2 mr-2"
                @click="printAllReceipt">
                列印交易紀錄
              </v-btn>

              <v-btn
                class="mb-2 mr-2"
                @click="printSomeReceipt">
                列印出貨單
              </v-btn>

              <v-btn
                color="primary"
                class="mb-2 mr-2"
                v-bind="attrs"
                v-on="on">
                新增交易
              </v-btn>

            </template>

            <v-card class="change-position">
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
                <v-spacer></v-spacer>
                <v-switch
                  @change="editedItem = Object.assign({}, defaultItem)"
                  v-if="editedIndex==-1"
                  v-model="switch1"
                  inset
                  :label="`${(switch1 === true) ? '付款模式' :'訂單模式'}`"
                ></v-switch>
              </v-card-title>

              <v-card-text>
                <v-container v-if="!switch1">
                  <v-row>
                    <v-text-field
                      v-if="editedIndex!=-1"
                      v-model="formMadeDate"
                      label="交易日期（無法修改）"
                      readonly>
                    </v-text-field>
                    <v-menu
                      v-else
                      ref="menu_made_date"
                      v-model="menu_made_date"
                      :close-on-content-click="false"
                      :return-value.sync="editedItem.made_date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.made_date"
                          label="交易日期"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on">
                        </v-text-field>
                      </template>
                      <v-date-picker
                        :max="today"
                        v-model="editedItem.made_date"
                        no-title
                        scrollable>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="menu_made_date = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu_made_date.save(editedItem.made_date)">
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-row>
                  <v-row>
                    <v-col
                      class="pa-0">
                      <v-autocomplete
                        v-model="editedItem.name"
                        :items="productNames"
                        label="商品選項"
                        :rules="[required]"
                        @input="chooseProduct"/>
                    </v-col>
                    <v-col
                      class="ml-2 pa-0">
                      <v-text-field
                        v-model="editedItem.uintPrice"
                        label="單價"
                        :rules="[required]">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.amount"
                      label="數量"
                      :rules="[required]">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.package"
                      label="包數"
                      :rules="[required]">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-autocomplete
                        v-model="editedItem.transport"
                        :items="transportNames"
                        label="貨運"/>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.comment"
                      label="備註">
                    </v-text-field>
                  </v-row>
                </v-container>

                <v-container v-else>
                  <v-row>
                    <v-text-field
                      v-if="editedIndex!=-1"
                      v-model="formMadeDate"
                      label="交易日期（無法修改）"
                      readonly>
                    </v-text-field>
                    <v-menu
                      v-else
                      ref="menu_made_date"
                      v-model="menu_made_date"
                      :close-on-content-click="false"
                      :return-value.sync="editedItem.made_date"
                      transition="scale-transition"
                      offset-y
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.made_date"
                          label="交易日期"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on">
                        </v-text-field>
                      </template>
                      <v-date-picker
                        :max="today"
                        v-model="editedItem.made_date"
                        no-title
                        scrollable>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="menu_made_date = false">
                          Cancel
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.menu_made_date.save(editedItem.made_date)">
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-row>
                  <v-row>
                    <v-autocomplete
                      v-model="editedItem.name"
                      :items="cashMethod"
                      label="入帳選項"
                      :rules="[required]"/>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.aTradePrice"
                      label="現金收款"
                      :rules="[required]">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.comment"
                      label="備註">
                    </v-text-field>
                  </v-row>
                </v-container>

                <v-container v-if="error" class="danger-alert">
                  {{error}}
                </v-container>
              </v-card-text>
              
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close">
                  取消
                </v-btn>
                <v-btn
                  v-if="switch1"
                  color="blue darken-1"
                  text
                  @click="save"
                  :disabled="editedItem.name==''||editedItem.aTradePrice==''||editedItem.made_date==''">
                  儲存
                </v-btn>
                <v-btn
                  v-else
                  color="blue darken-1"
                  text
                  @click="save"
                  :disabled="(editedItem.name==''|| editedItem.uintPrice=='' ||editedItem.amount==''||editedItem.package==''||editedItem.made_date=='' || editedItem.uintPrice=='')">
                  儲存
                </v-btn>
              </v-card-actions>

            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">你確定要刪掉這個交易嗎？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">確認</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- <v-dialog v-model="dialogCashTime" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">付款時間為 {{currentTime.toLocaleString()}}</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeCashTime">取消</v-btn>
                <v-btn color="blue darken-1" text @click="CashTimeItemConfirm">確認</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog> -->

        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          small
          class="mr-2"
          @click="deleteItem(item)">
          mdi-delete
        </v-icon>
        <!-- <v-icon
          v-if="item.pay==true"
          dense
          @click="addCashDate(item)">
          mdi-check-circle
        </v-icon> -->
      </template>

      <template v-slot:no-data>
        <p class="ma-3">你還沒新增資料</p>
        <p class="ma-3">如果你新增了，可以按下面的按鈕重整</p>
        <v-btn
          class="mb-3"
          color="primary"
          @click="initialize">
          重整
        </v-btn>
      </template>

      <template
        v-for="header in headers.filter((header) => header.hasOwnProperty('formatter'))"
        v-slot:[`item.${header.value}`]="{ header, value }">
        <div
          v-if="header.value == 'grandPrice' && value>0" 
          class="blue-text">
          {{ header.formatter(value) }}
        </div>
        <div 
          v-else-if="header.value == 'grandPrice' && value<0"
          class="red-text">
            {{ header.formatter(value) }}
        </div>
        <div 
          v-else-if="header.value == 'grandPrice' && value==0"
          class="zero">
            {{ header.formatter(value) }}
        </div>
        <div 
          v-else>
          {{ header.formatter(value) }}
        </div>
      </template>
    </v-data-table>
  </titlepanel>
</template>



<script>
import Titlepanel from '../TitlePanel.vue'
import ProductService from '@/services/outwards/ProductService'
import TradeService from '@/services/outwards/TradeService'
import CashMethodService from '@/services/outwards/CashMethodService'
import TransportService from '@/services/outwards/TransportService'
import CustomerService from '@/services/outwards/CustomerService'


export default {
  components: { Titlepanel },
  data: () => ({
    error:'',
    json_fields: {
      日期: {
        callback: (value) => {
          return value.made_date.slice(0,10);
        }
      },
      品名: "name",
      數量: "amount",
      包數: "package",
      總數量: "totalNumber",
      單位: "sellUint",
      單價: 'uintPrice',
      小計: "aTradePrice",
      累計: "grandPrice",
      貨運: "transport",
      備註: "comment"
    },
    json_meta: [
      [
        {
          key: "charset",
          value: "utf-8",
        },
      ],
    ],
    formerSum: 0,
    sum: 0,
    weight: 0,
    today: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    dateText: '',
    dates: [],
    menu: false,
    menu_made_date: false,

    searchCustomer:'null',
    switch1: false,
    cashMethod: [],
    productNames: [],
    transportNames: [],
    customerNames: [],
    customerName: '',
    customerInfo:{},
    required: (value) => (value+"").length !== 0 || 'Required.',
    dialog: false,
    dialogDelete: false,
    dialogCashTime: false,
    headers: [
      { text: '日期', value: 'made_date', sortable: false, width: '105px',
        formatter: (x) => x.slice(0,10)},
      {text: '產品', align: 'start', sortable: false, value: 'name'},
      { text: '數量', value: 'amount', sortable: false,
        formatter: (x) => x? (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ","):'-'},
      { text: '包數', value: 'package', sortable: false,
        formatter: (x) => x? (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ","):'-'},
      { text: '總數量', value: 'totalNumber', sortable: false,
        formatter: (x) => x? (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ","):'-'},
      { text: '單位', value: 'sellUint', sortable: false,
        formatter: (x) => x? x:'-'},
      { text: '單價', value: 'uintPrice', sortable: false,
        formatter: (x) => x!=null? (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ","):'-'},
      { text: '小計', value: 'aTradePrice', sortable: false,
        formatter: (x) => x!=null? (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ","):'-'},
      { text: '累計', value: 'grandPrice', sortable: false, 
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '貨運', value: 'transport', sortable: false,
        formatter: (x) => x? x:'-'},
      { text: '備註', value: 'comment', sortable: false},
      { text: '功能', value: 'actions', sortable: false, width: '10%'},
    ],
    cashMethodArr:[],
    changeItemId: null,
    productArr: [],
    trades: [],
    allTrades: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      uintPrice: '',
      amount: '',
      package: '',
      aTradePrice: '',
      transport: '',
      comment:'',
      made_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
    defaultItem: {
      name: '',
      uintPrice: '',
      amount: '',
      package: '',
      aTradePrice: '',
      transport: '',
      comment: '',
      made_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
  }),

  mounted () {
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增交易' : '編輯交易'
    },
    formMadeDate () {
      return this.editedItem.made_date.slice(0,10)
    },
  },

  watch: {
    dialog (val) {
      this.switch1 = this.editedItem.pay
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
    chooseProduct(){
      this.editedItem.uintPrice = this.productArr[this.editedItem.name].price
    },

    checkInp(x){
      if (isNaN(x)){
        this.error="should input number"
        return true
      }
      return false
    },
    printEnvelope(){
      let routeData = this.$router.resolve({name: 'printEnvelope'});
      this.$store.dispatch('setPrintCustomer', this.customerInfo)
      window.open(routeData.href, '_blank')
    },
    printSomeReceipt(){
      this.calculatePriceAndWeight()

      let routeData = this.$router.resolve({
        name: 'printOutwardsSomeTrade', 
        query: {
          formerSum: this.formerSum,
          sum: this.sum,
          weight: this.weight
        }
      })
      this.$store.dispatch('setPrintData', this.trades)
      this.$store.dispatch('setPrintCustomer', this.customerInfo)
      window.open(routeData.href, '_blank')
    },
    printAllReceipt(){
      this.calculatePriceAndWeight()

      let routeData = this.$router.resolve({
        name: 'printOutwardsAllTrade', 
        query: {
          all: false,
          formerSum: this.formerSum,
          sum: this.sum,
          weight: this.weight
        }
      })
      this.$store.dispatch('setPrintData', this.trades)
      this.$store.dispatch('setPrintCustomer', this.customerInfo)
      window.open(routeData.href, '_blank')
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
      var date;
      if(x=='today'){
        this.dates[0] = this.today
        this.dates[1] = this.today
      }else if(x=='week'){
        date = new Date(this.dates[0])
        date.setDate(date.getDate() - 7);
        this.dates[0] = date.toISOString().substr(0, 10)
      }else if(x=='month'){
        date = new Date(this.dates[0])
        date.setMonth(date.getMonth() - 1);
        this.dates[0] = date.toISOString().substr(0, 10)
      }else if(x=='year'){
        date = new Date(this.dates[0])
        date.setFullYear(date.getFullYear()-1);
        this.dates[0] = date.toISOString().substr(0, 10)
      }
      this.filterTrades()
    },

    filterTrades (){
      this.dateRangeText()
      var startDate = new Date(`${this.dates[0]}T00:00:00`)
      var endDate = new Date(`${this.dates[1]}T24:00:00`)

      this.trades = this.allTrades.filter(function (product) {
        var date = new Date(product.made_date)
        return (date >= startDate && date <= endDate)
      })
      // console.log(this.trades)
      if(this.trades.length==0) return
    },

    calculatePriceAndWeight () {
      // formerSum
      this.formerSum = 0
      const index = this.allTrades.indexOf(this.trades[0])-1
      if(index>-1){
        this.formerSum = this.allTrades[index].grandPrice
      }
      // console.log(this.formerSum)

      // sum and weight
      this.sum = 0
      this.weight = 0
      this.trades.forEach(item=>{
        this.sum+=item.aTradePrice
        if(item.pay == true) {
          return
        }
        else if(item.uint == '台斤') {
          this.weight += item.number*item.totalNumber*0.6
        }
        else if(item.uint == '公斤') {
          this.weight += item.number*item.totalNumber
        }
      })
      this.weight = this.weight.toFixed(2);
    },

    async initialize () {
      // all customer names
      var customerData = (await CustomerService.index()).data
      this.customerNames = customerData.map(value => value.name)
      
      // customer name
      this.customerName = this.$store.state.route.params.customerName
      if(this.customerName == 'null') return

      customerData.forEach(item=>{
        if(item.name == this.customerName) this.customerInfo = item
      })
      // console.log(this.customerName)

      // get all products
      const products = (await ProductService.index()).data
      this.productNames = []
      this.productArr = []
      products.forEach(item=>{
        this.productNames.push(item.full_name)
        this.productArr[item.full_name] = item
      })
      // console.log(this.productArr)

      
      // get all transport names 
      this.transportNames = (await TransportService.index()).data.map(value => value.name)

      // gat all cashMethod 
      const cashMethod = (await CashMethodService.index()).data
      cashMethod.forEach(item => {
        this.cashMethod.push(item.name)
        this.cashMethodArr[item.name] = item.ratio
      })
      // console.log(this.cashMethodArr)
      // console.log(this.cashMethod)
      // get dates range
      var date = new Date(this.today)
      date.setDate(date.getDate() - 30);
      this.dates[0] = date.toISOString().substr(0, 10)
      this.dates[1] = this.today

      this.updateAllTradesByLastTen()
    },

    getChangeIdLeftTrades(){
      let len = this.allTrades.indexOf(this.allTrades.find(x => x.id === this.changeItemId))
      if(this.allTrades.length - len < 10) this.trades = this.allTrades.slice(Math.max(this.allTrades.length-10, 0))
      else this.trades = this.allTrades.slice(Math.max(len, 0))
    },

    getLastTenTrades(){
      this.trades = this.allTrades.slice(Math.max(this.allTrades.length-10, 0))
      this.dates = []
      this.dateText = ''
    },

    async updateAllTrades(){
      this.allTrades = (await TradeService.index(this.customerName)).data
      this.getChangeIdLeftTrades()
    },

    async updateAllTradesByLastTen(){
      this.allTrades = (await TradeService.index(this.customerName)).data
      // console.log(this.allTrades)
      this.getLastTenTrades()
    },

    editItem (item) {
      this.editedIndex = this.allTrades.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      if(this.editedItem.aTradePrice<0) this.editedItem.aTradePrice = 0 - this.editedItem.aTradePrice
    },

    deleteItem (item) {
      this.editedIndex = this.allTrades.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      this.$loading(true)
      // console.log('delete')
      try{
        var deleteATradePrice = this.editedItem.aTradePrice
        await TradeService.delete(this.editedItem)
        this.editedIndex++
        while(this.editedIndex != this.allTrades.length){
          var item = this.allTrades[this.editedIndex]
          item['grandPrice'] = item['grandPrice'] - deleteATradePrice
          
          try{
            await TradeService.put(item)
            this.editedIndex++
          }catch(err){
            console.log(err)
          }
        }
        this.updateAllTradesByLastTen()
        this.closeDelete()
      } catch(err){
        console.log(err)
      }
      this.$loading(false)
    },


    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.error=""
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeCashTime () {
      this.dialogCashTime = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save () {
      this.$loading(true)
      var item = this.editedItem
      // check input correct
      if (this.editedIndex > -1) {
        if((!item.pay && (this.checkInp(item.amount) || this.checkInp(item.package))) || (item.pay && this.checkInp(item.aTradePrice))){
          this.$loading(false)
          return
        } 
      } else {
        if((!this.switch1 && (this.checkInp(item.amount) || this.checkInp(item.package))) || (this.switch1 && this.checkInp(item.aTradePrice))){
          this.$loading(false)
          return
        }
      }

      var size  = this.allTrades.length
      item['customer_name'] = this.customerName
      item['user_name'] = this.$store.state.user.account
      // console.log(item['user_name'])

      var sum = 0
      
      if (this.switch1) {
        item['pay'] = true
        item['number'] = null
        item['uint'] = null
        item['package'] = null
        item['amount'] = null
        item['totalNumber'] = null
        item['sellUint'] = null
        item['uintPrice'] = null
        item['transport'] = null
        item['aTradePrice'] = -item.aTradePrice*this.cashMethodArr[item.name]
        item['aTradePrice'] = -item.aTradePrice
      } else{
        item['pay'] = false
        item['number'] = this.productArr[item.name].number
        item['uint'] = this.productArr[item.name].uint
        item['totalNumber'] = item.amount * item.package
        item['sellUint'] = this.productArr[item.name].sellUint
        item['aTradePrice'] =  Math.round(item.totalNumber * item.uintPrice)
        // item['cashDate'] = null
      }
      // console.log(item)


      if (this.editedIndex > -1) {
        // console.log('edit')
        this.changeItemId = item.id

        if(this.editedIndex != 0){
          sum = this.allTrades[this.editedIndex-1].grandPrice
        }
        while(1){
          sum = sum + item.aTradePrice
          item['grandPrice'] = sum
          try{
            await TradeService.put(item)
            this.editedIndex++
            if(this.editedIndex == size) break
            item = this.allTrades[this.editedIndex]
          }catch(err){
            console.log(err)
          }
        }
        this.updateAllTrades()
      } else {
        // console.log('new')
        // if (this.switch1) {
        item.made_date = `${item.made_date} 23:59:59`
        var index = size-1

        while(index>=0){
          if(this.allTrades[index].made_date>item.made_date) index--
          else break
        }
        sum = index == -1 ? 0 :this.allTrades[index].grandPrice 
        item['grandPrice'] = sum+item.aTradePrice
        try{
          var res = (await TradeService.post(item)).data
          this.changeItemId = res.id
        }catch(err){
          console.log(err)
        }
        index++
        while(index<size){
          var editItem = this.allTrades[index]
          editItem.grandPrice += item.aTradePrice
          try{
            await TradeService.put(editItem)
          }catch(err){
            console.log(err)
          }
          index++
        }
        
        this.updateAllTrades()
      }
      this.close()
      this.$loading(false)
    },
  },
}
</script>

<style scoped>

.v-application p {
  margin-bottom:0;
  color: #000; 

}

.btn{
  height: 36px;
  min-width: 64px;
  padding: 0 16px;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 8px !important;
  -webkit-appearance: button;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  align-items: center;
  border-radius: 4px;
  display: inline-flex;
  flex: 0 0 auto;
  font-weight: 500;
  letter-spacing: 0.0892857143em;
  justify-content: center;
  outline: 0;
  position: relative;
  text-decoration: none;
  text-indent: 0.0892857143em;
  text-transform: uppercase;
  transition-duration: 0.28s;
  transition-property: box-shadow, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  cursor: pointer;
  color: inherit;
  border-style: none;
  background-color: #f5f5f5;
}

.btn:after {
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
}

.btn:hover {
  filter: brightness(95%);
}

.subTitle{
  text-align: left;
}


.zero{
  background: #daebfa;
}

.change-position {
  position: absolute;
  right: 0px;
  bottom: 100px;
  width: 500px;
}

</style>