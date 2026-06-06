import { useState } from '#imports'

export const useGlobalLoader = () => {
  return useState<boolean>('globalLoader', () => false)
}

// When true, the loading-watcher plugin will NOT auto-dismiss the loader.
// This prevents page:finish / router.afterEach from prematurely hiding
// the loader during language switches where we need to wait for ALL
// translations to complete end-to-end before revealing the page.
export const useLanguageSwitching = () => {
  return useState<boolean>('languageSwitching', () => false)
}
