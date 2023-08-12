<template>
  <titlepanel title="出 貨 ">
    <v-card>
    <v-card-title>
      貨運資料
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="搜尋貨運"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="transports"
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
                新增貨運
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
                      label="貨運名稱"
                      :rules="[required]">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.license"
                      label="車牌">
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.phone"
                      label="電話">
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
              <v-card-title class="text-h5">你確定要刪掉這個貨運品項嗎？</v-card-title>
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

    </v-data-table>
    </v-card>

  </titlepanel>
</template>

<script>
import Titlepanel from '../TitlePanel.vue'
import TransportService from '@/services/outwards/TransportService'

export default {
  components: { Titlepanel },
  data: () => ({
    search:'',
    error:'',
    required: (value) => !!value || 'Required.',
    dialog: false,
    dialogDelete: false,
    headers: [
      {text: '貨運名稱', align: 'start', sortable: false, value: 'name'},
      { text: '車牌', value: 'license', sortable: false},
      { text: '電話', value: 'phone', sortable: false},
      { text: '功能', value: 'actions', sortable: false },
    ],
    transports: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      address: '',
      phone: ''
    },
    defaultItem: {
      name: '',
      license: '',
      phone: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增貨運' : '編輯貨運'
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

    async initialize () {
      this.transports = (await TransportService.index()).data
    },

    editItem (item) {
      this.editedIndex = this.transports.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.transports.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    }, 


    async deleteItemConfirm () {
      this.$loading(true)
      try{
        await TransportService.delete(this.editedItem)
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
          await TransportService.put(this.editedItem)
          Object.assign(this.transports[this.editedIndex], this.editedItem)
        }catch(err){
          console.log(err)
        }
      } else {
        const checkSameItem = (item) => item.name == this.editedItem.name;
        if(this.transports.some(checkSameItem)) {
          this.error="你有相同的貨運名字"
          this.$loading(false)
          return
        }
        
        try{
          await TransportService.post(this.editedItem)
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
