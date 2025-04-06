import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { NuxtApp } from 'nuxt/dist/app/nuxt'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia?.use(piniaPluginPersistedstate)
})

