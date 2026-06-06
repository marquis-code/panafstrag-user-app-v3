import { defineNuxtPlugin, useRouter } from '#app'
import { useGlobalLoader, useLanguageSwitching } from '@/composables/useGlobalLoader'

export default defineNuxtPlugin((nuxtApp) => {
  const isLoading = useGlobalLoader()
  const isLanguageSwitching = useLanguageSwitching()
  const router = useRouter()

  // Aggressive overlay on page start
  nuxtApp.hook('page:start', () => {
    isLoading.value = true
  })

  // Remove overlay only when page finishes rendering
  // BUT NOT during a language switch — the LanguageSwitcher controls dismissal
  nuxtApp.hook('page:finish', () => {
    if (isLanguageSwitching.value) return
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
    if (isLanguageSwitching.value) return
    setTimeout(() => {
      isLoading.value = false
    }, 400)
  })
})
