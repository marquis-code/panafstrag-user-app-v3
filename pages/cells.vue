<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useFetchCells } from '@/composables/modules/cells/useFetchCells'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'

const { t } = useI18n()
const { fetchCells, cells, loading: pending } = useFetchCells()
const { homeContent } = useHomeContent()

useHead({
  title: 'Cells | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-16 px-6 lg:px-0 pt-16 container mx-auto pb-32">
    <div class="max-w-3xl mx-auto text-center mb-24 animate-fade-in-up">
      <h1 class="text-4xl lg:text-5xl font-black mb-6" v-html="homeContent?.cellsPageTitle || t('Institutional_Cells_HTML')"></h1>
      <p class="text-gray-500 text-lg font-medium leading-relaxed" v-html="homeContent?.cellsPageDescription || t('Cells_Desc')"></p>
    </div>

    <div v-if="pending">
      <LoadingState />
    </div>

    <div v-else-if="cells?.length" class="grid md:grid-cols-2 gap-12">
      <div v-for="(cell, i) in (cells as any[])" :key="cell._id"
        class="flex flex-col md:flex-row group glass-card overflow-hidden animate-fade-in-up"
        :class="`delay-${(i % 2 + 1) * 100}`">
        <div class="md:w-1/3 aspect-video md:aspect-auto bg-gray-50 overflow-hidden border-r border-gray-100">
          <img v-if="cell.imageUrl" :src="cell.imageUrl" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
          <div v-else class="w-full h-full flex items-center justify-center text-4xl font-black text-gray-200">
             {{ cell.name.charAt(0) }}
          </div>
        </div>
        <div class="p-10 flex-1 space-y-6">
          <div class="flex items-center gap-4">
            <span class="px-3 py-1 bg-black text-white text-sm font-black">{{ t('Active_Cell') }}</span>
            <span class="text-gray-400 text-sm font-black">{{ cell.location }}</span>
          </div>
          <h3 class="text-2xl font-black group-hover:text-gray-500 transition-colors leading-tight">{{ cell.name }}</h3>
          <p class="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3" v-html="cell.description"></p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState
        :title="t('NO_CELLS')"
        :message="t('NO_CELLS_MSG')"
      />
    </div>
  </div>
</template>
