<script setup lang="ts">
import { useFetchPrograms } from '@/composables/modules/programs/useFetchPrograms'
const { fetchPrograms, programs: allPrograms, loading: pending } = useFetchPrograms()

const filter = ref('all')
const filteredPrograms = computed(() => {
  const progs = (allPrograms.value as any[]) || []
  if (filter.value === 'all') return progs
  return progs.filter(p => p.type === filter.value)
})

useHead({
  title: 'Programs & Events | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-16 pb-32">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
      <div class="max-w-2xl animate-fade-in-up">
        <h1 class="text-4xl lg:text-5xl font-black mb-6 tracking-tighter uppercase italic">Programs <span class="not-italic text-gray-400">& Events.</span></h1>
        <p class="text-gray-500 text-lg font-medium leading-relaxed">
          Explore our upcoming seminars, policy dialogues, and past research dissemination events across the continent.
        </p>
      </div>

      <!-- Filter -->
      <div class="flex p-1 bg-gray-50 rounded-xl border border-gray-100 animate-fade-in-up delay-100">
        <button
          v-for="f in ['all', 'upcoming', 'past']" :key="f"
          @click="filter = f"
          class="px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all"
          :class="filter === f ? 'bg-black text-white' : 'text-gray-400 hover:text-black'"
        >
          {{ f }}
        </button>
      </div>
    </div>

    <div v-if="pending">
      <LoadingState />
    </div>

    <div v-else-if="filteredPrograms?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      <div v-for="(program, i) in filteredPrograms" :key="program._id"
        class="group relative animate-fade-in-up"
        :class="`delay-${(i % 3 + 1) * 100}`">
        <div class="aspect-video bg-gray-100 rounded-xl overflow-hidden relative mb-8">
          <img v-if="program.imageUrl" :src="program.imageUrl" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-200 font-black text-4xl italic">PAS</div>

          <div class="absolute top-4 right-4">
            <span class="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest">
              {{ program.type }}
            </span>
          </div>
        </div>
        <div class="space-y-4">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ new Date(program.date).toLocaleDateString('en-US', { dateStyle: 'long' }) }}</p>
          <h4 class="text-2xl font-black tracking-tighter uppercase group-hover:text-gray-500 transition-colors leading-tight line-clamp-2">{{ program.title }}</h4>
          <p class="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">{{ program.description }}</p>

          <div class="pt-6">
            <a v-if="program.registerLink" :href="program.registerLink" target="_blank" class="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:gap-5 hover:border-gray-300 transition-all">
              REGISTER NOW —>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState
        title="NO PROGRAMS"
        message="Our strategic event calendar is currently under review. Please check back later for updates."
      />
    </div>
  </div>
</template>
