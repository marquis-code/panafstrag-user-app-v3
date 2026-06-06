<script setup lang="ts">
import { useFetchPrograms } from '@/composables/modules/programs/useFetchPrograms'
import { useFetchObjectives } from '@/composables/modules/objective/useObjective'
import { useFetchResponsibilities } from '@/composables/modules/responsibility/useResponsibility'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
import { useActiveBanner } from '@/composables/modules/active-banner/useActiveBanner'
import { useI18n } from '@/composables/useI18n'
import { ref, computed } from 'vue'

const { programs: allPrograms, loading: programsLoading } = useFetchPrograms()
const { t } = useI18n()
const { objectives, loading: objectivesLoading } = useFetchObjectives()
const { responsibilities, loading: responsibilitiesLoading } = useFetchResponsibilities()
const { homeContent, loading: homeContentLoading } = useHomeContent()
const { activeBanner, loading: bannerLoading } = useActiveBanner()

const pending = computed(() =>
  programsLoading.value ||
  objectivesLoading.value ||
  responsibilitiesLoading.value ||
  homeContentLoading.value ||
  bannerLoading.value
)

const showShareModal = ref(false)
const selectedProgramToShare = ref({})

const openShareModal = (program: any) => {
  selectedProgramToShare.value = program
  showShareModal.value = true
}

const bannerProgram = computed(() => activeBanner.value?.programId || null)

const bannerProgramStatus = computed(() => {
  if (!bannerProgram.value) return ''
  const p = bannerProgram.value as any
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const pDateStr = p.date || p.startDate
  const pDate = pDateStr ? new Date(pDateStr) : null
  if (pDate) {
    const compareDate = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate())
    return compareDate < today ? 'past' : 'upcoming'
  }
  return p.type || 'upcoming'
})

const programs = computed(() => {
  const progs = (allPrograms.value as any[]) || []
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return progs.map(p => {
    if (!p) return {}
    const pDateStr = p?.date || p?.startDate
    const pDate = pDateStr ? new Date(pDateStr) : null
    let calculatedStatus = p?.type || 'upcoming'

    if (pDate) {
      const compareDate = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate())
      calculatedStatus = compareDate < today ? 'past' : 'upcoming'
    }

    return { ...p, calculatedStatus }
  }).slice(0, 3)
})

useHead({
  title: 'PANAFSTRAG | Panafricana Strategic & Policy Research Group',
})
</script>

