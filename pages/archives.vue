<script setup lang="ts">
import { useFetchArchives } from '@/composables/modules/archives/useFetchArchives'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
import { programs_api } from '@/api_factory/modules/programs'

const { archives: allArchives, loading: pending } = useFetchArchives()
const { homeContent } = useHomeContent()

// Fetch past programs to merge into archives
const pastPrograms = ref<any[]>([])
const pastLoading = ref(false)

onMounted(async () => {
  pastLoading.value = true
  try {
    const res = await programs_api.getPastPrograms() as any
    if ([200, 201].includes(res?.status)) {
      pastPrograms.value = (res.data?.data ?? res.data ?? []).map((p: any) => ({
        ...p,
        type: 'program',
        fileUrl: null,
        _source: 'program'
      }))
    }
  } catch (e) {
    // Silently fail
  } finally {
    pastLoading.value = false
  }
})

const route = useRoute()
const filter = ref(route.query.type as string || 'all')
const selectedYear = ref(route.query.year as string || 'all')
const selectedMonth = ref(route.query.month as string || 'all')

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const monthOptions = months.map((m, i) => ({ label: m.toUpperCase(), value: (i + 1).toString() }))

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  const startYear = 1992
  const y = []
  for (let i = currentYear; i >= startYear; i--) {
    y.push({ label: i.toString(), value: i.toString() })
  }
  return y
})

// Merge archives and past programs
const mergedItems = computed(() => {
  const archives = (allArchives.value as any[]) || []
  const programs = pastPrograms.value || []
  return [...archives, ...programs]
})

const filterTypes = ['all', 'program', 'speech', 'report', 'publication', 'media']

const filteredArchives = computed(() => {
  let items = mergedItems.value
  if (filter.value !== 'all') {
    items = items.filter(p => p.type === filter.value || (filter.value === 'program' && p._source === 'program'))
  }
  if (selectedYear.value !== 'all') {
    items = items.filter(p => {
      const pYear = p.year || new Date(p.date).getFullYear()
      return pYear === parseInt(selectedYear.value)
    })
  }
  if (selectedMonth.value !== 'all') {
    items = items.filter(p => {
      const pMonth = p.month || (new Date(p.date).getMonth() + 1)
      return pMonth === parseInt(selectedMonth.value)
    })
  }
  return items
})

const groupedArchivesByYear = computed(() => {
  const items = filteredArchives.value
  const groups: Record<number, any[]> = {}
  
  for (const item of items) {
    const year = item.year || new Date(item.date).getFullYear()
    if (!groups[year]) groups[year] = []
    groups[year].push(item)
  }

  return Object.keys(groups)
    .map(Number)
    .sort((a, b) => b - a)
    .map(year => ({
      year,
      items: groups[year]
    }))
})

const isLoading = computed(() => pending.value || pastLoading.value)

