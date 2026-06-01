import { defineNuxtPlugin, useRouter } from '#app'
import { useGlobalLoader } from '@/composables/useGlobalLoader'

export default defineNuxtPlugin((nuxtApp) => {
  const isLoading = useGlobalLoader()
  const router = useRouter()

  // Aggressive overlay on page start
  nuxtApp.hook('page:start', () => {
    isLoading.value = true
  })

  // Remove overlay only when page finishes rendering
  nuxtApp.hook('page:finish', () => {
    // Adding a 400ms delay ensures any API responses and translation interpolations 
    // are fully painted to the DOM before revealing the page.
    setTimeout(() => {
      isLoading.value = false
    }, 400)
  })

  // Fallback router hooks in case page:start/finish miss certain client navigations
  router.beforeEach((to, from, next) => {
    if (to.path !== from.path) {
      isLoading.value = true
    }
    next()
  })

  router.afterEach(() => {
    setTimeout(() => {
      isLoading.value = false
    }, 400)
  })
})
