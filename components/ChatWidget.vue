<template>
  <div
    class="fixed z-[100] flex flex-col items-end"
    :style="isFullScreen ? { top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' } : { bottom: widgetPos.y + 'px', right: widgetPos.x + 'px' }"
  >
    <!-- Chat Window -->
    <Transition
      enter-active-class="transition duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
      enter-from-class="opacity-0 translate-y-12 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-12 scale-90"
    >
      <div
        v-if="isOpen"
        :class="[
          'bg-white flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-black/5 transition-all duration-500',
          isFullScreen
            ? 'fixed inset-0 w-full h-full rounded-none z-[200]'
            : 'fixed bottom-4 right-4 left-4 top-4 sm:relative sm:inset-auto sm:w-[24rem] sm:h-[36rem] rounded-3xl sm:mb-6 sm:z-auto'
        ]"
      >
        <!-- ========== VIEW 1: Welcome / Call or Chat ========== -->
        <template v-if="currentView === 'welcome'">
          <div class="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#075e54] to-[#128c7e] text-white p-8 text-center relative overflow-hidden">
            <div class="absolute inset-0 bg-black/10 pointer-events-none"></div>
            <div class="relative z-10 flex flex-col items-center">
              <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-5">
                <span class="text-3xl font-black text-[#075e54] italic">P</span>
              </div>
              <h3 class="text-lg font-bold mb-2">PANAFSTRAG</h3>
              <p class="text-sm text-white/80 leading-relaxed max-w-[16rem]">We are here to help you! Call or chat to connect with us right away.</p>
            </div>
          </div>
          <div class="p-6 bg-white flex items-center justify-center gap-10">
            <button @click="handleCallClick" class="flex flex-col items-center gap-2 group">
              <div class="w-14 h-14 bg-[#075e54] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">Call</span>
            </button>
            <button @click="currentView = 'identify'" class="flex flex-col items-center gap-2 group">
              <div class="w-14 h-14 bg-[#25d366] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">Chat</span>
            </button>
          </div>
        </template>

        <!-- ========== VIEW 2: Identification Form ========== -->
        <template v-else-if="currentView === 'identify'">
          <div class="px-5 py-4 bg-[#075e54] text-white flex items-center gap-3 shadow-md">
            <button @click="currentView = 'welcome'" class="p-1 hover:bg-white/10 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div class="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center border border-white/10">
              <span class="text-sm font-black italic">P</span>
            </div>
            <h3 class="font-bold text-sm">Chat with us now</h3>
          </div>
          <div class="flex-1 p-6 space-y-4 bg-gray-50 overflow-y-auto">
            <input v-model="guest.name" placeholder="Enter your name (required)" class="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#075e54] focus:ring-1 focus:ring-[#075e54]/20 transition-all" />
            <input v-model="guest.email" type="email" placeholder="Enter your email address (required)" class="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#075e54] focus:ring-1 focus:ring-[#075e54]/20 transition-all" />
            <input v-model="guest.phone" placeholder="Enter your phone number (optional)" class="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#075e54] focus:ring-1 focus:ring-[#075e54]/20 transition-all" />
            <textarea v-model="firstMessage" rows="3" placeholder="Type your message..." class="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#075e54] focus:ring-1 focus:ring-[#075e54]/20 transition-all resize-none"></textarea>
          </div>
          <div class="p-4 bg-white border-t border-gray-100">
            <button @click="startChatSession" :disabled="!guest.name || !guest.email || !firstMessage" class="w-full py-3.5 bg-[#075e54] text-white text-sm font-bold rounded-xl hover:bg-[#054c44] transition-all shadow-lg active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              Start Chat
            </button>
          </div>
        </template>

        <!-- ========== VIEW 3: Active Chat ========== -->
        <template v-else-if="currentView === 'chat'">
          <div class="px-5 py-4 bg-[#075e54] text-white flex items-center justify-between shadow-md z-10">
            <div class="flex items-center gap-3">
              <button @click="currentView = 'welcome'; isFullScreen = false" class="p-1 hover:bg-white/10 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div class="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center border border-white/10 relative">
                <span class="text-sm font-black italic">P</span>
                <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#075e54] rounded-full"></div>
              </div>
              <div>
                <h3 class="font-bold text-sm leading-tight">PANAFSTRAG</h3>
                <p class="text-[10px] text-white/70 font-medium">
                  {{ isTyping ? `${isTyping.name} is typing...` : 'Online' }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <!-- Full-screen toggle -->
              <button @click="isFullScreen = !isFullScreen" class="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block" title="Toggle full screen">
                <svg v-if="!isFullScreen" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" /></svg>
              </button>
              <button @click="isOpen = false; isFullScreen = false" class="p-2 hover:bg-white/10 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div ref="messageContainer" class="flex-1 overflow-y-auto p-4 space-y-2 relative custom-scrollbar bg-[#e5ddd5]">
            <div class="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8d974919620ba25.jpg')] bg-repeat"></div>
            <div v-for="(msg, index) in displayMessages" :key="msg._id || index" :class="['flex relative z-10', isOwnMessage(msg) ? 'justify-end' : 'justify-start']">
              <div :class="['max-w-[85%] sm:max-w-[65%] px-3 py-2 rounded-lg shadow-sm relative',
                isOwnMessage(msg) ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none']">
                <div v-if="isOwnMessage(msg)" class="absolute top-0 -right-2 w-0 h-0 border-t-[8px] border-t-[#d9fdd3] border-r-[8px] border-r-transparent"></div>
                <div v-else class="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent"></div>
                <p v-if="!isOwnMessage(msg) && msg.isBot" class="text-[11px] font-semibold text-[#075e54] mb-0.5">🤖 PANAFSTRAG Bot</p>
                <p v-else-if="!isOwnMessage(msg)" class="text-[11px] font-semibold text-[#075e54] mb-0.5">PANAFSTRAG Admin</p>
                <div v-if="msg.type === 'image'" class="mb-1 rounded-md overflow-hidden">
                  <img :src="msg.imageUrl" alt="Attachment" class="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity" @click="openImage(msg.imageUrl)" />
                </div>
                <p class="text-[14px] text-gray-800 leading-snug">{{ msg.content }}</p>
                <!-- Quick reply buttons for bot -->
                <div v-if="msg.quickReplies && msg.quickReplies.length" class="flex flex-wrap gap-2 mt-2">
                  <button v-for="qr in msg.quickReplies" :key="qr" @click="sendQuickReply(qr)" class="px-3 py-1.5 bg-[#075e54]/10 text-[#075e54] text-xs font-semibold rounded-full border border-[#075e54]/20 hover:bg-[#075e54] hover:text-white transition-all">
                    {{ qr }}
                  </button>
                </div>
                <div class="flex items-center justify-end gap-1 mt-1">
                  <span class="text-[11px] text-gray-500">{{ formatTime(msg.createdAt || new Date().toISOString()) }}</span>
                  <svg v-if="isOwnMessage(msg)" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-[#53bdeb]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
            </div>
            <!-- Typing indicator -->
            <div v-if="botTyping" class="flex justify-start relative z-10">
              <div class="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                <div class="flex gap-1">
                  <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                  <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="p-3 bg-[#f0f0f0] flex items-center gap-2 relative z-10">
            <div class="flex-1 flex items-center bg-white rounded-full px-4 py-1.5 shadow-sm border border-gray-200">
              <button @click="triggerFileInput" class="p-1.5 text-gray-500 hover:text-[#075e54] transition-colors rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              </button>
              <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload" />
              <input v-model="newMessage" @keypress="handleTyping" @keyup.enter="handleSend" placeholder="Type a message..." class="flex-1 px-2 py-1 bg-transparent text-sm focus:ring-0 outline-none font-medium" />
            </div>
            <button @click="handleSend" :disabled="!newMessage.trim()" class="w-11 h-11 bg-[#075e54] text-white rounded-full flex items-center justify-center hover:bg-[#054c44] transition-all active:scale-95 shadow-lg disabled:opacity-20">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </template>
      </div>
    </Transition>

    <!-- Automated Message Tooltip -->
    <Transition
      enter-active-class="transition duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
      enter-from-class="opacity-0 translate-y-4 scale-75"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-75"
    >
      <div 
        v-if="showTooltip && !isOpen && !isFullScreen" 
        class="mb-4 mr-2 bg-white px-6 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 max-w-[280px] relative animate-float pointer-events-auto cursor-pointer group"
        @click="openFromTooltip"
      >
        <div class="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 border-r border-b border-gray-100"></div>
        <div class="flex items-center gap-3 mb-2">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="text-[10px] font-black uppercase tracking-widest text-[#075e54]">Panafstrag Support</span>
        </div>
        <p class="text-xs text-gray-700 font-medium leading-relaxed italic line-clamp-2">"{{ tooltipMessage }}"</p>
        <div class="mt-2 flex items-center gap-1 text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#075e54] transition-colors">
          Click to reply
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </div>
      </div>
    </Transition>

    <!-- Trigger Button (Draggable) — hidden when fullscreen -->
    <button
      v-if="!isFullScreen"
      @mousedown="startDrag"
      @touchstart.passive="startDrag"
      @click.prevent="handleTriggerClick"
      class="w-16 h-16 bg-[#25d366] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all group relative z-[101] cursor-grab active:cursor-grabbing select-none"
    >
      <div class="absolute inset-0 bg-white/20 animate-ping rounded-full" v-if="!isOpen"></div>
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884 0 2.225.569 3.807 1.258 5.275l-.547 2.001 2.115-.555-.227-.12z" /></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useChat } from '@/composables/useChat'
import { useUser } from '@/composables/modules/auth/user'

const config = useRuntimeConfig()
const route = useRoute()
const { messages, connect, sendMessage, isConnected, isTyping, setTyping } = useChat()
const { user, token } = useUser()

const isLoggedIn = computed(() => !!token.value)
const isOpen = ref(false)
const isFullScreen = ref(false)
const newMessage = ref('')
const firstMessage = ref('')
const guestIdentified = ref(false)
const guest = reactive({ name: '', email: '', phone: '' })
const currentView = ref<'welcome' | 'identify' | 'chat'>('welcome')
const messageContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const typingTimeout = ref<any>(null)
const botTyping = ref(false)
const botMessages = ref<any[]>([])
const hasAutoGreeted = ref(false)
const showTooltip = ref(false)
const tooltipMessage = ref('')
const tooltipTimeout = ref<any>(null)

const openFromTooltip = () => {
  showTooltip.value = false
  isOpen.value = true
}

// ======= Dynamic Bot Config & Tracking =======
const botConfigs = ref<any[]>([])
const sessionId = ref('')

const fetchBotConfigs = async () => {
  try {
    const data = await $fetch<any[]>(`${config.public.apiBase}/chat/bot-configs/active`)
    botConfigs.value = data || []
  } catch (err) { console.error('Failed to fetch bot configs', err) }
}

const trackActivity = (eventStr: string, pagePath: string, meta: any = {}) => {
  try {
    const gName = isLoggedIn.value ? (user.value as any)?.name : guest.name
    const gEmail = isLoggedIn.value ? (user.value as any)?.email : guest.email
    $fetch(`${config.public.apiBase}/chat/activities`, {
      method: 'POST',
      body: {
        sessionId: sessionId.value,
        guestName: gName,
        guestEmail: gEmail,
        event: eventStr,
        page: pagePath,
        metadata: meta,
        userAgent: navigator?.userAgent
      }
    })
  } catch (e) {}
}

const initSession = () => {
  if (isLoggedIn.value) sessionId.value = (user.value as any)?._id || 'user_session'
  else {
    let sid = localStorage.getItem('visitor_session_id')
    if (!sid) { sid = 'vis_' + Math.random().toString(36).substring(2, 10); localStorage.setItem('visitor_session_id', sid) }
    sessionId.value = sid
  }
}


// Combine real messages + bot messages for display
const displayMessages = computed(() => {
  const all = [...botMessages.value, ...messages.value]
  return all.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
})

const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

// ======= Bot Logic =======
const addBotMessage = (content: string, quickReplies: string[] = [], delay = 1200) => {
  // If closed, show as tooltip
  if (!isOpen.value && !isFullScreen.value) {
    tooltipMessage.value = content
    showTooltip.value = true
    if (tooltipTimeout.value) clearTimeout(tooltipTimeout.value)
    tooltipTimeout.value = setTimeout(() => {
      // Keep it visible unless another one comes or user closes
    }, 10000)
  }

  botTyping.value = true
  scrollToBottom()
  setTimeout(() => {
    botTyping.value = false
    botMessages.value.push({
      _id: `bot_${Date.now()}_${Math.random()}`,
      content,
      isAdmin: true,
      isBot: true,
      quickReplies,
      createdAt: new Date().toISOString(),
      type: 'text'
    })
    scrollToBottom()
  }, delay)
}

const getBotResponse = (userMsg: string): { message: string, quickReplies?: string[] } | null => {
  const lower = userMsg.toLowerCase()
  const faqs = botConfigs.value.filter(c => c.type === 'faq').sort((a,b) => b.priority - a.priority)
  
  for (const faq of faqs) {
    if (faq.keywords && faq.keywords.some((k: string) => lower.includes(k.toLowerCase()))) {
      return { message: faq.message, quickReplies: faq.quickReplies }
    }
  }
  return null
}

const triggerBotReply = (userContent: string) => {
  const response = getBotResponse(userContent)
  if (response) {
    addBotMessage(response.message, response.quickReplies, 1200)
  } else {
    // Fallback
    const fallback = botConfigs.value.find(c => c.type === 'fallback')
    if (fallback) addBotMessage(fallback.message, fallback.quickReplies, 1500)
    else addBotMessage("Thanks for your message! Our team will respond shortly.", [], 1500)
  }
}

const sendQuickReply = (text: string) => {
  const guestInfo = !isLoggedIn.value ? { name: guest.name, email: guest.email } : undefined
  if (isConnected.value) {
    sendMessage(text, 'text', undefined, guestInfo)
  } else {
    // Add as local message if not connected
    botMessages.value.push({ _id: `user_${Date.now()}`, content: text, isAdmin: false, createdAt: new Date().toISOString(), type: 'text' })
  }
  triggerBotReply(text)
  scrollToBottom()
}

// ======= Auto-Greeting & Initial Setup =======
onMounted(() => {
  initSession()
  fetchBotConfigs().then(() => {
    trackActivity('session_start', route.path)
    trackActivity('page_visit', route.path)
    
    const savedGuest = localStorage.getItem('chat_guest_info')
    if (savedGuest) {
      try {
        const parsed = JSON.parse(savedGuest)
        guest.name = parsed.name
        guest.email = parsed.email
        guest.phone = parsed.phone || ''
        guestIdentified.value = true
        currentView.value = 'chat'
        connect(guest)
      } catch { localStorage.removeItem('chat_guest_info') }
    }
    if (isLoggedIn.value) { currentView.value = 'chat'; connect() }

    // Auto-greeting after delay
    const greeted = sessionStorage.getItem('chat_auto_greeted')
    const welcomeCfg = botConfigs.value.find(c => c.type === 'greeting')
    if (!greeted && welcomeCfg) {
      setTimeout(() => {
        if (!isOpen.value && !hasAutoGreeted.value) {
          hasAutoGreeted.value = true
          sessionStorage.setItem('chat_auto_greeted', 'true')
          // Instead of opening full chat, add bot message which triggers tooltip
          addBotMessage(welcomeCfg.message, welcomeCfg.quickReplies, 800)
        }
      }, welcomeCfg.delayMs || 5000)
    }
  })
})

// ======= Bot trigger & tracking on page navigation =======
watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    trackActivity('page_visit', newPath)
    
    if (!isOpen.value) {
      const pageCfgs = botConfigs.value.filter(c => c.type === 'page_trigger').sort((a,b) => b.priority - a.priority)
      const matchedGreet = pageCfgs.find(c => newPath.startsWith(c.pagePath))
      if (matchedGreet) {
        // Prevent spamming triggers for the same page
        const triggerKey = `chat_trig_${matchedGreet.key}`
        if (!sessionStorage.getItem(triggerKey)) {
          sessionStorage.setItem(triggerKey, 'true')
          setTimeout(() => {
            if (!isOpen.value) {
              addBotMessage(matchedGreet.message, matchedGreet.quickReplies, 1000)
            }
          }, matchedGreet.delayMs || 2000)
        }
      }
    }
  }
})

