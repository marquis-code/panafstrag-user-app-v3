<script setup lang="ts">
const { fetchCells, cells, loading: pending } = useFetchCells()
await fetchCells()

useHead({
  title: 'Cells | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-16 pb-32">
    <div class="max-w-3xl mx-auto text-center mb-24 animate-fade-in-up">
      <h1 class="text-4xl lg:text-5xl font-black mb-6 tracking-tighter uppercase italic">Institutional <span class="not-italic text-gray-400">Cells.</span></h1>
      <p class="text-gray-500 text-lg font-medium leading-relaxed">
        Our specialized cells focus on regional and thematic research areas, ensuring localized expertise and global relevance in strategic policy.
      </p>
    </div>

    <div v-if="pending">
      <LoadingState />
    </div>

    <div v-else-if="cells?.length" class="grid md:grid-cols-2 gap-12">
      <div v-for="(cell, i) in (cells as any[])" :key="cell._id" 
        class="flex flex-col md:flex-row group glass-card overflow-hidden animate-fade-in-up"
        :class="`delay-${(i % 2 + 1) * 100}`">
        <div class="md:w-1/3 aspect-video md:aspect-auto bg-gray-50 overflow-hidden border-r border-gray-100 italic">
          <img v-if="cell.imageUrl" :src="cell.imageUrl" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
          <div v-else class="w-full h-full flex items-center justify-center text-4xl font-black text-gray-200 uppercase">
             {{ cell.name.charAt(0) }}
          </div>
        </div>
        <div class="p-10 flex-1 space-y-6">
          <div class="flex items-center gap-4">
            <span class="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest">Active Cell</span>
            <span class="text-gray-400 text-[10px] font-black uppercase tracking-widest">{{ cell.location }}</span>
          </div>
          <h3 class="text-2xl font-black tracking-tighter uppercase group-hover:text-gray-500 transition-colors leading-tight italic">{{ cell.name }}</h3>
          <p class="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">
            {{ cell.description }}
          </p>
          <div class="pt-6 border-t border-gray-100 flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-black italic">
              {{ cell.leadName?.charAt(0) }}
            </div>
            <div>
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Lead Researcher</p>
              <p class="text-xs font-black uppercase tracking-tight">{{ cell.leadName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState 
        title="NO CELLS" 
        message="The organizational research network is currently being restructured or modernized." 
      />
    </div>
  </div>
</template>
