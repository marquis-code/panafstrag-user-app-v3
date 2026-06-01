import { useState } from '#imports'

export const useGlobalLoader = () => {
  return useState<boolean>('globalLoader', () => false)
}
