<template>
  <titlepanel title="進 貨 ">
    <div class="white">
      <div class="subTitle">
        <b>交易日期篩選條件</b>
      </div>
      <v-row>
        <v-col
          cols="12"
          md="3">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
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
              v-model="date"
              no-title
              scrollable>
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
                @click="$refs.menu.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>

        <v-col
          cols="12"
          md="3"
          class=" d-flex pt-3">
          <v-btn
            :disabled = "date == null"
            @click="serchDateCustomer">
            搜尋
          </v-btn>
          <v-btn
            class="ml-2">
            <v-icon
              small
              @click="initialize">
              mdi-refresh
            </v-icon>
          </v-btn>
        </v-col>

        <!-- <v-col
          v-if="searchRicekind != ''"
          cols="12"
          md="4"
          class="pl-0 d-flex flex-row ">
          <b class="text1">{{this.date}}進貨{{this.sum}}份</b>
        </v-col> -->
      </v-row>
    </div>

    <v-card>
    <v-card-title>
      顧客資料
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="搜尋顧客"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="customers"
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
                新增顧客
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-text-field
                      v-if="editedIndex==-1"
                      v-model="editedItem.name"
                      label="顧客姓名"
                      :rules="[required]">
                    </v-text-field>
                    <v-text-field
                      v-else
                      v-model="editedItem.name"
                      label="顧客姓名（無法修改）"
                      readonly
                      :rules="[required]">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.address"
                      label="地址">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.homePhone"
                      label="住家電話">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.phone"
                      label="手機電話">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.contact"
                      label="聯絡人">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.taxId"
                      label="統編/身分證號碼">
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
                  :disabled="editedItem.name==''">
                  儲存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">你確定要刪掉這個客戶嗎？</v-card-title>
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
        <v-icon
          small
          @click="navigateTo({
            name: 'inwardsTrade',
            params: {
              customerName: item.name
            }
          })">
          mdi-eye
        </v-icon>
      </template>

      <template v-slot:no-data>
        <p class="ma-3">There is no data</p>
        <!-- <p class="ma-3">If you add, click the reset button</p> -->
          <!-- <v-btn
            class="mb-3"
            color="primary"
            @click="initialize">
            Reset
          </v-btn> -->
      </template>

    </v-data-table>
    </v-card>
  </titlepanel>
</template>

<script>
import Titlepanel from '../TitlePanel.vue'
import CustomerService from '@/services/inwards/CustomerService'
import RiceTradeService from '@/services/inwards/RiceTradeService'
import OtherTradeService from '@/services/inwards/OtherTradeService'

export default {
  components: { Titlepanel },
  data: () => ({
    search:'',
    date:'',
    menu:false,
    error:'',
    required: (value) => !!value || 'Required.',
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: '顧客',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: '地址', value: 'address', sortable: false},
      { text: '住家電話', value: 'homePhone', sortable: false, width: '120px'},
      { text: '手機電話', value: 'phone', sortable: false, width: '120px'},
      { text: '聯絡人', value: 'contact', sortable: false},      
      { text: '統編/身分證號碼', value: 'taxId', sortable: false, width: '130px'},
      { text: '功能', value: 'actions', sortable: false, },
    ],
    customers: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      address: '',
      phone: '',
      homePhone: '',
      contact:'',
      taxId: ''
    },
    defaultItem: {
      name: '',
      address: '',
      phone: '',
      homePhone: '',
      contact:'',
      taxId: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增顧客' : '編輯顧客'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.$loading(true)
    this.initialize()
    this.$loading(false)
  },

  methods: {
    filterOnlyCapsText (value, search, item) {
      return value != null &&
            search != null &&
            typeof value === 'string' &&
            value.toString().indexOf(search) !== -1
    },
    async serchDateCustomer(){
      this.$loading(true)
      var trades = (await OtherTradeService.indexByDates([this.date,this.date])).data
      var set = new Set()
      trades.forEach(item=>{
        set.add(item.customer_name)
      })
      // console.log(trades)

      trades = (await RiceTradeService.indexByDates([this.date,this.date])).data
      trades.forEach(item=>{
        set.add(item.customer_name)
      })
      // console.log(trades)

      this.customers = []
      for (const x of set.values()) {
        var item = (await CustomerService.get(x)).data[0]
        this.customers.push(item)
      }  
      this.customers.sort((a,b) =>{return a.name.localeCompare(b.name, "zh-Hant")})

      this.$loading(false)
    },
    
    navigateTo (route) {
      this.$router.push(route)
    },

    async initialize () {
      this.customers = (await CustomerService.index()).data
    },

    editItem (item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      this.$loading(true)
      try{
        await CustomerService.delete(this.editedItem)
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

    async save () {
      this.$loading(true)
      if (this.editedIndex > -1) {
        try{
          await CustomerService.put(this.editedItem)
          Object.assign(this.customers[this.editedIndex], this.editedItem)
        }catch(err){
          console.log(err)
        }
      } else {
        const checkSameItem = (item) => item.name == this.editedItem.name;
        if(this.customers.some(checkSameItem)) {
          this.error="你有相同的顧客名字"
          this.$loading(false)
          return
        }

        try{
          await CustomerService.post(this.editedItem)
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
