<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useFetchPrograms } from '@/composables/modules/programs/useFetchPrograms'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { t, locale } = useI18n()
const { programs: allPrograms, loading: pending } = useFetchPrograms()
const { homeContent } = useHomeContent()
const { showToast } = useCustomToast()

const route = useRoute()
const selectedYear = ref(route.query.year as string || 'all')
const selectedMonth = ref(route.query.month as string || 'all')

const showShareModal = ref(false)
const selectedProgramToShare = ref({})

const shareProgram = (program: any) => {
  selectedProgramToShare.value = program
  showShareModal.value = true
}

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
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  progs = progs.map(p => {
    if (!p) return {}
    const pDateStr = p?.date || p?.startDate
    const pDate = pDateStr ? new Date(pDateStr) : null
    let calculatedStatus = 'upcoming'
    if (pDate) {
      const compareDate = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate())
      calculatedStatus = compareDate < today ? 'past' : 'upcoming'
    }
    return { ...p, calculatedStatus }
  })

  if (selectedYear.value !== 'all') {
    progs = progs.filter(p => {
      if (!p) return false
      const pYear = p?.date ? new Date(p.date).getFullYear() : (p?.startDate ? new Date(p.startDate).getFullYear() : (p?.year || null))
      return pYear === parseInt(selectedYear.value)
    })
  }

  if (selectedMonth.value !== 'all') {
    progs = progs.filter(p => {
      if (!p) return false
      const pMonth = p?.date ? (new Date(p.date).getMonth() + 1) : (p?.startDate ? (new Date(p.startDate).getMonth() + 1) : (p?.month || null))
      return pMonth === parseInt(selectedMonth.value)
    })
  }

  return progs
})

const groupedProgramsByYear = computed(() => {
  const progs = filteredPrograms.value
  const groups: Record<number, any[]> = {}
  for (const prog of progs) {
    if (!prog) continue
    const year = prog?.date ? new Date(prog.date).getFullYear() : (prog?.startDate ? new Date(prog.startDate).getFullYear() : (prog?.year || 0))
    if (!groups[year]) groups[year] = []
    groups[year].push(prog)
  }
  return Object.keys(groups)
    .map(Number)
    .sort((a, b) => b - a)
    .map(year => ({ year, programs: groups[year] }))
})

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'upcoming': return 'bg-green-50 text-[#2E7D32] border border-green-200'
    case 'past': return 'bg-slate-100 text-slate-500 border border-slate-200'
    default: return 'bg-blue-50 text-blue-600 border border-blue-100'
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return date
  }
}

useHead({
  title: 'Programmes | PANAFSTRAG',
})
</script>

