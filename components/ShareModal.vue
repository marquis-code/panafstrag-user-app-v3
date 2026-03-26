<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Share Programme'
  },
  program: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const shareUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/programs/${props.program?._id || ''}`
  }
  return ''
})

const shareText = computed(() => {
  return `Check out this PANAFSTRAG Programme: ${props.program?.title || ''}`
})

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    alert('Link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy link', err)
  }
}

const shareFacebook = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`, '_blank')
}

const shareTwitter = () => {
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(shareText.value)}`, '_blank')
}

const shareLinkedIn = () => {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`, '_blank')
}

const shareWhatsApp = () => {
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText.value + ' ' + shareUrl.value)}`, '_blank')
}
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        @click="close"
      ></div>

      <!-- Modal -->
      <div 
        class="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden transform transition-all scale-100"
      >
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
          <button 
            @click="close"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-4 gap-4 mb-6">
            <button @click="shareWhatsApp" class="flex flex-col items-center gap-2 group">
              <div class="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <span class="text-xs font-medium text-gray-600 group-hover:text-gray-900">WhatsApp</span>
            </button>

            <button @click="shareTwitter" class="flex flex-col items-center gap-2 group">
              <div class="w-12 h-12 rounded-full bg-black/5 text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
              </div>
              <span class="text-xs font-medium text-gray-600 group-hover:text-gray-900">X (Twitter)</span>
            </button>

            <button @click="shareLinkedIn" class="flex flex-col items-center gap-2 group">
              <div class="w-12 h-12 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center group-hover:bg-[#0A66C2] group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </div>
              <span class="text-xs font-medium text-gray-600 group-hover:text-gray-900">LinkedIn</span>
            </button>

            <button @click="shareFacebook" class="flex flex-col items-center gap-2 group">
              <div class="w-12 h-12 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </div>
              <span class="text-xs font-medium text-gray-600 group-hover:text-gray-900">Facebook</span>
            </button>
          </div>

          <div class="relative">
            <div class="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">
              <input 
                type="text" 
                readonly 
                :value="shareUrl" 
                class="flex-1 bg-transparent border-none text-xs text-gray-500 focus:ring-0 truncate"
              >
              <button 
                @click="copyLink"
                class="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
