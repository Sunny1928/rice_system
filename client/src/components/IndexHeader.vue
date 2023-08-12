<template>
  <v-container>
    <div class="t1">
      <v-app-bar fixed color="primary" dark>
        <v-app-bar-title class="mr-4">
          <router-link 
            class="btn_top"
            tag="span"
            :to="{
              name: 'root'
            }">
            年昌米廠
          </router-link>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <div v-if="$store.state.isUserLoggedIn"
            class="d-flex">    
          <v-menu
            offset-y
            open-on-hover>
            <template v-slot:activator="{ on }">
              <p
                class="btn_top mr-4 ml-4"
                plain
                v-on="on">
                進貨系統
            </p>
            </template>


            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <router-link
                    class="link" 
                    :to="{
                      name: 'inwardsCustomer'
                    }">
                    顧客
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link 
                    class="link" 
                    :to="{
                    name: 'inwardsRicekind'
                    }">
                    米的種類
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link 
                    class="link" 
                    :to="{
                    name: 'inwardsProduct'
                    }">
                    商品
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link 
                    class="link" 
                    :to="{
                      name: 'inwardsTrade',
                      params:{
                        customerName: 'null'
                      }
                    }"
                    @click.native="$router.go()">
                    進貨交易
                  </router-link>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu
            offset-y
            open-on-hover>
            <template v-slot:activator="{ on }">
              <p
                class="btn_top mr-4 ml-4"
                plain
                v-on="on">
                出貨系統
            </p>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title>
                  <router-link
                    class="link" 
                    :to="{
                      name: 'customer'
                    }">
                    顧客
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link 
                    class="link" 
                    :to="{
                    name: 'product'
                    }">
                    商品
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link 
                    class="link" 
                    :to="{
                    name: 'sellUint'
                    }">
                    販賣單位
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link 
                    class="link" 
                    :to="{
                    name: 'cashMethod'
                    }">
                    入帳方式
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link 
                    class="link" 
                    :to="{
                    name: 'transport'
                    }">
                    貨運
                  </router-link>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  <router-link 
                    class="link" 
                    :to="{
                      name: 'trade',
                      params:{
                        customerName: 'null'
                      }
                    }"
                    @click.native="$router.go()">
                    出貨交易
                  </router-link>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
            
        <v-spacer></v-spacer>

        <div>
          <router-link 
            v-if="!$store.state.isUserLoggedIn"
            tag="span"
            class="btn_top"
            :to="{
              name: 'login'
            }">
            登入
          </router-link>
          
          <p 
            v-if="$store.state.isUserLoggedIn"
            class="btn_top"
            @click="logout">
            登出
          </p>
        </div>
      </v-app-bar>

      <v-container>

        <slot>
          No slot content defined.
        </slot>
        
      </v-container>
    </div>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods:{
    logout(){
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style scoped>
.link{
  text-decoration: none;
  color: inherit;
}
.t1{
  margin-top: 50px;
}

.btn_top{
  color: #FFEE58;
  font-size: 22px;
  margin: 10px;
  font-weight: bold;
  cursor: pointer;
}

.btn_top:hover {
  font-weight: bold;
  color: rgb(255, 250, 210);
}
</style>
