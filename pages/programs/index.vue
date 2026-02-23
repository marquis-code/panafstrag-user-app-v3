<script setup lang="ts">
import { useFetchPrograms } from '@/composables/modules/programs/useFetchPrograms'
const { fetchPrograms, programs: allPrograms, loading: pending } = useFetchPrograms()

const route = useRoute()
const filter = ref(route.query.type as string || 'all')
const selectedYear = ref(route.query.year as string || 'all')
const selectedMonth = ref(route.query.month as string || 'all')

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const startYear = 1990
  const y = []
  for (let i = currentYear; i >= startYear; i--) {
    y.push({ label: i.toString(), value: i.toString() })
  }
  return y
})

const monthOptions = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
].map((m, i) => ({ label: m, value: (i + 1).toString() }))
const filteredPrograms = computed(() => {
  let progs = (allPrograms.value as any[]) || []
  if (filter.value !== 'all') {
    progs = progs.filter(p => p.type === filter.value)
  }
  if (selectedYear.value !== 'all') {
    progs = progs.filter(p => p.year === parseInt(selectedYear.value))
  }
  if (selectedMonth.value !== 'all') {
    progs = progs.filter(p => p.month === parseInt(selectedMonth.value))
  }
  return progs
})

watch(selectedYear, (newVal) => {
  if (newVal === 'all') selectedMonth.value = 'all'
})

useHead({
  title: 'Programs & Events | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-16 px-6 lg:px-0 pt-16 container mx-auto pb-32">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
      <div class="max-w-2xl animate-fade-in-up">
        <h1 class="text-4xl lg:text-5xl font-black mb-6 tracking-tighter uppercase italic">Programs <span class="not-italic text-gray-400">& Events.</span></h1>
        <p class="text-gray-500 text-lg font-medium leading-relaxed">
          Explore our upcoming seminars, policy dialogues, and past research dissemination events across the continent.
        </p>
      </div>

      <!-- Aggressive Filter Toolbar -->
      <div class="flex flex-col md:flex-row items-center gap-6 animate-fade-in-up delay-100 relative z-20">
        <!-- New Year-centric Filter -->
        <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
           <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mr-2">Archive Year:</span>
           <div class="w-48">
              <CustomDropdown
                v-model="selectedYear"
                :options="[{ label: 'ALL YEARS', value: 'all' }, ...years]"
                placeholder="SELECT YEAR"
              />
           </div>
        </div>

        <!-- Temporal Search -->
        <div class="flex items-center gap-3 w-full md:w-auto">
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 -translate-x-4"
            enter-to-class="opacity-100 translate-x-0"
          >
            <div v-if="selectedYear !== 'all'" class="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
              <span class="text-[9px] font-black text-gray-400 uppercase tracking-widest mr-2">Month:</span>
              <div class="w-48">
                <CustomDropdown
                  v-model="selectedMonth"
                  :options="[{ label: 'ALL MONTHS', value: 'all' }, ...monthOptions]"
                  placeholder="SELECT MONTH"
                />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <div v-if="pending">
      <LoadingState />
    </div>

    <div v-else-if="filteredPrograms?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      <div v-for="(program, i) in filteredPrograms" :key="program._id"
        class="group relative animate-fade-in-up"
        :class="`delay-${(i % 3 + 1) * 100}`">
        <div class="aspect-video bg-gray-100 rounded-xl overflow-hidden relative mb-8 shadow-sm">
          <img v-if="program.imageUrl" :src="program.imageUrl" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
          <img v-else src="@/assets/images/program-placeholder.png" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-50 group-hover:opacity-100" />

          <div class="absolute top-4 right-4 flex gap-2">
            <span class="px-3 py-1 bg-[#2E7D32] text-white text-[9px] font-black uppercase tracking-widest">
              {{ program.type }}
            </span>
          </div>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
             <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ program.startDate || new Date(program.date).toLocaleDateString('en-US', { dateStyle: 'long' }) }}</p>
          </div>
          <h4 class="text-2xl font-black tracking-tighter uppercase group-hover:text-[#2E7D32] transition-colors leading-tight line-clamp-2 italic">{{ program.title }}</h4>
          <p v-if="program.theme" class="text-[10px] font-bold text-gray-400 uppercase italic line-clamp-2 leading-relaxed pb-2 border-b border-gray-100">{{ program.theme }}</p>
          <p class="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">{{ program.description }}</p>

          <div class="pt-6 flex flex-wrap gap-4 items-center">
            <NuxtLink :to="`/programs/${program._id}`" class="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:gap-5 hover:border-[#2E7D32] transition-all">
              VIEW FULL DETAILS —>
            </NuxtLink>
            <a v-if="program.registerLink" :href="program.registerLink" target="_blank" class="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-gray-400 pb-1 hover:gap-5 hover:border-gray-200 transition-all opacity-60 hover:opacity-100">
              REGISTER NOW
            </a>
            <a v-if="program.uploadedVideoUrl && program.uploadedVideoUrl !== 'null'" :href="program.uploadedVideoUrl" target="_blank" class="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-red-600 pb-1 hover:gap-5 hover:border-red-300 transition-all text-red-600">
              WATCH VIDEO
            </a>
            <div v-if="program.uploadedDocumentFiles?.length" class="w-full block pt-4">
               <a v-for="(doc, idx) in (program.uploadedDocumentFiles as string[])" :key="idx" :href="doc" target="_blank" class="block text-[9px] font-black text-gray-400 hover:text-black transition-colors uppercase tracking-[0.2em] mb-1 italic">Download Resource {{ Number(idx) + 1 }}</a>
            </div>
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
