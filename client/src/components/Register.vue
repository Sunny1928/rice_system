<template>
  <IndexHeader> 
    <v-container>
      <v-layout>
        <v-flex xs6 offset-xs3>
          <panel title="Register">
            <div class="pl-4 pr-4 pt-2 pb-2">
              <v-text-field
                label="Account"
                v-model="account"
              ></v-text-field>
              <v-text-field
                label="Password"
                type="password"
                v-model="password"
                autocomplete="new-password"
              ></v-text-field>
                <v-btn
                dark
                color="primary"
                @click="register">
                Register
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
  components: {
    Panel,IndexHeader
  },
  data () {
    return {
      account: '',
      password: '',
      error: null
    }
  },
  methods: {
    async register () {
      try {
        const response = await AuthenticationService.register({
          account: this.account,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
</style>