useHead({
  title: 'Archives | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-16 px-6 lg:px-0 pt-16 container mx-auto pb-32">
    <div class="max-w-3xl mx-auto text-center mb-24 animate-fade-in-up">
      <h1 class="text-4xl lg:text-5xl font-black mb-6 tracking-tighter uppercase italic" v-html="homeContent?.archivesPageTitle || 'Institutional <span class=\'not-italic text-gray-400\'>Archives</span>'"></h1>
      <p class="text-gray-500 text-lg font-medium leading-relaxed" v-html="homeContent?.archivesPageDescription || 'A comprehensive repository of past programs, strategic evaluations, policy briefs, and historical documents from PANAFSTRAG operations.'"></p>
    </div>

    <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8 md:mb-16 animate-fade-in-up delay-100 relative z-20">
      <!-- Type Filter -->
      <div class="inline-flex p-1 bg-gray-50 rounded-xl border border-gray-100 overflow-x-auto max-w-full no-scrollbar">
        <button
          v-for="f in filterTypes" :key="f"
          @click="filter = f"
          class="px-4 md:px-8 py-2 md:py-2.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap"
          :class="filter === f ? 'bg-black text-white' : 'text-gray-400 hover:text-black'"
        >
          {{ f === 'program' ? 'PAST PROGRAMS' : f }}
        </button>
      </div>

      <!-- Year & Month Filters -->
      <div class="flex items-center gap-3 w-full md:w-auto">
        <div class="w-40 lg:w-48">
          <CustomDropdown
            v-model="selectedYear"
            :options="[{ label: 'ALL YEARS', value: 'all' }, ...years]"
            placeholder="SELECT YEAR"
          />
        </div>
        
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-x-4"
          enter-to-class="opacity-100 translate-x-0"
        >
          <div v-if="selectedYear !== 'all'" class="w-40 lg:w-48">
            <CustomDropdown
              v-model="selectedMonth"
              :options="[{ label: 'ALL MONTHS', value: 'all' }, ...monthOptions]"
              placeholder="SELECT MONTH"
            />
          </div>
        </Transition>
      </div>
    </div>

    <div v-if="isLoading">
      <LoadingState />
    </div>

    <div v-else-if="groupedArchivesByYear?.length" class="space-y-24">
      <div v-for="group in groupedArchivesByYear" :key="group.year" class="space-y-12">
        <div class="border-b border-gray-100 pb-4">
          <h2 class="text-3xl font-black uppercase tracking-tighter italic">
            Archive Year: <span class="not-italic text-gray-400">{{ group.year }}</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div v-for="(item, i) in group.items" :key="item._id"
            class="group glass-card animate-fade-in-up !p-6 md:!p-8"
            :class="`delay-${(i % 4 + 1) * 100}`">

            <!-- Program type card (past programs) -->
            <template v-if="item._source === 'program'">
              <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6 relative">
                <img v-if="item.bannerImages?.length" :src="item.bannerImages[0]" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <img v-else-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span class="absolute top-2 right-2 px-2 py-0.5 bg-[#2E7D32] text-white text-[8px] font-black uppercase tracking-widest">PROGRAM</span>
              </div>
              <h4 class="text-lg md:text-xl font-black mb-3 tracking-tighter uppercase line-clamp-2 group-hover:text-[#2E7D32] transition-colors leading-tight">{{ item.title }}</h4>
              <p class="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-4">
                {{ item.startDate || new Date(item.date).toLocaleDateString('en-US', { dateStyle: 'long' }) }}
              </p>
              <p v-if="item.description" class="text-gray-500 text-xs font-medium leading-relaxed line-clamp-3 mb-6" v-html="item.description"></p>
              <NuxtLink :to="`/programs/${item._id}`" class="w-full py-3 bg-gray-50 group-hover:bg-black group-hover:text-white rounded-lg text-center text-[9px] font-black uppercase tracking-widest transition-all block">
                VIEW DETAILS
              </NuxtLink>
            </template>

            <!-- Archive type card (speeches, reports, etc.) -->
            <template v-else>
              <div class="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-black flex items-center justify-center mb-6 md:mb-8 text-white transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <svg v-if="item.type === 'speech'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <svg v-else-if="item.type === 'report' || item.type === 'publication'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 class="text-lg md:text-xl font-black mb-3 md:mb-4 tracking-tighter uppercase line-clamp-2 group-hover:text-gray-500 transition-colors leading-tight">{{ item.title }}</h4>
              <p class="text-gray-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-6 md:mb-10">
                {{ item.type }} • {{ item.month ? months[item.month - 1] : '' }} {{ item.year || new Date(item.date).getFullYear() }}
              </p>
              <a :href="item.fileUrl" target="_blank" class="w-full py-3 md:py-4 bg-gray-50 group-hover:bg-black group-hover:text-white rounded-lg text-center text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all block">
                DOWNLOAD
              </a>
            </template>
          </div>
        </div>
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
