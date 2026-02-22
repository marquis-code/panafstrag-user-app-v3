<template>
  <div class="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
    <!-- Chat Window -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-8 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-8 scale-95"
    >
      <div v-if="isOpen" class="w-[24rem] h-[32rem] bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-6">
        <!-- Header -->
        <div class="px-8 py-6 bg-black text-white flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
            <h3 class="font-black text-[10px] uppercase tracking-[0.2em]">Institutional <span class="text-gray-400">Sync</span></h3>
          </div>
          <button @click="isOpen = false" class="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Messages -->
        <div ref="messageContainer" class="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
          <div v-for="msg in (messages as any[])" :key="msg._id" :class="['flex flex-col', (msg.sender as any)._id === user?._id ? 'items-end' : 'items-start']">
            <div :class="['max-w-[85%] px-5 py-3 rounded-xl text-sm font-medium shadow-sm border',
              (msg.sender as any)._id === user?._id
                ? 'bg-black text-white border-black rounded-tr-none'
                : 'bg-white text-gray-800 border-gray-100 rounded-tl-none']">
              {{ msg.content }}
            </div>
            <span class="text-[9px] font-black text-gray-400 mt-2 uppercase tracking-widest italic">{{ msg.sender.name }}</span>
          </div>
        </div>

        <!-- Input -->
        <div class="p-6 bg-white border-t border-gray-100">
          <div class="flex gap-3">
            <input
              v-model="newMessage"
              @keyup.enter="handleSend"
              placeholder="Enter message..."
              class="flex-1 px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:border-black focus:ring-0 outline-none transition-all placeholder:text-gray-300"
            />
            <button @click="handleSend" class="p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Trigger Button -->
    <button
      @click="toggleChat"
      class="w-16 h-16 bg-black text-white rounded-2xl shadow-2xl flex items-center justify-center hover:-translate-y-2 active:scale-90 transition-all group overflow-hidden relative"
    >
      <div class="absolute inset-0 bg-white/5 group-hover:scale-150 transition-transform duration-1000 rounded-full blur-2xl"></div>
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useChat } from '@/composables/useChat'
import { useUser } from '@/composables/modules/auth/user'
const { messages, connect, sendMessage, isConnected } = useChat()
const { user, token } = useUser()
const isLoggedIn = computed(() => !!token.value)
const isOpen = ref(false)
const newMessage = ref('')
const messageContainer = ref<HTMLElement | null>(null)

const toggleChat = () => {
  if (!isLoggedIn.value) {
    navigateTo('/login')
    return
  }
  isOpen.value = !isOpen.value
  if (isOpen.value && !isConnected.value) {
    connect()
  }
}

const handleSend = () => {
  if (newMessage.value.trim()) {
    sendMessage(newMessage.value)
    newMessage.value = ''
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>
