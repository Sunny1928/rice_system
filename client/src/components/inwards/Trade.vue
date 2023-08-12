<template>
  <v-data-table
    :headers="headers"
    :items="trades"
    :items-per-page="10"
    class="elevation-1">

    <template v-slot:footer>
      <v-toolbar flat>
        <div>
          <v-toolbar-title>{{customerName}} 糧食交易資料</v-toolbar-title>
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
              worksheet="糧食進出交易"
              :name="customerName+'糧食進出交易.xls'">
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
              列印糧食進出登記簿
            </v-btn>

            <v-btn
              color="primary"
              class="mb-2 mr-2"
              v-bind="attrs"
              v-on="on">
              新增糧食進出交易
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
                :label="`${(switch1 === true) ? '轉出模式' :'正常模式'}`"
              ></v-switch>
            </v-card-title>

            <v-card-text>
              <v-container v-if="editedIndex==-1">
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
                  <v-autocomplete
                    v-model="editedItem.name"
                    :items="ricekindNames"
                    label="米項目選項"
                    :rules="[required]"/>
                </v-row>
                <v-row>
                  <v-text-field
                    v-if="switch1===false"
                    class="pr-4"
                    v-model="editedItem.in"
                    label="進">
                  </v-text-field>
                  <v-text-field
                    class="pr-4"
                    v-model="editedItem.out"
                    label="出">
                  </v-text-field>
                </v-row>
                <v-row>
                  <v-select
                    v-model="editedItem.uint"
                    :items="ricekindUints"
                    label="單位">
                  </v-select>
                </v-row>
                <v-row v-if="switch1===true">
                  <v-autocomplete
                    v-model="editedItem.inCustomer"
                    :items="inCustomerNames"
                    label="轉入客戶選項"/>
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
                </v-row>
                <v-row>
                  <v-autocomplete
                    v-model="editedItem.name"
                    :items="ricekindNames"
                    label="米項目選項"
                    :rules="[required]"/>
                </v-row>
                <v-row>
                  <v-text-field
                    v-if="editedItem.in!==0"
                    class="pr-4"
                    v-model="editedItem.in"
                    label="進">
                  </v-text-field>
                  <v-text-field
                    v-if="editedItem.out!==0"
                    class="pr-4"
                    v-model="editedItem.out"
                    label="出">
                  </v-text-field>
                </v-row>
                <v-row>
                  <v-select
                    v-model="editedItem.uint"
                    :items="ricekindUints"
                    label="單位">
                  </v-select>
                </v-row>
                <v-row v-if="editedItem.turn_id != -1">
                  <v-text-field
                    v-model="editedItem.go"
                    label="稻穀紀錄（若要修改客戶選項，請刪除在做新增）"
                    readonly>
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
                v-if="editedIndex==-1"
                color="blue darken-1"
                text
                @click="save"
                :disabled="editedItem.made_date==''||editedItem.name==''||editedItem.uint==''||
                (editedItem.in==''&&editedItem.out=='')||
                ((editedItem.in!='')&&(editedItem.out!=''))||
                ((editedItem.in!='')&&(editedItem.inCustomer!=''))">
                儲存
              </v-btn>
              <v-btn
                v-else
                color="blue darken-1"
                text
                @click="save"
                :disabled="editedItem.made_date==''||editedItem.name==''||editedItem.uint==''||
                (editedItem.in==''&&editedItem.out=='')||
                (editedItem.in!=''&&editedItem.out!='')">
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
      <div v-if="header.value == 'stock'">
        <div
          v-if="value>=0" 
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
import RicekindService from '@/services/inwards/RicekindService'
import RiceTradeService from '@/services/inwards/RiceTradeService'

