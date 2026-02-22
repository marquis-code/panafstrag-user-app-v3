<script setup lang="ts">
import { useFetchArchives } from '@/composables/modules/archives/useFetchArchives'
const { fetchArchives, archives, loading: pending } = useFetchArchives()

const filter = ref('all')
const filteredArchives = computed(() => {
  if (filter.value === 'all') return archives.value as any[]
  return (archives.value as any[]).filter(a => a.type === filter.value)
})

useHead({
  title: 'Archives | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-16 px-6 lg:px-0 pt-16 container mx-auto pb-32">
    <div class="max-w-3xl mx-auto text-center mb-24 animate-fade-in-up">
      <h1 class="text-4xl lg:text-5xl font-black mb-6 tracking-tighter uppercase italic">Resource <span class="not-italic text-gray-400">Archives.</span></h1>
      <p class="text-gray-500 text-lg font-medium leading-relaxed">
        Access our comprehensive collection of strategic research, annual reports, policy papers, and institutional media resources.
      </p>
    </div>

    <div class="flex justify-center mb-16 animate-fade-in-up delay-100">
      <div class="inline-flex p-1 bg-gray-50 rounded-xl border border-gray-100 overflow-x-auto max-w-full">
        <button
          v-for="f in ['all', 'speech', 'report', 'media']" :key="f"
          @click="filter = f"
          class="px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap"
          :class="filter === f ? 'bg-black text-white' : 'text-gray-400 hover:text-black'"
        >
          {{ f }}
        </button>
      </div>
    </div>

    <div v-if="pending">
      <LoadingState />
    </div>

    <div v-else-if="filteredArchives?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
      <div v-for="(item, i) in filteredArchives" :key="item._id"
        class="group glass-card animate-fade-in-up"
        :class="`delay-${(i % 4 + 1) * 100}`">
        <div class="w-14 h-14 rounded-lg bg-black flex items-center justify-center mb-8 text-white transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
           <!-- Icon based on type -->
           <svg v-if="item.type === 'speech'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
           </svg>
           <svg v-else-if="item.type === 'report'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
           <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
           </svg>
        </div>
        <h4 class="text-xl font-black mb-4 tracking-tighter uppercase line-clamp-2 group-hover:text-gray-500 transition-colors leading-tight">{{ item.title }}</h4>
        <p class="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-10">{{ item.type }} • {{ item.year || new Date(item.date).getFullYear() }}</p>
        <a :href="item.fileUrl" target="_blank" class="w-full py-4 bg-gray-50 group-hover:bg-black group-hover:text-white rounded-lg text-center text-[10px] font-black uppercase tracking-widest transition-all block">
          DOWNLOAD
        </a>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState
        title="ARCHIVES EMPTY"
        message="The intelligence repository for this category is currently being indexed or contains no public records."
      />
    </div>
  </div>
</template>
