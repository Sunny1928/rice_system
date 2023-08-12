<template>
  <titlepanel title="進 貨 ">
    <div class="white">
      <div class="subTitle">
        <b>米銷貨篩選條件</b>
      </div>
      <v-row>
        <v-col
          cols="12"
          md="3">
          <v-autocomplete
            v-model="searchRicekind"
            :items="ricekindNames"
            label="產品選項"
            dense
            outlined
            solo/>
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
                @click="$refs.menu.save(dates); dateRangeText();">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>

        <v-col
          cols="12"
          md="1"
          class="pt-3">
          <v-btn
            class="d-flex"
            :disabled = "searchRicekind == '' || dates == null"
            @click="calculateSum">
            搜尋
          </v-btn>
        </v-col>

        <v-col
          v-if="searchRicekind != ''"
          cols="12"
          md="5"
          class="pl-0 d-flex flex-row ">
          <div>
            <b class="text1">{{this.searchRicekind}}進貨{{this.sum}}份</b>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-card>
    <v-card-title>
      米的種類資料
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="搜尋米的種類"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="ricekinds"
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
                新增米項目
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
                      v-model="editedItem.name"
                      label="米項目名稱"
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
                  :disabled="editedItem.name==''">
                  儲存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">你確定要刪掉這個米項目嗎？</v-card-title>
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

    </v-data-table>
    </v-card>

  </titlepanel>
</template>

<script>
import Titlepanel from '../TitlePanel.vue'
import RicekindService from '@/services/inwards/RicekindService'
import RiceTradeService from '@/services/inwards/RiceTradeService'

export default {
  components: { Titlepanel },
  data: () => ({
    search:'',
    error: '',
    sum: 0,
    today: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    dateText: '',
    dates: [],
    menu: false,
    
    searchRicekind:'',
    required: (value) => !!value || 'Required.',
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: '米項目名',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: '功能', value: 'actions', sortable: false },
    ],
    ricekinds: [],
    ricekindNames: [],
    editedIndex: -1,
    editedItem: {
      name: '',
    },
    defaultItem: {
      name: '',
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增米項目' : '編輯米項目'
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

    async calculateSum(){
      this.$loading(true)
      this.sum = 0
      var startDate = new Date(`${this.dates[0]}T00:00:00`)
      var endDate = new Date(`${this.dates[1]}T24:00:00`)
      var allItems = (await RiceTradeService.getAllItemsByRicekind(this.searchRicekind, startDate.toISOString()+','+endDate.toISOString())).data
      // console.log(allItems)
      
      allItems.forEach(item=>{
        if(item.turn_id == -1){
          this.sum+=item.in
          this.sum-=item.out
        }
      })
      this.$loading(false)

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


    async initialize () {
      this.ricekinds = (await RicekindService.index()).data
      this.ricekindNames = this.ricekinds.map(value => value.name)

      // get dates range
      var date = new Date(this.today)
      date.setDate(date.getDate() - 30);
      this.dates[0] = date.toISOString().substr(0, 10)
      this.dates[1] = this.today
      this.dateRangeText()
    },

    deleteItem (item) {
      this.editedIndex = this.ricekinds.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      this.$loading(true)
      try{
        await RicekindService.delete(this.editedItem)
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
      
      const checkSameItem = (item) => item == this.editedItem.name;
      if(this.ricekindNames.some(checkSameItem)) {
        this.error="你已經有這個品項了"
        this.$loading(false)
        return
      }

      try{
        await RicekindService.post(this.editedItem)
      }catch(err){
        console.log(err)
      }

      this.initialize()
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