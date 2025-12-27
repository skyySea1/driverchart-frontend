import { defineStore } from 'pinia'
// todo: add hello during the login and  header
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    isLoggedIn: false,
  }),
  actions: {
    login(name: string) {
      this.name = name
      this.isLoggedIn = true
    },
    logout() {
      this.name = ''
      this.isLoggedIn = false
    }
  }
})




// <script setup lang="ts">
// import { useUserStore } from '@/stores/userStore'

// const userStore = useUserStore()

// function doLogin() {
//   userStore.login('Henri')
// }
// </script>

// <template>
//   <div v-if="userStore.isLoggedIn">
//     Olá, {{ userStore.name }}!
//   </div>
// </template>
