<template>
  <titlepanel title="出 貨 ">

    <v-card>
    <v-card-title>
      商品資訊
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="搜尋商品"
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
                新增商品
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <div v-if="editedIndex != -1">
                  <v-row>
                    <v-text-field
                      v-model="editedItem.name"
                      label="商品名稱（無法修改）"
                      readonly>
                    </v-text-field>
                  </v-row>
                  <v-row>
                      <v-text-field
                        class="pr-4"
                        v-model="editedItem.number"
                        label="數量（無法修改）"
                        readonly>
                      </v-text-field>
                      <v-select
                        v-model="editedItem.uint"
                        :items="productUints"
                        label="單位（無法修改）"
                        readonly>
                      </v-select>
                  </v-row>
                  </div>
                  <div v-else>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.name"
                      label="商品名稱"
                      :rules="[required]">
                    </v-text-field>
                  </v-row>
                  <v-row>
                      <v-text-field
                        class="pr-4"
                        v-model="editedItem.number"
                        label="數量"
                        :rules="[required]">
                      </v-text-field>
                      <v-select
                        v-model="editedItem.uint"
                        :items="productUints"
                        label="單位"
                        :rules="[required]">
                      </v-select>
                  </v-row>
                  </div>
                  <v-row>
                      <v-select
                        class="pr-4"
                        v-model="editedItem.sellUint"
                        :items="productSellUint"
                        label="販賣單位"
                        :rules="[required]">
                      </v-select>
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
                  :disabled="editedItem.name=='' || editedItem.number=='' || editedItem.uint=='' || editedItem.sellUint=='' || editedItem.price==''">
                  儲存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">你確定要刪掉這個商品嗎？</v-card-title>
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
import ProductService from '@/services/outwards/ProductService'
import SellUintService from '@/services/outwards/SellUintService'

export default {
  components: { Titlepanel },
  data: () => ({
    search:'',
    error:'',
    productUints:['公斤', '台斤', '件', '批'],
    productSellUint:[],
    required: (value) => !!value || 'Required.',
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: '商品',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: '數量', value: 'number', sortable: false},
      { text: '單位', value: 'uint', sortable: false},
      { text: '販賣單位', value: 'sellUint', sortable: false},
      { text: '單價', value: 'price', sortable: false},
      { text: '功能', value: 'actions', sortable: false }
    ],
    products: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      number: '',
      uint: '',
      sellUint: '',
      price: ''
    },
    defaultItem: {
      name: '',
      number: '',
      uint: '',
      sellUint: '',
      price: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增商品' : '編輯商品'
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

    checkInp(x){
      if (isNaN(x)){
        this.error="請輸入正確格式";
        return true;
      }
      return false;
    },
    async initialize () {
      this.products = (await ProductService.index()).data
      this.productSellUint = (await SellUintService.index()).data.map(value => value.name).sort((a,b) =>{return a.localeCompare(b, "zh-Hant")})
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

    async save () {
      this.$loading(true)
      var item = this.editedItem

      // check input is correct
      if(this.checkInp(item.number) || this.checkInp(item.price)) {
        this.$loading(false)
        return
      }
      if (this.editedIndex > -1) {
        try{
          await ProductService.put(item)
          this.initialize()
        }catch(err){
          console.log(err)
        }
      } else {
        item.full_name = `${item.name}${item.number}${item.uint}`
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
