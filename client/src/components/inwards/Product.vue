<template>
  <titlepanel title="進 貨 ">
    <div class="white">
      <div class="subTitle">
        <b>產品銷貨篩選條件</b>
      </div>
      <v-row>
        <!-- <v-col
          cols="12"
          md="3">
          <v-autocomplete
            v-model="searchProduct"
            :items="productNames"
            label="產品選項"
            dense
            outlined
            solo/>
        </v-col> -->
      
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
                @click="$refs.menu.save(dates); dateRangeText();">
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

        <!-- <v-col
          cols="12"
          md="1"
          class="pt-3">
          <v-btn
            class="d-flex"
            :disabled = "searchProduct == '' || dates == null"
            @click="calculateSum">
            搜尋
          </v-btn>
        </v-col> -->

       
      </v-row>
    </div>      

    <v-card>
    <v-card-title>
      產品資料
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="搜尋產品"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="products"
      :items-per-page="10"
      class="elevation-1"
      item-key="name"
      :search="search"
      :custom-filter="filterOnlyCapsText">

      <template v-slot:footer>
        <v-toolbar flat>
          <v-spacer></v-spacer>

          <v-dialog
            v-model="dialog"
            max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on">
                新增產品
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row v-if="editedIndex!=-1">
                    <v-text-field
                      v-model="editedItem.name"
                      label="產品名稱（無法修改）"
                      readonly>
                    </v-text-field>
                  </v-row>
                  <v-row v-else>
                    <v-text-field
                      v-model="editedItem.name"
                      label="產品名稱"
                      :rules="[required]">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.stock"
                      label="庫存">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.price"
                      label="單價"
                      :rules="[required]">
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
                  :disabled="editedItem.name=='' || editedItem.price==''">
                  儲存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">你確定要刪掉這個產品嗎？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">確認</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogSearch" max-width="800px">
            <v-card>
              <v-card-title class="text-h5 justify-space-between">
                <div>
                  {{editedItem.name}}
                </div>
                <div class="text1 d-flex flex-row px-2">共賣出{{sum}}份</div>

              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="tradeHeaders"
                  :items="trades"
                  item-key="id"
                  class="elevation-1">
                  <template
                    v-for="header in tradeHeaders.filter((header) => header.hasOwnProperty('formatter'))"
                    v-slot:[`item.${header.value}`]="{ header, value }">
                    <!-- {{ header.formatter(value) }} -->
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
              </v-card-text>
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
          @click="deleteItem(item)">
          mdi-delete
        </v-icon>
        <v-icon
          small
          class="mr-2"
          @click="searchItem(item)">
          mdi-card-search
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

    </v-data-table>
    </v-card>

  </titlepanel>
</template>

<script>
import Titlepanel from '../TitlePanel.vue'
import ProductService from '@/services/inwards/ProductService'
import OtherTradeService from '@/services/inwards/OtherTradeService'

export default {
  components: { Titlepanel },
  data: () => ({
    tradeHeaders: [
      { text: '日期', value: 'made_date', sortable: false, width: '105px',
        formatter: (x) => x.slice(0,10)},
      { text: '顧客', align: 'start', sortable: false, value: 'customer_name'},
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
    ],
    trades:[],

    search:'',
    sum: 0,
    today: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    dateText: '',
    dates: [],
    menu: false,
    
    // searchProduct:'',
    error:'',
    required: (value) => !!value || 'Required.',
    dialog: false,
    dialogDelete: false,
    dialogSearch: false,
    headers: [
      {
        text: '產品',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: '庫存', value: 'stock', sortable: false},
      { text: '單價', value: 'price', sortable: false},
      { text: '功能', value: 'actions', sortable: false }
    ],
    products: [],
    productNames: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      stock: '',
      price: ''
    },
    defaultItem: {
      name: '',
      stock: '',
      price: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增產品' : '編輯產品'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    dialogSearch(val) {
      val || this.closeSearch()
    },
  },

  created () {
    this.$loading(true)
    this.initialize()
    this.$loading(false)
  },

  methods: {

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
      this.dateRangeText()
    },


    filterOnlyCapsText (value, search, item) {
      return value != null &&
            search != null &&
            typeof value === 'string' &&
            value.toString().indexOf(search) !== -1
    },
    
    // async calculateSum(){
    //   this.$loading(true)
    //   this.sum = 0
    //   var startDate = new Date(`${this.dates[0]}T00:00:00`)
    //   var endDate = new Date(`${this.dates[1]}T24:00:00`)
    //   // console.log(startDate.toISOString()+','+endDate.toISOString())
    //   var allItems = (await OtherTradeService.getAllItemsByProduct(this.searchProduct, startDate.toISOString()+','+endDate.toISOString())).data
    //   console.log(allItems)
      
    //   allItems.forEach(item=>{
    //     this.sum+=item.number
    //   })
    //   this.$loading(false)
    // },

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

    checkInp(x){
      if (isNaN(x)){
        this.error="請輸入正確格式";
        return true;
      }
      return false;
    },

    async initialize () {
      this.products = (await ProductService.index()).data
      this.productNames = this.products.map(value => value.name)

      // get dates range
      var date = new Date(this.today)
      date.setDate(date.getDate() - 30);
      this.dates[0] = date.toISOString().substr(0, 10)
      this.dates[1] = this.today
      this.dateRangeText()
    },

    editItem (item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async searchItem (item) {
      this.sum = 0

      var startDate = new Date(`${this.dates[0]}T00:00:00`)
      var endDate = new Date(`${this.dates[1]}T24:00:00`)
      this.trades = (await OtherTradeService.getAllItemsByProduct(item.name, startDate.toISOString()+','+endDate.toISOString())).data
      console.log(this.trades)

      // the amounts
      this.trades.forEach(item=>{
        this.sum+=item.number
      })

      this.editedItem = Object.assign({}, item)

      this.dialogSearch = true
    }, 

    async deleteItemConfirm () {
      this.$loading(true)
      try{
        await ProductService.delete(this.editedItem)
        this.closeDelete()
      }catch(err){
        console.log(err)
      }
      this.initialize()
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

    closeSearch () {
      this.dialogSearch = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save () {
      this.$loading(true)
      var item = this.editedItem

      // check input is correct
      if(this.checkInp(item.price) || this.checkInp(item.stock)) {
        this.$loading(false)
        return
      }
      if(item.stock == '') item.stock = 0

      if (this.editedIndex > -1) {
        try{
          await ProductService.put(item)
          this.initialize()
        }catch(err){
          console.log(err)
        }
      } else {
        const checkSameItem = (item) => item == this.editedItem.name;
        if(this.productNames.some(checkSameItem)) {
          this.error="你已經有這個品項了"
          this.$loading(false)
          return
        }
        try{
          await ProductService.post(item)
          this.initialize()
        }catch(err){
          console.log(err)
        }
      }
      this.close()
      this.$loading(false)
    },
  },
}
</script>
<style scoped>
.text1{
  height: auto;
  text-align: left;
  font-size: 24px;
  padding: 5px 10px;
  color: white;
  background-color: #1976D2;
  border-radius: 10px;
}
</style>

