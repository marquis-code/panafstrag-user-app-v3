<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0 backdrop-blur-none"
    enter-to-class="opacity-100 backdrop-blur-xl"
    leave-active-class="transition duration-700 ease-in"
    leave-from-class="opacity-100 backdrop-blur-xl"
    leave-to-class="opacity-0 backdrop-blur-none"
  >
    <div v-if="isLoading" class="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-2xl flex flex-col items-center justify-center">
      <div class="relative flex flex-col items-center">
        <!-- Outer pulsing rings -->
        <div class="absolute inset-0 border-4 border-[#2E7D32]/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] scale-150"></div>
        <div class="absolute inset-0 border-4 border-[#2E7D32]/10 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] scale-110 delay-150"></div>

        <!-- Logo Container -->
        <div class="w-24 h-24 bg-gradient-to-br from-[#1A3A1C] to-[#2E7D32] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#2E7D32]/30 relative z-10 overflow-hidden group">
          <!-- Shine effect -->
          <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          
          <span class="text-5xl font-black text-white tracking-tighter">P</span>
        </div>

        <!-- Loading Text -->
        <div class="mt-8 flex flex-col items-center gap-2">
          <p class="text-sm font-black text-gray-900 tracking-[0.2em] uppercase animate-pulse">
            {{ t('Translating') || 'Translating' }}
          </p>
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 bg-[#2E7D32] rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-1.5 h-1.5 bg-[#2E7D32] rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-1.5 h-1.5 bg-[#2E7D32] rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useGlobalLoader } from '@/composables/useGlobalLoader'
import { useI18n } from '@/composables/useI18n'

const isLoading = useGlobalLoader()
const { t } = useI18n()
</script>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
