<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useFetchCells } from '@/composables/modules/cells/useFetchCells'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
import {
  LucideMapPin,
  LucideUsers,
  LucideArrowRight,
  LucideLeaf,
} from 'lucide-vue-next'

const { t } = useI18n()
const { fetchCells, cells, loading: pending } = useFetchCells()
const { homeContent } = useHomeContent()

useHead({
  title: 'Cells | PANAFSTRAG',
})
</script>

<template>
  <div class="min-h-screen bg-white font-body">

    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <section class="bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pb-20">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-green-50 text-[#2E7D32] text-xs font-semibold px-4 py-2 rounded-full mb-7 border border-green-100">
            <LucideLeaf :size="13" />
            {{ t('Institutional Network') }}
          </div>
          <h1
            class="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
            v-html="homeContent?.cellsPageTitle || t('Institutional_Cells_HTML')"
          ></h1>
          <p
            class="text-[16px] text-slate-500 leading-relaxed max-w-[540px]"
            v-html="homeContent?.cellsPageDescription || t('Cells_Desc')"
          ></p>
        </div>
      </div>
    </section>

    <!-- ─── CELLS GRID ────────────────────────────────────────── -->
    <section class="bg-slate-50 border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">

        <!-- Loading -->
        <div v-if="pending">
          <LoadingState />
        </div>

        <!-- Cells list -->
        <div v-else-if="cells?.length" class="grid md:grid-cols-2 gap-6">
          <div
            v-for="(cell, i) in (cells as any[])"
            :key="cell._id"
            class="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-md transition-all duration-300 flex flex-col"
          >
            <!-- Image strip -->
            <div class="relative h-48 bg-slate-100 overflow-hidden">
              <img
                v-if="cell.imageUrl"
                :src="cell.imageUrl"
                class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
                style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
              >
                <span class="text-6xl font-black text-[#2E7D32] opacity-30">
                  {{ cell.name?.charAt(0) }}
                </span>
              </div>

              <!-- Active badge overlay -->
              <div class="absolute top-4 left-4">
                <span class="inline-flex items-center gap-1.5 bg-[#2E7D32] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">
                  <span class="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                  {{ t('Active_Cell') }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-7 flex-1 space-y-4 flex flex-col">
              <!-- Location row -->
              <div v-if="cell.location" class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <LucideMapPin :size="13" class="text-[#2E7D32]" />
                </div>
                <span class="text-[12px] font-semibold text-slate-400 tracking-wide uppercase">{{ cell.location }}</span>
              </div>

              <h3 class="text-[20px] font-bold text-slate-800 leading-tight group-hover:text-[#2E7D32] transition-colors duration-200">
                {{ cell.name }}
              </h3>

              <p
                class="text-[13px] text-slate-500 leading-relaxed line-clamp-3 flex-1"
                v-html="cell.description"
              ></p>

              <!-- Footer -->
              <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                    <LucideUsers :size="13" class="text-slate-400" />
                  </div>
                  <span class="text-[12px] font-medium text-slate-400">{{ t('Members') || 'Members' }}</span>
                </div>
                <button class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#2E7D32] hover:gap-2.5 transition-all duration-200">
                  {{ t('View_Cell') || 'View cell' }}
                  <LucideArrowRight :size="13" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else>
          <EmptyState
            :title="t('NO_CELLS')"
            :message="t('NO_CELLS_MSG')"
          />
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
.font-body {
  font-family: 'DM Sans', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}
</style>