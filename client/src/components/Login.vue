<template>
  <IndexHeader> 
    <v-container>
      <v-layout>
        <v-flex xs6 offset-xs3>
          <panel title="登入">
            <div class="pl-4 pr-4 pt-2 pb-2">
              <v-text-field
                label="帳號"
                v-model="account"
              ></v-text-field>
              <v-text-field
                label="密碼"
                type="password"
                v-model="password"
                autocomplete="new-password">
              </v-text-field>
              <div class="danger-alert" v-if="error">{{error}}</div>
              <v-btn
                dark
                color="primary"
                @click="login">
                登入
              </v-btn>
            </div>
          </panel>
        </v-flex>
      </v-layout>
    </v-container>
  </IndexHeader> 
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import Panel from './Panel.vue'
import IndexHeader from '@/components/IndexHeader.vue'

export default {
  components: { Panel, IndexHeader},
  data () {
    return {
      account: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login () {
      this.$loading(true)
      try {
        const response = await AuthenticationService.login({
          account: this.account,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.$router.push({
        name: 'root'
      })
      } catch (error) {
        this.error = error.response.data.error
      }
      this.$loading(false)
    }
  }
}
</script>
