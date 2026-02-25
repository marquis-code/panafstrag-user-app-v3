<script setup lang="ts">
import { useFetchPrograms } from '@/composables/modules/programs/useFetchPrograms'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'

const { programs: allPrograms, loading: pending } = useFetchPrograms()
const { homeContent } = useHomeContent()

const route = useRoute()
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
  const now = new Date()

  // Map dynamic status based on current date
  progs = progs.map(p => {
    const pDate = p.startDate ? new Date(p.startDate) : (p.date ? new Date(p.date) : null)
    let calculatedStatus = p.type // fallback to DB type
    
    if (pDate) {
      // If the date is earlier than today, it's past
      calculatedStatus = pDate < now ? 'past' : 'upcoming'
    }
    
    return { ...p, calculatedStatus }
  })

  // Filter logic
  if (selectedYear.value !== 'all') {
    progs = progs.filter(p => {
      const pYear = p.year || (p.date ? new Date(p.date).getFullYear() : (p.startDate ? new Date(p.startDate).getFullYear() : null))
      return pYear === parseInt(selectedYear.value)
    })
  }
  
  if (selectedMonth.value !== 'all') {
    progs = progs.filter(p => {
      const pMonth = p.month || (p.date ? (new Date(p.date).getMonth() + 1) : (p.startDate ? (new Date(p.startDate).getMonth() + 1) : null))
      return pMonth === parseInt(selectedMonth.value)
    })
  }

  return progs
})

const groupedProgramsByYear = computed(() => {
  const progs = filteredPrograms.value
  const groups: Record<number, any[]> = {}
  
  for (const prog of progs) {
    const year = prog.year || (prog.date ? new Date(prog.date).getFullYear() : (prog.startDate ? new Date(prog.startDate).getFullYear() : 0))
    if (!groups[year]) groups[year] = []
    groups[year].push(prog)
  }

  return Object.keys(groups)
    .map(Number)
    .sort((a, b) => b - a)
    .map(year => ({
      year,
      programs: groups[year]
    }))
})

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'upcoming': return 'bg-[#E8F5E9] text-[#2E7D32]'
    case 'past': return 'bg-gray-100 text-gray-500'
    default: return 'bg-blue-50 text-blue-600'
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return date
  }
}

useHead({
  title: 'Programmes | PANAFSTRAG',
})
</script>

<template>
  <div class="min-h-screen bg-[#F9FBFA] pb-32">
    <!-- Header Section -->
    <section class="bg-[#1A3A1C] pt-28 pb-40 overflow-hidden relative">
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2E7D32]/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div class="container mx-auto px-6 relative z-10">
        <div class="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 class="text-4xl lg:text-7xl font-bold mb-8 tracking-tight text-white" v-html="homeContent?.programsPageTitle || 'Strategic <span class=\'text-white/40\'>Programmes</span>'"></h1>
          <p class="text-white/60 text-lg font-medium leading-relaxed" v-html="homeContent?.programsPageDescription || 'Explore our latest initiatives, strategic research projects, and policy recommendation programmes across the continent.'"></p>
        </div>
      </div>
    </section>

    <!-- Content & Filters -->
    <div class="container mx-auto px-6 -mt-20 relative z-20">
      <!-- Filter Toolbar -->
      <div class="flex flex-col md:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up">
        <div class="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl rounded-[1.5rem] border border-white shadow-xl shadow-black/[0.03]">
          <span class="text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em]">Filter Year:</span>
          <div class="w-40">
            <CustomDropdown
              v-model="selectedYear"
              :options="[{ label: 'ALL YEARS', value: 'all' }, ...years]"
              variant="flat"
            />
          </div>
        </div>

        <div v-if="selectedYear !== 'all'" class="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl rounded-[1.5rem] border border-white shadow-xl shadow-black/[0.03]">
          <span class="text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.2em]">Month:</span>
          <div class="w-40">
            <CustomDropdown
              v-model="selectedMonth"
              :options="[{ label: 'ALL MONTHS', value: 'all' }, ...monthOptions]"
              variant="flat"
            />
          </div>
        </div>
      </div>

      <!-- Programmes Grid -->
      <div v-if="pending" class="py-20 flex justify-center">
        <LoadingState />
      </div>

      <div v-else-if="groupedProgramsByYear?.length" class="space-y-32">
        <div v-for="group in groupedProgramsByYear" :key="group.year" class="space-y-12">
          <!-- Year Divider -->
          <div class="flex items-center gap-6">
            <h2 class="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900">{{ group.year }}</h2>
            <div class="h-0.5 flex-1 bg-gray-100"></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <div v-for="(program, i) in group.programs" :key="program._id"
              class="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#2E7D32]/5 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
              :style="{ animationDelay: `${(i % 3) * 100}ms` }">
              
              <!-- Image Container -->
              <div class="aspect-[16/10] overflow-hidden relative">
                <img v-if="program.bannerImages?.length" :src="program.bannerImages[0]" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <img v-else-if="program.imageUrl" :src="program.imageUrl" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                 <img v-else src="@/assets/images/program-placeholder.png" alt="" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100" />
                <!-- <div v-else class="w-full h-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div> @/assets/images/program-placeholder.png -->

                <!-- Status Badge -->
                <div class="absolute top-5 left-5">
                  <span class="px-4 py-1.5 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg" :class="getStatusColor(program.calculatedStatus)">
                    {{ program.calculatedStatus }}
                  </span>
                </div>
              </div>

              <!-- Content Area -->
              <div class="p-8 space-y-5">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></div>
                  <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ program.startDate || formatDate(program.date) }}</p>
                </div>
                
                <h3 class="text-xl font-bold text-gray-900 leading-snug group-hover:text-[#2E7D32] transition-colors line-clamp-2">
                  {{ program.title }}
                </h3>
                
                <p v-if="program.theme" class="text-xs font-semibold text-gray-400 leading-relaxed italic line-clamp-2 border-l-2 border-gray-100 pl-4 py-1">
                  "{{ program.theme }}"
                </p>

                <p class="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium" v-html="program.description"></p>

                <div class="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <NuxtLink :to="`/programs/${program._id}`" class="text-[11px] font-bold text-[#2E7D32] tracking-widest uppercase flex items-center gap-2 group/btn">
                    Details 
                    <span class="inline-block transform group-hover/btn:translate-x-1 transition-transform">→</span>
                  </NuxtLink>
                  
                  <div class="flex gap-2">
                    <a v-if="program.registerLink" :href="program.registerLink" target="_blank" class="w-9 h-9 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all shadow-sm" title="Register">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    </a>
                    <a v-if="program.uploadedVideoUrl && program.uploadedVideoUrl !== 'null'" :href="program.uploadedVideoUrl" target="_blank" class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Watch Video">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-32">
        <EmptyState
          title="NO PROGRAMMES FOUND"
          message="We couldn't find any strategic Programmes for the selected criteria. Please try adjusting your filters."
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in { animation: fade-in 1s ease-out forwards; }
.animate-fade-in-up { opacity: 0; animation: fade-in-up 0.8s ease-out forwards; }
</style>