export default {
  props:[
    'dates'
  ],
  data: () => ({
    json_fields: {
      日期: {
        callback: (value) => {
          return value.made_date.slice(0,10);
        }
      },
      品名: "name",
      進: "in",
      出: "out",
      小計: "stock",
      稻穀紀錄: "go",
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
    today: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    customerName: '',
    customerNames: [],
    customerInfo: {},
    error:"",
    switch1: false,
    menu: false,
    menu_made_date: false,

    ricekindNames: [],
    ricekinds: [],
    ricekindUints:['公斤', '台斤'],
    inCustomerNames: [],

    required: (value) => value.toString().length !== 0 || 'Required.',
    dialog: false,
    dialogDelete: false,
    currentTime: '',
    headers: [
      { text: '日期', value: 'made_date', sortable: false, width: '105px',
        formatter: (x) => x.slice(0,10)},
      { text: '產品', align: 'start', sortable: false, value: 'name'},
      { text: '進', value: 'in', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
      { text: '出', value: 'out', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ","),},
      { text: '小計', value: 'stock', sortable: false,
        formatter: (x) => (""+x).replace(/\B(?=(\d{3})+(?!\d))/g, ","),},
      { text: '稻穀紀錄', value: 'go', sortable: false},
      { text: '備註', value: 'comment', sortable: false},
      { text: '功能', value: 'actions', sortable: false, width: '10%'},
    ],
    changeItemId: null,
    trades: [],
    allTrades: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      in: '',
      out: '',
      uint: '公斤',
      inCustomer:'',
      comment:'',
      made_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
    defaultItem: {
      name: '',
      in: '',
      out: '',
      uint: '公斤',
      inCustomer:'',
      comment:'',
      made_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    },
  }),

  mounted () {
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增糧食進出交易' : '編輯糧食進出交易'
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
    }
  },

  created () {
    // this.initialize()
  },

  methods: {
    printEnvelope(){
      let routeData = this.$router.resolve({name: 'printEnvelope'});
      this.$store.dispatch('setPrintCustomer', this.customerInfo)
      window.open(routeData.href, '_blank')

    },
    printReceipt(){
      let routeData = this.$router.resolve({
        name: 'printInwardsTrade', 
        query: {
          all: false
        }
      });
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
      this.inCustomerNames = this.customerNames.filter(e => e !== this.customerName)      
      // console.log(this.inCustomerNames)

      // get all ricekinds
      this.updateRicekinds()

      // get all trades
      this.updateAllTradesByLastTen()
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
      this.allTrades = (await RiceTradeService.index(this.customerName)).data
      // this.getLastTenTrades()
      this.getChangeIdLeftTrades()
    },

    async updateAllTradesByLastTen(){
      this.allTrades = (await RiceTradeService.index(this.customerName)).data
      this.getLastTenTrades()
    },

    async updateRicekinds(){
      var  ricekindData= (await RicekindService.index()).data
      ricekindData.forEach(item => {
        this.ricekindNames.push(item.name)
        this.ricekinds[item.name] = item
      })
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
      var item = this.editedItem

      var size = this.allTrades.length
      var gap = parseInt(item.in) - parseInt(item.out)
      var index = this.editedIndex
      index++

      while(index < size){
        var editItem = this.allTrades[index]
        editItem['stock'] = editItem.stock - gap
        try{
          await RiceTradeService.put(editItem)
          index++
        }catch(err){
          console.log(err)
        }
      }


      // delete another customer item
      if(item.another_customer_name != null){
        var anotherAllTrades = (await RiceTradeService.index(item.another_customer_name)).data
        var anotherSize = anotherAllTrades.length
        var anotherIndex = anotherAllTrades.findIndex((e) => e.turn_id == item.id)
        anotherIndex++
        while(anotherIndex!= anotherSize){
          var editItem = anotherAllTrades[anotherIndex]
          editItem['stock'] = editItem.stock + gap
          try{
            await RiceTradeService.put(editItem)
            anotherIndex++
          }catch(err){
            console.log(err)
          }
        }
      }

      try {
        await RiceTradeService.delete(item)
        await RiceTradeService.deleteById(item.turn_id)
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

    async save () {
      this.$loading(true)
      var item = this.editedItem

      // check input is correct
      if(this.checkInp(item.in)) {
        this.$loading(false)
        return
      }
      if(this.checkInp(item.out)) {
        this.$loading(false)
        return
      }
      if(item.uint == '台斤'){
        item.in = item.in*0.6
        item.out = item.out*0.6
      }

      item.customer_name = this.customerName
      item.user_name = this.$store.state.user.account
      if(item.in == '' || item.in == 0) item.in = 0
      else item.out = 0
      // console.log(item)

      var size  = this.allTrades.length
      var sum = 0
      var aTradeStock = parseInt(item.in) - parseInt(item.out)
      
          
      if (this.editedIndex > -1) {
        // console.log('edit')
        var index = this.editedIndex
        var gap = aTradeStock - this.allTrades[index].in + this.allTrades[index].out 
        item.stock = item.stock + gap 
        try {
          await RiceTradeService.put(item)
          this.changeItemId = item.id
        } catch(err){
          console.log(err)
        }

        index++

        // edit my items 
        while(index < size){
          var edititem = this.allTrades[index]
          edititem['stock'] = edititem.stock + gap
          try {
            await RiceTradeService.put(edititem)
          } catch(err){
            console.log(err)
          }
          index++
        }

        // edit another customer's items
        if(item.turn_id!=-1){
          try{
            var anotherItem = (await RiceTradeService.get(item.turn_id)).data
            var anotherAllTrades = (await RiceTradeService.index(item.another_customer_name)).data
            var anotherSize = await anotherAllTrades.length
            var anotherIndex = anotherAllTrades.findIndex((e) => e.id == item.turn_id)
            
            anotherItem['made_date'] = item.made_date
            anotherItem['name'] = item.name
            anotherItem['in'] = item.out
            anotherItem['out'] = item.in
            anotherItem['stock'] = anotherItem.stock - gap
            try{
              await RiceTradeService.put(anotherItem)
            }catch(err){
              console.log(err)
            }

            anotherIndex++

            while(anotherIndex!= anotherSize){
              var anotherItem = anotherAllTrades[anotherIndex]
              anotherItem['stock'] = anotherItem.stock - gap
              try{
                await RiceTradeService.put(anotherItem)
                anotherIndex++
              }catch(err){
                console.log(err)
              }
            }

          }catch(err){
            console.log(err)
          }
        }
        
        this.updateAllTrades()
      } else {
        // console.log('new')

        item.made_date = `${item.made_date} 23:59:59`
        var index = size-1

        while(index>=0){
          if(this.allTrades[index].made_date>item.made_date) index--
          else break
        }

        sum = index == -1 ? 0 :this.allTrades[index].stock 
        item['stock'] = sum + aTradeStock

        if(item.inCustomer == ''){
          try {
            var res = (await RiceTradeService.post(item)).data
            this.changeItemId = res.id
          } catch(err){
            console.log(err)
          }
        }else{
          var checkGo = item.in === 0
          if(checkGo) item['go'] = `轉出至${item.inCustomer}`
          else item['go'] = `${item.inCustomer}轉入`
          item['another_customer_name'] = item.inCustomer
          // console.log(item)
          try{
            var res_out = (await RiceTradeService.post(item)).data

            // another customer item
            try{
              var anotherAllTrades = (await RiceTradeService.index(item.inCustomer)).data
              var anotherSize = await anotherAllTrades.length

              var anotherItem = {}
              anotherItem['turn_id'] = await res_out.id
              anotherItem['made_date'] = item.made_date
              anotherItem['name'] = item.name
              anotherItem['customer_name'] = item.inCustomer
              anotherItem['another_customer_name'] = item.customer_name
              anotherItem['user_name'] = item.user_name

              if(checkGo) {
                anotherItem['in'] = item.out
                anotherItem['go'] = `${item.customer_name}轉入`
              }else{
                anotherItem['out'] = item.in
                anotherItem['go'] = `轉出至${item.customer_name}`
              } 

              var anotherIndex = anotherSize-1

              while(anotherIndex>=0){
                if(anotherAllTrades[anotherIndex].made_date>item.made_date) anotherIndex--
                else break
              }

              var anotherSum = anotherIndex == -1 ? 0 : anotherAllTrades[anotherIndex].stock
              anotherItem['stock'] = parseInt(anotherSum) - aTradeStock
              
              // console.log(anotherItem)

              // another trade id back to origin item turn_id
              var res_in = (await RiceTradeService.post(anotherItem)).data
              res_out['turn_id'] = await res_in.id
              await RiceTradeService.put(res_out)
              this.changeItemId = res_out.id

              
              anotherIndex++
              while(anotherIndex<anotherSize){
                var editItem = anotherAllTrades[anotherIndex]
                editItem.stock -= aTradeStock
                try{
                  await RiceTradeService.put(editItem)
                }catch(err){
                  console.log(err)
                }
                anotherIndex++
              }

            } catch(err){
              console.log(err)  
            }
          
          } catch(err){
            console.log(err)
          }

          
        }

        index++
        while(index<size){
          var editItem = this.allTrades[index]
          editItem.stock += aTradeStock
          try{
            await RiceTradeService.put(editItem)
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
.receipt *{
  margin:0;
  padding:0;
  box-sizing: border-box;
}
.receipt{
  margin-left: 0;
  padding:0;
  margin-top: -100px;
}

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