// ======= Drag State =======
const widgetPos = reactive({ x: 32, y: 32 })
const dragState = reactive({ isDragging: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0, moved: false })

const startDrag = (e: MouseEvent | TouchEvent) => {
  const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX
  const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY
  dragState.isDragging = true; dragState.moved = false
  dragState.startX = clientX; dragState.startY = clientY
  dragState.startPosX = widgetPos.x; dragState.startPosY = widgetPos.y
  document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', endDrag)
  document.addEventListener('touchmove', onDrag, { passive: false }); document.addEventListener('touchend', endDrag)
}
const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!dragState.isDragging) return
  const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX
  const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY
  const dx = dragState.startX - clientX; const dy = dragState.startY - clientY
  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragState.moved = true
  widgetPos.x = Math.max(8, Math.min(window.innerWidth - 80, dragState.startPosX + dx))
  widgetPos.y = Math.max(8, Math.min(window.innerHeight - 80, dragState.startPosY + dy))
}
const endDrag = () => {
  dragState.isDragging = false
  document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', endDrag)
  document.removeEventListener('touchmove', onDrag); document.removeEventListener('touchend', endDrag)
}

const handleTriggerClick = () => {
  if (dragState.moved) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    trackActivity('chat_opened', route.path)
    if (!isConnected.value) {
      if (isLoggedIn.value) connect()
      else if (guestIdentified.value) connect(guest)
    }
  }
}