<template>
  <div class="min-h-screen bg-white font-body">

    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <section class="bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pb-20">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-green-50 text-[#2E7D32] text-xs font-semibold px-4 py-2 rounded-full mb-7 border border-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {{ t('Strategic Programmes') }}
          </div>
          <h1
            class="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
            v-html="homeContent?.programsPageTitle || t('Strategic_Programmes_HTML')"
          ></h1>
          <p
            class="text-[16px] text-slate-500 leading-relaxed max-w-[580px]"
            v-html="homeContent?.programsPageDescription || t('Programs_Description')"
          ></p>
        </div>
      </div>
    </section>

    <!-- ─── FILTER STRIP ─────────────────────────────────────── -->
    <section class="bg-slate-50 border-b border-slate-100 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-[11px] font-semibold text-slate-400 tracking-widest uppercase mr-1">{{ t('Filter_Year') }}</span>

          <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <CustomDropdown
              v-model="selectedYear"
              :options="[{ label: t('ALL_YEARS'), value: 'all' }, ...years]"
              variant="flat"
            />
          </div>

          <div v-if="selectedYear !== 'all'" class="bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center gap-2 px-3">
            <span class="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">{{ t('Month') }}</span>
            <CustomDropdown
              v-model="selectedMonth"
              :options="[{ label: t('ALL_MONTHS'), value: 'all' }, ...monthOptions]"
              variant="flat"
            />
          </div>

          <div
            v-if="selectedYear !== 'all' || selectedMonth !== 'all'"
            class="ml-auto inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 hover:text-[#2E7D32] cursor-pointer transition-colors"
            @click="selectedYear = 'all'; selectedMonth = 'all'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Clear filters
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CONTENT ───────────────────────────────────────────── -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">

        <!-- Skeleton -->
        <div v-if="pending" class="space-y-16">
          <div v-for="g in 2" :key="g" class="space-y-8">
            <div class="flex items-center gap-6">
              <div class="h-10 w-28 bg-slate-100 rounded-xl animate-pulse"></div>
              <div class="h-px flex-1 bg-slate-100"></div>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="i in 3" :key="i" class="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
                <div class="aspect-[16/10] bg-slate-100"></div>
                <div class="p-6 space-y-3">
                  <div class="h-3 bg-slate-100 rounded-full w-1/3"></div>
                  <div class="h-5 bg-slate-100 rounded-full w-3/4"></div>
                  <div class="h-3 bg-slate-100 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grouped programmes -->
        <div v-else-if="groupedProgramsByYear?.length" class="space-y-20">
          <div v-for="group in groupedProgramsByYear" :key="group.year" class="space-y-8">

            <!-- Year divider -->
            <div class="flex items-center gap-5">
              <div class="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-[#2E7D32] text-[13px] font-bold px-5 py-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ group.year }}
              </div>
              <div class="h-px flex-1 bg-slate-100"></div>
              <span class="text-[12px] font-semibold text-slate-300">{{ group.programs.length }} {{ group.programs.length === 1 ? 'programme' : 'programmes' }}</span>
            </div>

            <!-- Cards -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(program, i) in group.programs"
                :key="program._id"
                class="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-md transition-all duration-300 flex flex-col"
                :style="{ animationDelay: `${(i % 3) * 80}ms` }"
              >
                <!-- Image -->
                <div class="aspect-[16/10] overflow-hidden relative bg-slate-100">
                  <img
                    v-if="program?.bannerImages?.length"
                    :src="program.bannerImages[0]"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <img
                    v-else
                    src="@/assets/images/program-placeholder.png"
                    alt=""
                    class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100"
                  />

                  <!-- Status badge -->
                  <div class="absolute top-4 left-4">
                    <span
                      class="text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-sm"
                      :class="getStatusColor(program?.calculatedStatus)"
                    >
                      {{ t(program?.calculatedStatus) }}
                    </span>
                  </div>
                </div>

                <!-- Body -->
                <div class="p-6 flex flex-col flex-1 space-y-4">
                  <!-- Date -->
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <p class="text-[12px] font-semibold text-slate-400">
                      {{ formatDate(program?.date) || program?.startDate }}
                      <span v-if="program?.startTime"> · {{ program.startTime }}<span v-if="program.endTime"> – {{ program.endTime }}</span></span>
                    </p>
                  </div>

                  <!-- Title -->
                  <h3 class="text-[16px] font-bold text-slate-800 leading-snug group-hover:text-[#2E7D32] transition-colors duration-200 line-clamp-2">
                    {{ program?.title ? t(program.title) : '' }}
                  </h3>

                  <!-- Theme -->
                  <p
                    v-if="program?.theme"
                    class="text-[12px] font-semibold text-slate-400 leading-relaxed line-clamp-2 border-l-2 border-green-100 pl-3 py-0.5 italic"
                  >
                    "{{ program.theme ? t(program.theme) : '' }}"
                  </p>

                  <!-- Description -->
                  <p
                    class="text-[13px] text-slate-500 leading-relaxed line-clamp-3 flex-1"
                    v-html="program?.description ? t(program.description) : ''"
                  ></p>

                  <!-- Footer -->
                  <div class="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <NuxtLink
                      :to="`/programs/${program?._id}`"
                      class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2E7D32] hover:gap-2.5 transition-all duration-200"
                    >
                      {{ t('Details') }}
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </NuxtLink>

                    <div class="flex gap-2">
                      <!-- Share -->
                      <button
                        @click.prevent="shareProgram(program)"
                        class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#2E7D32] hover:text-white hover:border-[#2E7D32] transition-all duration-200"
                        title="Share"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                      </button>

                      <!-- Register -->
                       <a
                        v-if="program?.registerLink"
                        :href="program.registerLink"
                        target="_blank"
                        class="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white hover:border-[#2E7D32] transition-all duration-200"
                        title="Register"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                      </a>

                      <!-- Video -->
                      <a
                        v-if="program?.uploadedVideoUrl && program?.uploadedVideoUrl !== 'null'"
                        :href="program.uploadedVideoUrl"
                        target="_blank"
                        class="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
                        title="Watch Video"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="flex flex-col items-center justify-center py-24 text-center">
          <div class="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <p class="text-[11px] font-semibold text-green-600 tracking-widest uppercase mb-2">Nothing here yet</p>
          <h3 class="text-[20px] font-bold text-slate-800 mb-2">{{ t('NO_PROGRAMMES_FOUND') }}</h3>
          <p class="text-[14px] text-slate-400 max-w-xs leading-relaxed">{{ t('NO_PROGRAMMES_MSG') }}</p>
        </div>

      </div>
    </section>

    <!-- Share Modal -->
    <ShareModal
      :show="showShareModal"
      :program="selectedProgramToShare"
      @close="showShareModal = false"
    />

  </div>
</template>

<style scoped>
.font-body {
  font-family: 'DM Sans', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}
</style>