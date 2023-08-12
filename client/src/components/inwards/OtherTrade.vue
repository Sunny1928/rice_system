<template>
  <v-data-table
    :headers="headers"
    :items="trades"
    :items-per-page="10"
    class="elevation-1">

    <template v-slot:footer>
      <v-toolbar flat>
        <div>
          <v-toolbar-title>{{customerName}} 客戶往來交易資料</v-toolbar-title>
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
              worksheet="客戶往來交易"
              :name="customerName+'客戶往來交易.xls'">
              下載Excel
            </download-excel>

            <v-btn
              class="mb-2 mr-2"
              @click="printEnvelope">
              列印信封
            </v-btn>

            <v-btn
              class="mb-2 mr-2"
              @click="printReceipt">
              列印客戶往來交易
            </v-btn>

            <v-btn
              color="primary"
              class="mb-2 mr-2"
              @click="showLoan">
              結算利息
            </v-btn>

            <v-btn
              color="primary"
              class="mb-2 mr-2"
              v-bind="attrs"
              v-on="on">
              客戶往來交易
            </v-btn>

          </template>

          <v-card class="change-position">
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container v-if="editedIndex == -1">
                <v-row>
                  <v-menu
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
                      @input="chooseProduct"
                      :rules="[required]"/>
                  </v-col>
                  <v-col
                    class="ml-2 pa-0">
                    <v-text-field
                      class="ml-2"
                      v-model="editedItem.uintPrice"
                      label="單價"
                      :rules="[required]">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-text-field
                    class="pr-4"
                    v-model="editedItem.number"
                    label="數量">
                  </v-text-field>
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
                    v-model="formMadeDate"
                    label="交易日期（無法修改）"
                    readonly>
                  </v-text-field>
                </v-row>
                <v-row>
                  <v-col
                    class="pa-0">
                    <v-text-field
                      v-if="editedItem.name == '利息'"
                      class="pr-4"
                      v-model="editedItem.name"
                      label="商品選項（無法修改）"
                      readonly>
                    </v-text-field>
                    <v-select
                      v-else
                      v-model="editedItem.name"
                      :items="productNames"
                      label="商品選項（無法修改）"
                      readonly
                      :rules="[required]">
                    </v-select>
                  </v-col>
                  <v-col
                    class="ml-2 pa-0">
                    <v-text-field
                      v-if="editedItem.name == '利息' || editedItem.name == '借現金'"
                      v-model="editedItem.uintPrice"
                      label="單價（無法修改）"
                      readonly
                      :rules="[required]">
                    </v-text-field>
                    <v-text-field
                      v-else
                      v-model="editedItem.uintPrice"
                      label="單價"
                      :rules="[required]">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-text-field
                    v-if="editedItem.name == '利息'"
                    class="pr-4"
                    v-model="editedItem.number"
                    readonly
                    label="數量（無法修改）">
                  </v-text-field>
                  <v-text-field
                    v-else-if="editedItem.name == '借現金' && editedItem.loan!='not'"
                    class="pr-4"
                    v-model="editedItem.number"
                    readonly
                    label="數量（以結算利息因此無法修改、刪除。若要修改、刪除，請刪除其結算的利息）">
                  </v-text-field>
                  <v-text-field
                    v-else
                    class="pr-4"
                    v-model="editedItem.number"
                    label="數量">
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
                color="blue darken-1"
                text
                @click="save"
                :disabled="(editedItem.name=='' || editedItem.number=='' || editedItem.uintPrice=='' || editedItem.made_date=='' || editedItem.uintPrice == '')">
                儲存
              </v-btn>
            </v-card-actions>

          </v-card>

          
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">你確定要刪掉這個糧食進出交易嗎？</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">確認</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogLoan" max-width="800px">
          <v-card >
            <v-card-title>
              <span class="text-h5">計算利息</span>
            </v-card-title>

            <v-card-text>
              <v-row class="pa-4">
                <v-col>
                  <v-menu
                    ref="menu_loan_made_date"
                    v-model="menu_loan_made_date"
                    :close-on-content-click="false"
                    :return-value.sync="loan_made_date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="loan_made_date"
                        label="交易日期"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on">
                      </v-text-field>
                    </template>
                    <v-date-picker
                      :max="today"
                      v-model="loan_made_date"
                      no-title
                      scrollable>
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="menu_loan_made_date = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu_loan_made_date.save(loan_made_date)">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col>
                  <v-text-field
                  v-model="rate"
                  label="利率">
                  </v-text-field>
                </v-col>
                <v-col>
                  <v-menu
                    ref="menu"
                    v-model="menu1"
                    :close-on-content-click="false"
                    :return-value.sync="date"
                    transition="scale-transition"
                    offset-y
                    min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="試算截止日"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on">
                      </v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      no-title
                      scrollable>
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="menu1 = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(date); calculateLoanDay()">
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                
              </v-row>
              <v-data-table
                v-model="selectedLoans"
                :headers="loanHeaders"
                :items="loans"
                item-key="id"
                show-select
                class="elevation-1">
                <template
                  v-for="header in loanHeaders.filter((header) => header.hasOwnProperty('formatter'))"
                  v-slot:[`item.${header.value}`]="{ header, value }">
                  {{ header.formatter(value) }}
                </template>
              </v-data-table>
            </v-card-text>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="blue darken-1" 
                text 
                @click="closeLoan">
                取消
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="calculateLoan"
                :disabled="rate=='' || selectedLoans.length == 0">
                儲存利息
              </v-btn>
            </v-card-actions>

          </v-card>
        </v-dialog>
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
        @click="deleteItem(item)"
        v-if="!(item.name == '借現金' && item.loan != 'not')">
        mdi-delete
      </v-icon>
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

    <template v-slot:item.grandPrice="{ item }">
      
    </template>

    <template
      v-for="header in headers.filter((header) => header.hasOwnProperty('formatter'))"
      v-slot:[`item.${header.value}`]="{ header, value }">
      <div v-if="header.value == 'grandPrice'">
        <div
          v-if="value<0" 
          class="blue-text">
          {{ header.formatter(value) }}
        </div>
        <div
          v-else 
          class="red-text">
          {{ header.formatter(value) }}
        </div>
      </div>
      <div v-else>
        {{ header.formatter(value) }}
      </div>
    </template>

  </v-data-table>