// ======= Start Chat Session =======
const startChatSession = () => {
  if (!guest.name || !guest.email || !firstMessage.value) return
  guest.email = guest.email.toLowerCase().trim()
  guestIdentified.value = true
  localStorage.setItem('chat_guest_info', JSON.stringify(guest))
  connect(guest)
  const msg = firstMessage.value; firstMessage.value = ''
  trackActivity('form_submit', route.path, { form: 'identify' })
  
  const trySend = () => {
    if (isConnected.value) {
      sendMessage(msg, 'text', undefined, { name: guest.name, email: guest.email })
      currentView.value = 'chat'
      scrollToBottom()
      // Bot reply to first message
      triggerBotReply(msg)
    } else { setTimeout(trySend, 300) }
  }
  setTimeout(trySend, 500)
}

const handleCallClick = () => { window.open('tel:+2348000000000', '_self') }

const isOwnMessage = (msg: any) => !msg.isAdmin

const handleTyping = () => {
  if (!isConnected.value) return
  const name = isLoggedIn.value ? (user.value as any)?.name : guest.name
  const isGuest = !isLoggedIn.value
  const roomId = isLoggedIn.value ? (user.value as any)?._id : guest.email
  if (!name) return
  setTyping(true, name, isGuest, roomId)
  if (typingTimeout.value) clearTimeout(typingTimeout.value)
  typingTimeout.value = setTimeout(() => { setTyping(false, name, isGuest, roomId) }, 3000)
}

