<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-show="isOpen" class="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-32 px-4 pb-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>

      <!-- Modal Panel -->
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <!-- Search Input Header -->
        <div class="p-6 border-b border-gray-100 flex items-center gap-4 relative z-10 bg-white shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            class="flex-1 text-2xl font-black bg-transparent border-none outline-none text-black placeholder:text-gray-300 italic uppercase"
            placeholder="AGGRESSIVE SEARCH..."
            @input="handleInput"
          />
          <button @click="close" class="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Results Area -->
        <div class="overflow-y-auto flex-1 p-6 space-y-8 bg-gray-50/50">
           <!-- Loading State -->
           <div v-if="loading" class="flex justify-center py-12">
             <div class="w-8 h-8 border-4 border-[#2E7D32]/20 border-t-[#2E7D32] rounded-full animate-spin"></div>
           </div>

           <!-- Empty Initial State -->
           <div v-else-if="!searchQuery" class="text-center py-16">
             <span class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Discover Our Network</span>
             <p class="text-sm text-gray-500 mt-4 leading-relaxed font-medium max-w-sm mx-auto">
                Type any keyword to aggressively scan through all programs, objectives, focus areas, and archives.
             </p>
           </div>

           <!-- No Results -->
           <div v-else-if="results.length === 0" class="text-center py-16">
             <span class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">NO RESULTS FOUND</span>
             <p class="text-sm text-gray-500 mt-4 leading-relaxed font-medium">Try broader terms or different keywords.</p>
             <p class="font-black italic uppercase text-lg mt-2 opacity-50">"{{ searchQuery }}"</p>
           </div>

           <!-- Grouped Results -->
           <div v-else v-for="(group, type) in groupedResults" :key="type" class="animate-fade-in-up">
              <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-[#2E7D32] border-b border-gray-200 pb-2 mb-4">
                {{ type }} <span class="text-xs text-black/30 ml-2">({{ group.length }})</span>
              </h3>
              <div class="space-y-3">
                 <NuxtLink
                   v-for="(item, idx) in group"
                   :key="idx"
                   :to="item.link"
                   @click="close"
                   class="group/link block bg-white border border-gray-100 p-4 rounded-xl hover:border-[#2E7D32]/30 hover:shadow-lg transition-all duration-300"
                 >
                   <div class="flex items-start justify-between gap-4">
                     <div>
                       <h4 class="font-black text-sm uppercase italic line-clamp-1 group-hover/link:text-[#2E7D32] transition-colors">{{ item.title }}</h4>
                       <p class="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed font-medium" v-html="item.description"></p>
                     </div>
                     <span class="flex-shrink-0 text-[8px] font-black text-white bg-[#2E7D32] px-2 py-1 uppercase tracking-widest rounded-md opacity-0 group-hover/link:opacity-100 transition-opacity">
                        VIEW
                     </span>
                   </div>
                 </NuxtLink>
              </div>
           </div>
        </div>
        
        <!-- Footer Info -->
        <div class="p-4 bg-black text-center relative z-10">
           <span class="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">Global Search Intelligence</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const searchInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const loading = ref(false)
const results = ref<any[]>([])
let timeout: any = null

const close = () => {
  searchQuery.value = ''
  results.value = []
  emit('close')
}

// Auto-focus input when modal opens
watch(() => props.isOpen, (val) => {
  if (val) {
    nextTick(() => {
      searchInput.value?.focus()
    })
  } else {
    searchQuery.value = ''
    results.value = []
  }
})

// Group results for UI styling
const groupedResults = computed(() => {
  return results.value.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, any[]>)
})

// Debounced api request
const handleInput = () => {
  if (timeout) clearTimeout(timeout)
  
  if (searchQuery.value.length < 2) {
    results.value = []
    loading.value = false
    return
  }

  loading.value = true
  timeout = setTimeout(async () => {
    try {
       // Requires the Nuxt proxy or direct fetch to NestJS
       const config = useRuntimeConfig()
       const baseURL = config.public.apiBaseURL || 'http://localhost:3001'
       const res = await fetch(`${baseURL}/search?q=${encodeURIComponent(searchQuery.value)}`)
       if (res.ok) {
         results.value = await res.json()
       } else {
         results.value = []
       }
    } catch (e) {
       console.error("Search failed: ", e)
       results.value = []
    } finally {
       loading.value = false
    }
  }, 400) // 400ms debounce
}
</script>

<style scoped>
</style>