</template>



<script>
import ProductService from '@/services/inwards/ProductService'
import OtherTradeService from '@/services/inwards/OtherTradeService'

export default {
  props:[
    'dates'
  ],
  data: () => ({
    lastTrade:{},
    error:"",
    json_fields: {
      日期: {
        callback: (value) => {
          return value.made_date.slice(0,10);
        }
      },
      名稱: "name",
      單價: "uintPrice",
      數量: "number",
      小計: "aTradePrice",
      餘額: "grandPrice",
      備註: "comment"
    },
    json_meta: [
      [{
        key: "charset",
        value: "utf-8",
        }],
    ],
    customerName: '',
    customerNames: [],
    customerInfo: {},
    rate: 1.5,
    date: '',
    menu1: false,
    today: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

    selectedLoans: [],
    loans:[],
    menu: false,
    menu_made_date: false,
    menu_loan_made_date: false,
    loan_made_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

    productNames: [],
    productArr: [],

    required: (value) => value.toString().length !== 0 || 'Required.',
    dialog: false,
    dialogDelete: false,
    dialogLoan: false,
    currentTime: '',
    headers: [
      { text: '日期', value: 'made_date', sortable: false, width: '105px',
        formatter: (x) => x.slice(0,10)},
      { text: '名稱', align: 'start', sortable: false, value: 'name'},
      { text: '單價', value: 'uintPrice', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '數量', value: 'number', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '小計', value: 'aTradePrice', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '餘額', value: 'grandPrice', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '結算日期', value: 'payLoanDate', sortable: false, width: '105px',
        formatter: (x) => x? x.slice(0,10):'-'},
      { text: '備註', value: 'comment', sortable: false},
      { text: '功能', value: 'actions', sortable: false, width: '10%'},
    ],
    loanHeaders: [
      { text: '日期', value: 'made_date', sortable: false, width: '105px',
        formatter: (x) => x.slice(0,10)},
      { text: '名稱', align: 'start', sortable: false, value: 'name'},
      { text: '單價', value: 'uintPrice', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '數量', value: 'number', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '小計', value: 'aTradePrice', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '結算天數', value: 'day', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
    ],

    changeItemId: null,
    trades: [],
    allTrades: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      uintPrice: '',
      number: '',
      comment:'',
      made_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
    defaultItem: {
      name: '',
      uintPrice: '',
      number: '',
      comment:'',
      made_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
  }),

  mounted () {
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增客戶往來交易' : '編輯客戶往來交易'
    },
    formMadeDate () {
      return this.editedItem.made_date.slice(0,10)
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    dialogLoan (val) {
      val || this.closeLoan()
    }
  },

  created () {
    // this.initialize()
  },

  methods: {
    chooseProduct(){
      if(this.editedItem.name == '利息') this.editedItem.uintPrice = 1
      else this.editedItem.uintPrice = this.productArr[this.editedItem.name].price
    },

    calculateLoanDay(){
      const date1 = new Date(this.date)
      this.loans.forEach(loan=>{
        const date2 = new Date(loan.made_date)
        const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))
        loan.day = diffDays
        // console.log(loan.day)
      })
    },

    // 結算利息
    async calculateLoan(){
      this.$loading(true)
      var sum = 0
      var loanComment = ''
      // console.log(this.selectedLoans)
      this.selectedLoans.forEach(loan => {
        sum += loan.number/100*this.rate*(loan.day/30)
        loanComment += `${loan.id} `
      })

      sum = Math.ceil(sum)
      // console.log(sum)
      //new rateItem
      var size = this.allTrades.length
      var formerSum = size != 0 ? this.allTrades[size-1].grandPrice : 0
      var rateItem = {
        name: '利息',
        number: sum,
        uintPrice: 1,
        aTradePrice: sum,
        loan: loanComment,
        customer_name: this.customerName,
        user_name: this.$store.state.user.account,
        made_date: `${this.loan_made_date.substr(0,10)} 23:59:59`,
        comment: `結算至${this.date.substr(0,10)}`
      }

      var index = size-1

      while(index>=0){
        if(this.allTrades[index].made_date>rateItem.made_date) index--
        else break
      }

      var formerSum = index == -1 ? 0 :this.allTrades[index].grandPrice 
      rateItem['grandPrice'] = formerSum+sum

      try{
        var res = (await OtherTradeService.post(rateItem)).data
        this.changeItemId = res.id
        // pay
        for(var loan of this.selectedLoans){
          try{
            loan.payLoanDate=this.date
            loan.loan = res.id
            await OtherTradeService.put(loan)
          }catch(err){
            console.log(err)
          }
        }
      }catch(err){
        console.log(err)
      }

      index++
      while(index<size){
        var editItem = this.allTrades[index]
        editItem.grandPrice += sum
        try{
          await OtherTradeService.put(editItem)
        }catch(err){
          console.log(err)
        }
        index++
      }
    
      this.updateAllTrades()
      this.closeLoan()
      this.$loading(false)
    },

    showLoan(){
      this.dialogLoan = true
      this.loans = []
      this.allTrades.forEach(item => {
        if(item.loan == 'not') this.loans.push(item)
      })
      this.calculateLoanDay()
    },

    checkInp(x){
      if (isNaN(x)){
        this.error="請輸入正確格式";
        return true;
      }
      return false;
    },
    
    printEnvelope(){
      let routeData = this.$router.resolve({name: 'printEnvelope'});
      this.$store.dispatch('setPrintCustomer', this.customerInfo)
      window.open(routeData.href, '_blank')
    },

    printReceipt(){
      let routeData = this.$router.resolve({
        name: 'printInwardsOtherTrade', 
        query: {
          all: false
        }
      })
      this.$store.dispatch('setPrintData', this.trades)
      this.$store.dispatch('setPrintCustomer', this.customerInfo)
      window.open(routeData.href, '_blank')
    },

    filterTrades (){
      var startDate = new Date(`${this.dates[0]}T00:00:00`)
      var endDate = new Date(`${this.dates[1]}T24:00:00`)

      this.trades = this.allTrades.filter(function (product) {
        var date = new Date(product.made_date)
        return (date >= startDate && date <= endDate)
      })
      // console.log(this.trades)
    },

    async initialize () {
      // get 利息date
      this.date = this.today

      // get all products
      const products = (await ProductService.index()).data
      this.productArr = []
      products.forEach(item=>{
        this.productNames.push(item.name)
        this.productArr[item.name] = item
      })
      // console.log(this.productArr)

      // not or pay
      var loanItem = {
        name: '借現金',
        price: 1
      }
      this.productNames.push('借現金')
      this.productArr['借現金'] = loanItem
      // console.log(this.productNames)

      // this.allTrades = (await OtherTradeService.index(this.customerName)).data
      // // console.log(this.allTrades)

      // this.getLastTenTrades()
      this.updateAllTradesByLastTen()

      // get last trade
      // this.lastTrade = (await OtherTradeService.getLastTrade(this.customerName)).data
    },

    getLastTenTrades(){
      this.trades = this.allTrades.slice(Math.max(this.allTrades.length-10, 0))
    },

    getChangeIdLeftTrades(){
      let len = this.allTrades.indexOf(this.allTrades.find(x => x.id === this.changeItemId))
      // console.log(this.changeItemId)
      // console.log(len)
      if(this.allTrades.length - len < 10) this.trades = this.allTrades.slice(Math.max(this.allTrades.length-10, 0))
      else this.trades = this.allTrades.slice(Math.max(len, 0))
    },


    async updateAllTrades(){
      this.allTrades = (await OtherTradeService.index(this.customerName)).data
      this.getChangeIdLeftTrades()
    },

    async updateAllTradesByLastTen(){
      this.allTrades = (await OtherTradeService.index(this.customerName)).data
      this.getLastTenTrades()
    },

    editItem (item) {
      this.editedIndex = this.allTrades.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.uint = '公斤'
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.allTrades.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      this.$loading(true)
      // console.log('delete')

      // edit product stock
      if(!(this.editedItem.name == '利息' || this.editedItem.name == '借現金')){
        var productItem = this.productArr[this.editedItem.name]
        productItem.stock = productItem.stock + this.editedItem.number
        try {
          await ProductService.put(productItem)
        } catch(err){
          console.log(err)
        }
      }

      var gap = this.editedItem.aTradePrice
      var index = this.editedIndex
      index++

      while(index!= this.allTrades.length){
        var item = this.allTrades[index]
        item['grandPrice'] = item.grandPrice - gap
        try{
          await OtherTradeService.put(item)
          index++
        }catch(err){
          console.log(err)
        }
      }

      // if 利息
      if(this.editedItem.name == '利息'){
        var idArr = (this.editedItem.loan+'').split(' ')

        for(var id of idArr){
          if(id=='') break
          var item = this.allTrades.find(x => x.id === parseInt(id))
          item.loan = 'not'
          item.payLoanDate = null
          try {
            await OtherTradeService.put(item)
          } catch(err){
            console.log(err)
          }
        }
      }
      
      
      // delete item
      try {
        await OtherTradeService.delete(this.editedItem)
      } catch(err){
        console.log(err)
      }

      this.updateAllTradesByLastTen()
      this.closeDelete()
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

    closeLoan () {
      this.dialogLoan = false
      this.selectedLoans = []
      this.date = this.today
    },


    async save () {
      this.$loading(true)
      var item = this.editedItem

      // check input is correct
      if(this.checkInp(item.number) || this.checkInp(item.uintPrice)) {
        this.$loading(false)
        return
      }
      var size  = this.allTrades.length

      item['customer_name'] = this.customerName
      item['user_name'] = this.$store.state.user.account
      item['aTradePrice'] = Math.round(item.uintPrice * item.number)
      
      var sum = 0
      // console.log(item)

      // edit product stock
      if(!(this.editedItem.name == '利息' || this.editedItem.name == '借現金')){
        var productItem = this.productArr[item.name]
        var x = item.number
        if(this.editedIndex > -1) x = x -  this.allTrades[this.editedIndex].number
        productItem.stock = productItem.stock - x
        try {
          await ProductService.put(productItem)
        } catch(err){
          console.log(err)
        }
      }
          
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
            await OtherTradeService.put(item)
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

        if(item.name == '借現金') item.loan = 'not'

        item.made_date = `${item.made_date} 23:59:59`
        var index = size-1

        while(index>=0){
          if(this.allTrades[index].made_date>item.made_date) index--
          else break
        }

        sum = index == -1 ? 0 :this.allTrades[index].grandPrice         
        item['grandPrice'] = sum + item.aTradePrice
        // console.log(item)

        try{
          var res = (await OtherTradeService.post(item)).data
          this.changeItemId = res.id
        }catch(err){
          console.log(err)
        }

        index++
        while(index<size){
          var editItem = this.allTrades[index]
          editItem.grandPrice += item.aTradePrice
          try{
            await OtherTradeService.put(editItem)
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


.change-position {
  position: absolute;
  right: 0px;
  bottom: 100px;
  width: 500px;
}

</style>