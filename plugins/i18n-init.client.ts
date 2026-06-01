import { defineNuxtPlugin } from '#app'
import { useI18n } from '@/composables/useI18n'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { initLocale } = useI18n()
  
  // We call this immediately on app start to fetch geolocation 
  // before the initial loader is fully removed
  await initLocale()
})