const handleSend = () => {
  if (newMessage.value.trim()) {
    const guestInfo = !isLoggedIn.value ? { name: guest.name, email: guest.email } : undefined
    sendMessage(newMessage.value, 'text', undefined, guestInfo)
    const content = newMessage.value
    newMessage.value = ''
    scrollToBottom()
    // Bot auto-reply
    triggerBotReply(content)
  }
}

const triggerFileInput = () => { fileInput.value?.click() }
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement; const file = target.files?.[0]
  if (!file) return
  const formData = new FormData(); formData.append('file', file); formData.append('folder', 'chat')
  try {
    const response: any = await $fetch(`${config.public.apiBase}/media/upload`, { method: 'POST', body: formData })
    if (response?.secure_url) {
      const guestInfo = !isLoggedIn.value ? { name: guest.name, email: guest.email } : undefined
      sendMessage('Image', 'image', response.secure_url, guestInfo); scrollToBottom()
    }
  } catch (error) { console.error('Upload failed', error) }
}
const openImage = (url: string) => { window.open(url, '_blank') }
const scrollToBottom = () => { nextTick(() => { if (messageContainer.value) messageContainer.value.scrollTop = messageContainer.value.scrollHeight }) }

watch(messages, () => { scrollToBottom() }, { deep: true })
watch(displayMessages, () => { scrollToBottom() }, { deep: true })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
</style>
