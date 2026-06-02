<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useFetchFocusAreas } from '@/composables/modules/focusAreas/useFetchFocusAreas'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'

const { t } = useI18n()
const { fetchFocusAreas, focusAreas, loading: pending } = useFetchFocusAreas()
const { homeContent } = useHomeContent()

const isModalOpen = ref(false)
const selectedArea = ref<any>(null)

const openModal = (area: any) => {
  selectedArea.value = area
  isModalOpen.value = true
}

const closeModal = () => {
  selectedArea.value = null
  isModalOpen.value = false
}

useHead({
  title: 'Focus Areas | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-16 px-6 lg:px-0 pt-16 container mx-auto pb-32">
    <div class="max-w-3xl mx-auto text-center mb-24 animate-fade-in-up">
      <h1 class="text-4xl lg:text-5xl font-black mb-6" v-html="homeContent?.focusAreasPageTitle || t('Strategic_Focus_Areas_HTML')"></h1>
      <p class="text-gray-500 text-lg font-medium leading-relaxed" v-html="homeContent?.focusAreasPageDescription || t('Focus_Areas_Desc')"></p>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      <div v-for="i in 4" :key="i" class="h-48 bg-gray-50 rounded-3xl animate-pulse"></div>
    </div>


    <div v-else-if="focusAreas?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      <div v-for="(area, i) in (focusAreas as any[])" :key="area._id"
        @click="openModal(area)"
        class="p-6 md:p-10 bg-gray-50 rounded-3xl border border-gray-100 group animate-fade-in-up flex items-start gap-4 md:gap-8 cursor-pointer hover:bg-black hover:text-white transition-all duration-500"
        :class="`delay-${(i % 2 + 1) * 100}`">
        <div class="text-3xl md:text-5xl font-black text-[#2E7D32] tabular-nums shrink-0 opacity-20 group-hover:opacity-100 transition-opacity">
          {{ (i + 1).toString().padStart(2, '0') }}
        </div>
        <div>
          <h3 class="text-xl md:text-2xl font-black group-hover:text-[#2E7D32] transition-colors leading-tight mb-3 md:mb-4">{{ area?.name }}</h3>
          <p v-if="area?.description" class="text-gray-500 group-hover:text-gray-400 text-sm md:text-sm font-medium leading-relaxed line-clamp-2" v-html="area?.description"></p>
          <div class="mt-6 flex items-center gap-2 text-sm font-black transform transition-transform group-hover:translate-x-2">
            {{ t('Explore_Intelligence') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState
        :title="t('NO_FOCUS_AREAS')"
        :message="t('NO_FOCUS_AREAS_MSG')"
      />
    </div>

    <!-- Teleport Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedArea" class="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="closeModal"></div>
          
          <!-- Modal Content -->
          <div class="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-modal-in">
            <!-- Left Side: Visual/Color Block -->
            <div class="w-full md:w-1/3 bg-[#2E7D32] p-12 text-white flex flex-col justify-between relative overflow-hidden">
               <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
               <span class="text-sm font-black opacity-60">{{ t('STRATEGIC_SECTOR') }}</span>
               <div class="text-9xl font-black opacity-10">{{ t('FS') }}</div>
            </div>

            <!-- Right Side: Data -->
            <div class="flex-1 p-8 md:p-16 overflow-y-auto bg-white custom-scrollbar">
              <button @click="closeModal" class="absolute top-8 right-8 text-black hover:rotate-90 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div class="space-y-10">
                <div>
                   <span class="text-sm font-black text-[#2E7D32] mb-4 block">{{ t('Focus_Area_Details') }}</span>
                   <h2 class="text-4xl md:text-6xl font-black leading-none">{{ selectedArea?.name }}</h2>
                </div>
                
                <div class="h-1 w-20 bg-[#2E7D32]"></div>

                <div class="space-y-6">
                   <h4 class="text-sm font-black text-gray-400">{{ t('In_Depth_Analysis') }}</h4>
                   <p class="text-lg text-gray-800 font-medium leading-relaxed" v-html="selectedArea?.description"></p>
                </div>

                <!-- Strategic Points (Placeholder/Static for now if not in schema) -->
                <div class="grid grid-cols-1 gap-6 pt-8">
                  <div class="p-6 bg-gray-50 border-l-4 border-[#2E7D32]">
                    <p class="text-sm font-black text-[#2E7D32] mb-2">{{ t('Policy_Implication') }}</p>
                    <p class="text-sm font-bold text-gray-500 leading-relaxed">{{ t('Policy_Implication_Desc') }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.5s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(40px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #2E7D32;
  border-radius: 10px;
}
</style>
