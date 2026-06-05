<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useFetchArchives } from '@/composables/modules/archives/useFetchArchives'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
import { programs_api } from '@/api_factory/modules/programs'

const { t } = useI18n()
const showShareModal = ref(false)
const selectedProgramToShare = ref({})

const openShareModal = (program: any) => {
  selectedProgramToShare.value = program
  showShareModal.value = true
}

const { archives: allArchives, loading: archivesLoading } = useFetchArchives()
const { homeContent } = useHomeContent()

const { data: pastProgramsData, pending: pastProgramsLoading } = useAsyncData(
  `past-programs-archive_${typeof window !== 'undefined' ? localStorage.getItem('app-lang') || 'en' : 'en'}`,
  async () => {
    try {
      const res = await programs_api.getPastPrograms() as any
      if ([200, 201].includes(res?.status)) {
        return (res.data?.data ?? res.data ?? []).map((p: any) => ({
          ...p,
          type: 'program',
          fileUrl: null,
          _source: 'program'
        }))
      }
    } catch (e) {}
    return []
  },
  { lazy: true, server: true }
)

const pastPrograms = computed(() => pastProgramsData.value || [])
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

const mergedItems = computed(() => {
  const archives = (allArchives.value as any[]) || []
  const programs = pastPrograms.value || []
  const combined = [...archives, ...programs]
  const seen = new Set()
  return combined.filter(item => {
    if (!item?._id) return true
    const id = item._id.toString()
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
})

const filterTypes = ['all', 'program', 'speech', 'report', 'publication', 'media']

const filteredArchives = computed(() => {
  let items = mergedItems.value
  if (filter.value !== 'all') {
    items = items.filter(p => {
      if (filter.value === 'program') {
        return p.type === 'program' || p.type === 'programme' || p._source === 'program'
      }
      return p.type === filter.value
    })
  }
  if (selectedYear.value !== 'all') {
    items = items.filter(p => {
      const pYear = p?.date
        ? new Date(p.date).getFullYear()
        : (p?.startDate && !isNaN(new Date(p.startDate).getTime())
            ? new Date(p.startDate).getFullYear()
            : (p?.year || null))
      return pYear === parseInt(selectedYear.value)
    })
  }
  if (selectedMonth.value !== 'all') {
    items = items.filter(p => {
      if (!p) return false
      const pMonth = p?.date
        ? (new Date(p.date).getMonth() + 1)
        : (p?.startDate && !isNaN(new Date(p.startDate).getTime())
            ? (new Date(p.startDate).getMonth() + 1)
            : (p?.month || null))
      return pMonth === parseInt(selectedMonth.value)
    })
  }
  return items
})

const groupedArchivesByYear = computed(() => {
  const items = filteredArchives.value
  const groups: Record<number, any[]> = {}
  for (const item of items) {
    if (!item) continue
    const year = item?.date
      ? new Date(item.date).getFullYear()
      : (item?.startDate && !isNaN(new Date(item.startDate).getTime())
          ? new Date(item.startDate).getFullYear()
          : (item?.year || 0))
    if (!groups[year]) groups[year] = []
    groups[year].push(item)
  }
  return Object.keys(groups)
    .map(Number)
    .sort((a, b) => b - a)
    .map(year => ({ year, items: groups[year] }))
})

const isLoading = computed(() => archivesLoading.value || pastProgramsLoading.value)

useHead({ title: 'Archives | PANAFSTRAG' })
</script>

<template>
  <div class="font-body min-h-screen bg-white">

    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <section class="bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pb-20">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 bg-green-50 text-[#2E7D32] text-xs font-semibold px-4 py-2 rounded-full mb-7 border border-green-100">
            <LucideArchive :size="13" />
            {{ t('Resource Archive') }}
          </div>
          <h1
            class="text-4xl sm:text-5xl lg:text-[56px] font-black text-slate-900 leading-[1.1] tracking-tight mb-6"
            v-html="homeContent?.archivesPageTitle || t('Institutional_Archives_HTML')"
          />
          <p
            class="text-[16px] text-slate-500 leading-relaxed max-w-[560px] mx-auto"
            v-html="homeContent?.archivesPageDescription || t('Archives_Description')"
          />
        </div>
      </div>
    </section>


    <!-- ─── FILTERS STRIP ────────────────────────────────────── -->
    <section class="bg-slate-50 border-b border-slate-100 sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">

          <!-- Type filter tabs -->
          <div class="inline-flex p-1 bg-white rounded-xl border border-slate-200 overflow-x-auto max-w-full no-scrollbar">
            <button
              v-for="f in filterTypes"
              :key="f"
              @click="filter = f"
              :class="[
                'px-4 py-2 rounded-lg text-[12px] font-bold transition-all whitespace-nowrap',
                filter === f
                  ? 'bg-[#2E7D32] text-white shadow-sm'
                  : 'text-slate-400 hover:text-[#2E7D32] hover:bg-green-50'
              ]"
            >
              {{ f === 'program' ? t('PAST_PROGRAMMES') : t(f) }}
            </button>
          </div>

          <!-- Year & Month -->
          <div class="flex items-center gap-3 w-full md:w-auto">
            <div class="relative w-40 lg:w-48">
              <select
                v-model="selectedYear"
                class="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[12px] font-bold text-slate-700 cursor-pointer outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-green-50 transition-all pr-8"
              >
                <option value="all">{{ t('ALL_YEARS') }}</option>
                <option v-for="y in years" :key="y.value" :value="y.value">{{ y.label }}</option>
              </select>
              <LucideChevronDown :size="14" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 -translate-x-3"
              enter-to-class="opacity-100 translate-x-0"
            >
              <div v-if="selectedYear !== 'all'" class="relative w-40 lg:w-48">
                <select
                  v-model="selectedMonth"
                  class="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[12px] font-bold text-slate-700 cursor-pointer outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-green-50 transition-all pr-8"
                >
                  <option value="all">{{ t('ALL_MONTHS') }}</option>
                  <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                </select>
                <LucideChevronDown :size="14" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Transition>
          </div>

        </div>
      </div>
    </section>


    <!-- ─── MAIN CONTENT ─────────────────────────────────────── -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">

        <!-- Skeletons -->
        <div v-if="isLoading" class="space-y-16">
          <div v-for="g in 2" :key="g" class="space-y-8">
            <div class="h-8 w-48 bg-slate-100 rounded-xl animate-pulse" />
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div v-for="i in 3" :key="i" class="h-[380px] bg-slate-50 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>

        <!-- Grouped by year -->
        <div v-else-if="groupedArchivesByYear?.length" class="space-y-20">
          <div v-for="group in groupedArchivesByYear" :key="group.year" class="space-y-10">

            <!-- Year header -->
            <div class="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div class="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                <LucideCalendar :size="18" class="text-[#2E7D32]" />
              </div>
              <div>
                <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-0.5">{{ t('Archive_Year') }}</p>
                <h2 class="text-[28px] font-black text-slate-900 leading-none">
                  {{ group.year }}
                </h2>
              </div>
            </div>

            <!-- Cards grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div
                v-for="(item, i) in group.items"
                :key="item._id"
                class="group animate-fade-in-up"
                :class="`delay-${(i % 3 + 1) * 100}`"
              >

                <!-- Programme card -->
                <template v-if="item?._source === 'program' || item?.type === 'programme'">
                  <div class="relative h-full">
                    <NuxtLink :to="`/programs/${item?._id}`" class="block h-full">
                      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-green-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">

                        <!-- Image -->
                        <div class="aspect-[4/5] bg-green-50 overflow-hidden relative">
                          <img
                            v-if="item?.bannerImages?.length"
                            :src="item.bannerImages[0]"
                            class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                          />
                          <img
                            v-else
                            src="@/assets/images/program-placeholder.png"
                            class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                          />

                          <!-- Programme badge -->
                          <span class="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-[#2E7D32] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                            <LucideLayoutList :size="11" />
                            {{ t('PROGRAMME') }}
                          </span>
                        </div>

                        <!-- Body -->
                        <div class="p-5 space-y-3">
                          <p class="text-[11px] font-bold text-[#2E7D32] tracking-widest uppercase">
                            {{ item?.date
                              ? new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                              : (item?.startDate || '') }}
                            <template v-if="item?.startTime">
                              · {{ item.startTime }}<span v-if="item.endTime"> – {{ item.endTime }}</span>
                            </template>
                          </p>
                          <h4 class="text-[17px] font-black text-slate-800 group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
                            {{ item?.title }}
                          </h4>
                          <div class="pt-1">
                            <span class="inline-flex items-center gap-1.5 text-[11px] font-black text-slate-700 border-b-2 border-slate-800 pb-0.5 group-hover:border-[#2E7D32] group-hover:text-[#2E7D32] transition-all uppercase tracking-widest">
                              {{ t('VIEW_DETAILS') }}
                              <LucideArrowRight :size="11" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </NuxtLink>

                    <!-- Share button -->
                    <button
                      @click.prevent="openShareModal(item)"
                      class="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#2E7D32] hover:border-green-300 transition-all z-10"
                      :title="t('SHARE_PROGRAMME')"
                    >
                      <LucideShare2 :size="14" />
                    </button>
                  </div>
                </template>

                <!-- Document archive card -->
                <template v-else>
                  <a :href="item?.fileUrl" target="_blank" class="block h-full">
                    <div class="h-full bg-white border border-slate-200 rounded-2xl p-7 flex flex-col hover:border-green-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">

                      <!-- Decorative circle -->
                      <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-green-50 opacity-60 pointer-events-none" />

                      <!-- Icon -->
                      <div class="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-6 group-hover:bg-[#2E7D32] group-hover:border-[#2E7D32] transition-all duration-300 flex-shrink-0 relative z-10">
                        <LucideMic
                          v-if="item?.type === 'speech'"
                          :size="20"
                          class="text-[#2E7D32] group-hover:text-white transition-colors"
                        />
                        <LucideFileText
                          v-else-if="item?.type === 'report' || item?.type === 'publication'"
                          :size="20"
                          class="text-[#2E7D32] group-hover:text-white transition-colors"
                        />
                        <LucideVideo
                          v-else
                          :size="20"
                          class="text-[#2E7D32] group-hover:text-white transition-colors"
                        />
                      </div>

                      <!-- Meta + title -->
                      <div class="flex-grow relative z-10">
                        <p class="text-[11px] font-bold text-[#2E7D32] tracking-widest uppercase mb-3">
                          {{ t(item?.type) }}
                          <span class="text-slate-300 mx-1">·</span>
                          {{ item?.month ? months[item.month - 1] : '' }} {{ item?.year || (item?.date ? new Date(item.date).getFullYear() : '') }}
                        </p>
                        <h4 class="text-[17px] font-black text-slate-800 group-hover:text-[#2E7D32] transition-colors line-clamp-3 leading-snug">
                          {{ item?.title }}
                        </h4>
                      </div>

                      <!-- Download link -->
                      <div class="mt-6 pt-5 border-t border-slate-100 group-hover:border-green-100 transition-colors relative z-10">
                        <span class="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 border-b-2 border-transparent pb-0.5 group-hover:border-[#2E7D32] group-hover:text-[#2E7D32] transition-all">
                          {{ t('DOWNLOAD_RESOURCE') }}
                          <LucideDownload :size="13" />
                        </span>
                      </div>
                    </div>
                  </a>
                </template>

              </div>
            </div>

          </div>
        </div>

        <!-- Empty state -->
        <div v-else>
          <EmptyState
            :title="t('ARCHIVES_EMPTY')"
            :message="t('ARCHIVES_EMPTY_MSG')"
          />
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

<script lang="ts">
import {
  LucideArchive,
  LucideCalendar,
  LucideCalendarDays,
  LucideLayoutList,
  LucideMic,
  LucideFileText,
  LucideVideo,
  LucideDownload,
  LucideShare2,
  LucideArrowRight,
  LucideChevronDown,
} from 'lucide-vue-next'
</script>

<style scoped>
.font-body {
  font-family: 'DM Sans', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>