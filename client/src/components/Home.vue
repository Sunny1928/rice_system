<template>
  <IndexHeader>
    <v-container v-if="!$store.state.isUserLoggedIn">
      你尚未登入
    </v-container>

    <v-container v-else>
      <v-layout class="ml-4 mr-4">
        <v-flex xs12 offset-xs0>
          <v-row>
            <v-col
              cols="12"
              md="6">
              <v-btn
                color="primary"
                class="d-flex align-center"
                dark
                height="300"
                :to="{
                  name: 'inwards'
                }">
                <h2>進貨</h2>
              </v-btn>
            </v-col>
            <v-col
              cols="12"
              md="6">
              <v-btn
                color="primary"
                class=" d-flex align-center"
                dark
                height="300"
                :to="{
                  name: 'outwards'
                }">
                <h2>出貨</h2>
              </v-btn>
            </v-col>
          </v-row>

          <div
            class="border">
            <v-row
              class="title">
              <h3>其他功能</h3>
            </v-row>
            <v-row
              justify="center"
              align="center"
              class="ma-3 ">
              <v-col
                cols="12"
                md="6">
                <b>列印所有交易資料</b>
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
                      @click="$refs.menu.save(dates); getTrades();">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
                <div class="danger-alert">
                  {{error}}
                </div>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="pa-6">
                <v-row>
                  <download-excel
                    class="btn mr-2"
                    :header="`出貨交易紀錄`"
                    :data="outward_trades"
                    :fields="outward_json_fields"
                    worksheet="出貨統計"
                    :name="dateText+'出貨交易.xls'">
                    下載出貨交易Excel
                  </download-excel>
                  <v-btn
                    class="mb-2 "
                    @click="printAllReceipt">
                    列印出貨交易
                  </v-btn>
                </v-row>
                <v-row>
                  <download-excel
                    class="btn mr-2"
                    :header="`糧食交易紀錄`"
                    :data="inward_rice_trades"
                    :fields="inward_rice_json_fields"
                    worksheet="糧食交易紀錄統計"
                    :name="dateText+'糧食交易紀錄.xls'">
                    下載糧食交易Excel
                  </download-excel>
                  <v-btn
                    class="mb-2 "
                    @click="printInwardRiceReceipt">
                    列印糧食進出交易
                  </v-btn>
                </v-row>
                <v-row>
                  <download-excel
                    class="btn mr-2"
                    :header="`客戶往來交易紀錄`"
                    :data="inward_trades"
                    :fields="inward_json_fields"
                    worksheet="客戶往來交易紀錄"
                    :name="dateText+'客戶往來交易紀錄.xls'">
                    下載客戶往來交易Excel
                  </download-excel>
                  <v-btn
                    class="mb-2 "
                    @click="printInwardReceipt">
                    列印客戶往來交易
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </IndexHeader>
</template>

<script>
import IndexHeader from '@/components/IndexHeader.vue'
import TradeService from '@/services/outwards/TradeService'
import OtherTradeService from '@/services/inwards/OtherTradeService'
import RiceTradeService from '@/services/inwards/RiceTradeService'

export default {
  components: { IndexHeader},
  data() {
    return{
      error:'',
      menu:false,
      dates:[],
      dateText:'',
      outward_json_fields: {
        顧客: "customer_name",
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
      inward_json_fields: {
        顧客: "customer_name",
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
      inward_rice_json_fields: {
        顧客: "customer_name",
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
      outward_trades:[],
      inward_rice_trades:[],
      inward_trades:[],
    }
  },
  methods: {
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
    async getTrades(){
      this.dateRangeText()
      this.outward_trades = (await TradeService.indexByDates(this.dates[0]+','+this.dates[1])).data
      // console.log(this.outward_trades)
      this.inward_trades = (await OtherTradeService.indexByDates(this.dates[0]+','+this.dates[1])).data
      // console.log(this.inward_trades)
      this.inward_rice_trades = (await RiceTradeService.indexByDates(this.dates[0]+','+this.dates[1])).data
      // console.log(this.inward_rice_trades)
      this.error=""
      if(this.outward_trades.length == 0) this.error+="此時段無出貨交易資料\n"
      if(this.inward_rice_trades.length == 0) this.error+="此時段無糧食交易資料\n"
      if(this.inward_trades.length == 0) this.error+="此時段無客戶往來交易資料\n"
    },
    printAllReceipt(){
      let routeData = this.$router.resolve({
        name: 'printOutwardsAllTrade', 
        query: {
          all: true,
          formerSum:0,
          sum: 0,
          weight: 0
        }
      })
      this.$store.dispatch('setPrintData', this.outward_trades)
      this.$store.dispatch('setPrintCustomer', null)
      window.open(routeData.href, '_blank')
    },
    printInwardReceipt(){
      let routeData = this.$router.resolve({
        name: 'printInwardsOtherTrade', 
        query: {
          all: true,
        }
      })
      this.$store.dispatch('setPrintData', this.inward_trades)
      this.$store.dispatch('setPrintCustomer', null)
      window.open(routeData.href, '_blank')
    },
    printInwardRiceReceipt(){
      let routeData = this.$router.resolve({
        name: 'printInwardsTrade', 
        query: {
          all: true
        }
      });
      this.$store.dispatch('setPrintData', this.inward_rice_trades)
      this.$store.dispatch('setPrintCustomer', this.customerInfo)
      window.open(routeData.href, '_blank')
    },

  }, 
}
</script>

<style scoped>
.col-12{
  padding: 12px 6px;
}

.title{
  background: #1976D2;
  color: #fff;
  padding: 6px 10px;
  margin: 0 auto;
  text-align: center;
}
.border{
  margin-top: 30px;
  border: solid 3px #1976D2;
  border-radius: 5px;
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
</style>