<template>
  <div class="min-h-screen bg-white font-body">

    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <HeroSection
      :establishedText="homeContent?.heroEstablishedText"
      :carousels="homeContent?.carousels || [
        {
          title: t('Strategic Research'),
          description: t('Providing deep strategic insights and policy recommendations to foster sustainable development and security across the African continent.'),
          imgUrl: ''
        }
      ]"
    />

    <!-- ─── ACTIVE PROGRAMME SPOTLIGHT ───────────────────────── -->
    <section v-if="bannerProgram" class="bg-slate-50 border-y border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">

        <!-- Section label -->
        <div class="mb-8">
          <div class="inline-flex items-center gap-2 bg-green-50 text-green-800 text-xs font-semibold px-4 py-2 rounded-full border border-green-100">
            <span class="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse inline-block"></span>
            {{ t('Active Programme') }}
          </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-md transition-all duration-300">
          <div class="grid lg:grid-cols-12">

            <!-- Image -->
            <div class="lg:col-span-5 relative aspect-video lg:aspect-auto lg:min-h-[420px] overflow-hidden">
              <img
                v-if="bannerProgram?.bannerImages?.length"
                :src="bannerProgram.bannerImages[0]"
                class="w-full h-full object-cover"
              />
              <img
                v-else-if="bannerProgram?.imageUrl"
                :src="bannerProgram.imageUrl"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <!-- Status badge overlay -->
              <div class="absolute top-5 left-5">
                <span
                  class="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                  :class="bannerProgramStatus === 'upcoming'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="bannerProgramStatus === 'upcoming' ? 'bg-green-600' : 'bg-slate-400'"></span>
                  {{ bannerProgramStatus }}
                </span>
              </div>
            </div>

            <!-- Info -->
            <div class="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center">
              <p class="text-[11px] font-semibold text-green-700 tracking-widest uppercase mb-3">{{ t('Featured Programme') }}</p>

              <h2 class="text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 leading-[1.15] tracking-tight mb-4">
                {{ bannerProgram?.title }}
              </h2>

              <p v-if="bannerProgram?.theme" class="text-[15px] text-slate-500 leading-relaxed mb-8 max-w-lg">
                {{ bannerProgram?.theme }}
              </p>

              <!-- Meta chips -->
              <div class="flex flex-wrap gap-3 mb-8">
                <div
                  v-if="bannerProgram?.date"
                  class="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-[13px] font-semibold text-slate-700">
                    {{ new Date(bannerProgram.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                  </span>
                </div>
                <div
                  v-if="bannerProgram?.location"
                  class="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-[13px] font-semibold text-slate-700">{{ bannerProgram?.location }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-wrap items-center gap-4">
                <NuxtLink
                  :to="`/programs/${bannerProgram?._id}`"
                  class="inline-flex items-center gap-2 bg-[#1a5c2a] hover:bg-green-900 text-white text-[14px] font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  {{ t('View details') }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </NuxtLink>
                <NuxtLink
                  v-if="bannerProgram?.registerLink"
                  :to="bannerProgram.registerLink"
                  target="_blank"
                  class="inline-flex items-center gap-2 text-[14px] font-semibold text-slate-600 hover:text-green-700 transition-colors duration-200 border-b border-slate-300 hover:border-green-700 pb-0.5"
                >
                  {{ t('Join virtual room') }}
                </NuxtLink>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>


    <!-- ─── ABOUT US ──────────────────────────────────────────── -->
    <section v-if="homeContent" class="bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div class="grid lg:grid-cols-12 gap-10 items-center">

          <!-- Left: label + heading -->
          <div class="lg:col-span-5">
            <div class="inline-flex items-center gap-2 bg-green-50 text-green-800 text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-green-100">
              {{ homeContent.aboutUsSubTitle || t('Who We Are') }}
            </div>
            <h2
              class="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 leading-[1.1] tracking-tight"
              v-html="homeContent.aboutUsTitle || t('About') + ' <span class=\'text-[#1a5c2a]\'>' + t('PANAFSTRAG') + '</span>'"
            ></h2>
          </div>

          <!-- Right: body text -->
          <div class="lg:col-span-7">
            <p
              class="text-[16px] text-slate-500 leading-relaxed whitespace-pre-line"
              v-html="homeContent.aboutUsDescription || t('Panafricana Strategic & Policy Research Group was founded in 1992 to provide an in-depth study and analysis of the challenges of political stability, safety and development in Africa and propose policy options and strategies for these issues while synergising the potentials of its diaspora for executing these policies.')"
            ></p>
          </div>
        </div>
      </div>
    </section>


    <!-- ─── OBJECTIVES ────────────────────────────────────────── -->
    <section class="bg-slate-50 border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

        <!-- Header -->
        <div class="mb-12">
          <div class="inline-flex items-center gap-2 bg-white text-green-800 text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-green-100">
            <!-- <span v-html="homeContent?.objectivesSubTitle || t('Strategic Alignment')"></span> -->
          </div>
          <h2
            class="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 leading-[1.1] tracking-tight max-w-lg"
            v-html="homeContent?.objectivesTitle || t('Institutional') + ' <span class=\'text-[#1a5c2a]\'>' + t('Objectives') + '</span>'"
          ></h2>
        </div>

        <!-- Grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <template v-if="objectivesLoading">
            <div v-for="i in 6" :key="i" class="bg-white border border-slate-200 rounded-2xl p-7 animate-pulse h-40"></div>
          </template>
          <template v-else>
            <div
              v-for="(obj, i) in (objectives as any[])"
              :key="i"
              class="bg-white border border-slate-200 rounded-2xl p-7 hover:border-green-200 hover:shadow-sm transition-all duration-300 flex items-start gap-5"
            >
              <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                <span class="text-[13px] font-bold text-green-700">{{ (i + 1).toString().padStart(2, '0') }}</span>
              </div>
              <p class="text-[14px] text-slate-600 font-medium leading-relaxed" v-html="obj.description"></p>
            </div>

            <div v-if="!(objectives as any[])?.length" class="sm:col-span-2 lg:col-span-3 bg-white border border-dashed border-slate-200 rounded-2xl py-16 text-center">
              <p class="text-[14px] text-slate-400 font-medium">{{ t('Strategic objectives pending…') }}</p>
            </div>
          </template>
        </div>

      </div>
    </section>


    <!-- ─── RESPONSIBILITIES ───────────────────────────────────── -->
    <section class="bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

        <!-- Header -->
        <div class="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 bg-slate-50 text-green-800 text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-green-100">
              <!-- <span v-html="homeContent?.responsibilitiesSubTitle || t('Code of Conduct')"></span> -->
            </div>
            <h2
              class="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 leading-[1.1] tracking-tight max-w-lg"
              v-html="homeContent?.responsibilitiesTitle || t('Core') + ' <span class=\'text-[#1a5c2a]\'>' + t('Responsibilities') + '</span>'"
            ></h2>
          </div>
        </div>

        <!-- Grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <template v-if="responsibilitiesLoading">
            <div v-for="i in 6" :key="i" class="bg-slate-50 border border-slate-100 rounded-2xl p-7 animate-pulse h-36"></div>
          </template>
          <template v-else>
            <div
              v-for="(res, i) in (responsibilities as any[])"
              :key="i"
              class="group bg-slate-50 border border-slate-100 rounded-2xl p-7 hover:bg-[#1a5c2a] hover:border-green-800 transition-all duration-300 cursor-default"
            >
              <p class="text-[14px] font-medium leading-relaxed text-slate-600 group-hover:text-white transition-colors duration-300" v-html="res.description"></p>
            </div>
            <div v-if="!(responsibilities as any[])?.length" class="sm:col-span-2 lg:col-span-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl py-16 text-center">
              <p class="text-[14px] text-slate-400 font-medium">{{ t('Commitments under review…') }}</p>
            </div>
          </template>
        </div>

      </div>
    </section>


    <!-- ─── RECENT PROGRAMMES ─────────────────────────────────── -->
    <section class="bg-slate-50 border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div
              v-if="homeContent?.programsSubTitle"
              class="inline-flex items-center gap-2 bg-white text-green-800 text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-green-100"
            >
              <span v-html="homeContent.programsSubTitle"></span>
            </div>
            <h2
              class="text-3xl sm:text-4xl lg:text-[42px] font-bold text-slate-900 leading-[1.1] tracking-tight"
              v-html="homeContent?.programsTitle || t('Recent') + ' <span class=\'text-[#1a5c2a]\'>' + t('Programmes') + '</span>'"
            ></h2>
          </div>

          <NuxtLink
            to="/programs"
            class="inline-flex items-center gap-2 text-[14px] font-semibold text-slate-600 hover:text-green-700 transition-colors duration-200 flex-shrink-0"
          >
            {{ t('View all programmes') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Loading skeletons -->
        <div v-if="pending" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="i in 3" :key="i" class="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
            <div class="aspect-[4/3] bg-slate-100"></div>
            <div class="p-6 space-y-3">
              <div class="h-3 bg-slate-100 rounded w-1/3"></div>
              <div class="h-5 bg-slate-100 rounded w-3/4"></div>
              <div class="h-4 bg-slate-100 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Programme cards -->
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="(program, i) in (programs as any[])"
            :key="program._id"
            class="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-md transition-all duration-300 flex flex-col"
          >
            <!-- Image -->
            <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <img
                v-if="program?.bannerImages?.length"
                :src="program.bannerImages[0]"
                alt=""
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <img
                v-else-if="program?.imageUrl"
                :src="program.imageUrl"
                alt=""
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <!-- Status badge -->
              <div class="absolute top-4 left-4">
                <span
                  class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                  :class="program?.calculatedStatus === 'upcoming'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-white/80 text-slate-600 border border-slate-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="program?.calculatedStatus === 'upcoming' ? 'bg-green-600 animate-pulse' : 'bg-slate-400'"></span>
                  {{ program?.calculatedStatus }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex flex-col flex-1">
              <p class="text-[11px] font-semibold text-slate-400 tracking-widest uppercase mb-2">
                {{ program?.startDate || program?.date
                    ? new Date(program.date || program.startDate).getFullYear()
                    : '' }}
              </p>
              <h4 class="text-[17px] font-bold text-slate-800 leading-snug mb-4 line-clamp-2 group-hover:text-[#1a5c2a] transition-colors duration-200 flex-1">
                {{ program?.title }}
              </h4>

              <!-- Footer -->
              <div class="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                <NuxtLink
                  :to="`/programs/${program?._id}`"
                  class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1a5c2a] hover:underline"
                >
                  {{ t('Read details') }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </NuxtLink>
                <button
                  @click.prevent="openShareModal(program)"
                  class="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all duration-200"
                  :title="t('Share programme')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!(programs as any[])?.length" class="sm:col-span-2 lg:col-span-3 bg-white border border-dashed border-slate-200 rounded-2xl py-20 text-center">
            <p class="text-[14px] text-slate-400 font-medium">{{ t('No recent programmes found.') }}</p>
          </div>
        </div>

      </div>
    </section>


    <!-- ─── CTA ───────────────────────────────────────────────── -->
    <section class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div class="bg-[#1a5c2a] rounded-2xl p-10 lg:p-16 relative overflow-hidden">
          <!-- Decorative globe icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute -right-8 -bottom-8 w-52 h-52 opacity-[0.06] text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <div class="max-w-2xl relative z-10">
            <p class="text-[11px] font-semibold text-green-300 tracking-widest uppercase mb-4">{{ t('Get Involved') }}</p>
            <h2
              class="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.1] tracking-tight mb-5"
              v-html="homeContent?.ctaTitle || t('Participate in') + ' <span class=\'text-green-300\'>' + t('the Future.') + '</span>'"
            ></h2>
            <p
              class="text-[15px] text-green-200 leading-relaxed mb-10 max-w-lg"
              v-html="homeContent?.ctaDescription || t('Join a network of leading experts dedicated to solving the most pressing strategic challenges facing the African continent today.')"
            ></p>
            <div class="flex flex-wrap items-center gap-4">
              <button
                class="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#1a5c2a] text-[14px] font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200"
              >
                {{ t('Get involved') }}
              </button>
              <NuxtLink
                to="/contact"
                class="inline-flex items-center gap-2 text-[14px] font-semibold text-green-200 hover:text-white transition-colors duration-200 border-b border-green-500 hover:border-white pb-0.5"
              >
                {{ t('Contact our group') }}
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── SHARE MODAL ───────────────────────────────────────── -->
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