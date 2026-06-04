<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useFetchFocusAreas } from '@/composables/modules/focusAreas/useFetchFocusAreas'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
import {
  LucideTarget,
  LucideArrowRight,
  LucideX,
  LucideBookOpen,
  LucideLightbulb,
  LucideChevronRight,
} from 'lucide-vue-next'

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
  <div class="min-h-screen bg-white font-body">

    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <section class="bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pb-20">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-green-50 text-[#2E7D32] text-xs font-semibold px-4 py-2 rounded-full mb-7 border border-green-100">
            <LucideTarget :size="13" />
            {{ t('Strategic Focus') }}
          </div>
          <h1
            class="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
            v-html="homeContent?.focusAreasPageTitle || t('Strategic_Focus_Areas_HTML')"
          ></h1>
          <p
            class="text-[16px] text-slate-500 leading-relaxed max-w-[540px]"
            v-html="homeContent?.focusAreasPageDescription || t('Focus_Areas_Desc')"
          ></p>
        </div>
      </div>
    </section>

    <!-- ─── FOCUS AREAS GRID ──────────────────────────────────── -->
    <section class="bg-slate-50 border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">

        <!-- Skeleton loading -->
        <div v-if="pending" class="grid md:grid-cols-2 gap-6">
          <div v-for="i in 4" :key="i" class="h-52 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>

        <!-- Areas grid -->
        <div v-else-if="focusAreas?.length" class="grid md:grid-cols-2 gap-6">
          <div
            v-for="(area, i) in (focusAreas as any[])"
            :key="area._id"
            @click="openModal(area)"
            class="group bg-white border border-slate-200 rounded-2xl p-7 hover:border-green-200 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col gap-5"
          >
            <!-- Header row -->
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#2E7D32] transition-colors duration-300">
                  <span class="text-[15px] font-bold text-[#2E7D32] tabular-nums group-hover:text-white transition-colors duration-300">
                    {{ (i + 1).toString().padStart(2, '0') }}
                  </span>
                </div>
                <span class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase">
                  {{ t('Focus Area') || 'Focus Area' }}
                </span>
              </div>
              <div class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-[#2E7D32] group-hover:border-[#2E7D32] transition-all duration-300">
                <LucideArrowRight :size="14" class="text-slate-400 group-hover:text-white -rotate-45 transition-colors duration-300" />
              </div>
            </div>

            <!-- Title -->
            <h3 class="text-[20px] font-bold text-slate-800 leading-tight group-hover:text-[#2E7D32] transition-colors duration-200">
              {{ area?.name }}
            </h3>

            <!-- Description -->
            <p
              v-if="area?.description"
              class="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-3 flex-1"
              v-html="area?.description"
            ></p>

            <!-- Footer -->
            <div class="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[12px] font-semibold text-[#2E7D32] group-hover:gap-2.5 transition-all duration-200">
              {{ t('Explore_Intelligence') }}
              <LucideChevronRight :size="13" />
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else>
          <EmptyState
            :title="t('NO_FOCUS_AREAS')"
            :message="t('NO_FOCUS_AREAS_MSG')"
          />
        </div>

      </div>
    </section>

    <!-- ─── MODAL ─────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedArea"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 lg:p-12"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="closeModal"
          ></div>

          <!-- Modal panel -->
          <div class="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row animate-modal-in">

            <!-- Left accent strip -->
            <div class="w-full md:w-[280px] bg-[#2E7D32] p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden flex-shrink-0">
              <div class="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div class="inline-flex items-center gap-2 bg-white/10 text-green-200 text-[11px] font-semibold px-3 py-1.5 rounded-full mb-6 border border-white/10">
                  <LucideTarget :size="11" />
                  {{ t('STRATEGIC_SECTOR') }}
                </div>
                <div class="text-[80px] font-black text-white/10 leading-none select-none">
                  {{ (focusAreas as any[])?.findIndex((a: any) => a._id === selectedArea._id) + 1 > 9
                    ? (focusAreas as any[])?.findIndex((a: any) => a._id === selectedArea._id) + 1
                    : '0' + ((focusAreas as any[])?.findIndex((a: any) => a._id === selectedArea._id) + 1) }}
                </div>
              </div>

              <div class="space-y-2 relative z-10">
                <p class="text-[11px] font-semibold text-green-300 tracking-widest uppercase">{{ t('Focus Area') || 'Focus Area' }}</p>
                <p class="text-[15px] font-bold text-white leading-snug">{{ selectedArea?.name }}</p>
              </div>
            </div>

            <!-- Right content -->
            <div class="flex-1 overflow-y-auto custom-scrollbar bg-white">
              <!-- Sticky header -->
              <div class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-8 py-5 flex items-center justify-between z-10">
                <div>
                  <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-0.5">{{ t('Focus_Area_Details') }}</p>
                  <h2 class="text-[20px] font-bold text-slate-800 leading-tight">{{ selectedArea?.name }}</h2>
                </div>
                <button
                  @click="closeModal"
                  class="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center hover:bg-[#2E7D32] hover:border-[#2E7D32] hover:text-white text-slate-500 transition-all duration-200"
                >
                  <LucideX :size="16" />
                </button>
              </div>

              <!-- Body -->
              <div class="p-8 space-y-8">

                <!-- Divider accent -->
                <div class="h-1 w-16 bg-[#2E7D32] rounded-full"></div>

                <!-- In-depth analysis -->
                <div class="space-y-3">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                      <LucideBookOpen :size="13" class="text-[#2E7D32]" />
                    </div>
                    <h4 class="text-[12px] font-semibold text-slate-400 tracking-widest uppercase">{{ t('In_Depth_Analysis') }}</h4>
                  </div>
                  <p
                    class="text-[15px] text-slate-700 font-medium leading-relaxed"
                    v-html="selectedArea?.description"
                  ></p>
                </div>

                <!-- Policy implication card -->
                <div class="bg-green-50 border border-green-100 rounded-2xl p-6 flex gap-4">
                  <div class="w-9 h-9 rounded-xl bg-[#2E7D32] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <LucideLightbulb :size="15" class="text-white" />
                  </div>
                  <div class="space-y-1.5">
                    <p class="text-[12px] font-semibold text-[#2E7D32] tracking-widest uppercase">{{ t('Policy_Implication') }}</p>
                    <p class="text-[13px] font-medium text-slate-600 leading-relaxed">{{ t('Policy_Implication_Desc') }}</p>
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
.font-body {
  font-family: 'DM Sans', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(24px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
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