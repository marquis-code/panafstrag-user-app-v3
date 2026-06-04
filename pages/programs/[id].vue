<script setup lang="ts">

import { useI18n } from '@/composables/useI18n'
import { useFetchProgram } from '@/composables/modules/programs/useFetchProgram'
import { useCustomToast } from "@/composables/core/useCustomToast"


const { t, locale } = useI18n()
const route = useRoute()
const { program, loading, fetchProgram } = useFetchProgram()

const heroImage = computed(() => {
  if (program.value?.bannerImages?.length) return program.value.bannerImages[0]
  if (program.value?.imageUrl) return program.value.imageUrl
  return null
})

const hasVirtualLinks = computed(() => {
  return program.value?.zoomMeetingUrl || program.value?.googleMeetUrl || program.value?.uploadedVideoUrl
})

const isArchived = computed(() => {
  return !!program.value?.isArchived
})

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return ''
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  return url
}

const formatDate = (date: any) => {
  if (!date || date === 'null') return 'TBD'
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return date
    return d.toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch (err) {
    return date
  }
}

useHead({
  title: computed(() => `${program.value?.title || 'Programme'} | PANAFSTRAG`),
})

const getDocTitle = (url: string) => {
  if (!url) return 'Module Documentation'
  const parts = url.split('/')
  const name = parts[parts.length - 1]
  if (!name) return 'Document'
  const cleanName = name.includes('_') ? name.split('_').slice(1).join('_') : name
  return cleanName?.split('.')[0].replace(/-/g, ' ').replace(/_/g, ' ') || 'Document'
}

const getDocExt = (url: string) => {
  return url.split('.').pop()?.toUpperCase() || 'DOC'
}

const pdfDocuments = computed(() => {
  if (!program.value?.uploadedDocumentFiles?.length) return []
  return (program.value.uploadedDocumentFiles as string[]).filter(
    (doc: string) => getDocExt(doc) === 'PDF'
  )
})

const selectedPdfIndex = ref(0)
const { showToast } = useCustomToast()

const showShareModal = ref(false)

const handleShare = () => {
  showShareModal.value = true
}
</script>

<template>
  <div class="min-h-screen bg-white font-body">

    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <section class="relative bg-[#1A3A1C] overflow-hidden">
      <!-- Background image -->
      <div class="absolute inset-0 z-0">
        <img v-if="heroImage" :src="heroImage" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#1A3A1C] via-[#1A3A1C]/75 to-black/40"></div>
      </div>

      <!-- Subtle orbs -->
      <div class="absolute top-20 right-[-8%] w-[420px] h-[420px] bg-[#2E7D32]/20 rounded-full blur-[130px] pointer-events-none"></div>
      <div class="absolute bottom-[-10%] left-[-4%] w-[360px] h-[360px] bg-[#2E7D32]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-64 relative z-10">

        <!-- Back link -->
        <NuxtLink
          to="/programs"
          class="inline-flex items-center gap-2 text-white/50 hover:text-white text-[13px] font-semibold transition-colors mb-12 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ t('Back_To_Programmes') }}
        </NuxtLink>

        <!-- Loading skeleton -->
        <div v-if="loading" class="space-y-5 animate-pulse">
          <div class="h-5 bg-white/10 w-32 rounded-full"></div>
          <div class="h-14 bg-white/10 w-3/4 rounded-2xl"></div>
          <div class="h-6 bg-white/10 w-1/2 rounded-full"></div>
        </div>

        <!-- Hero content -->
        <div v-else-if="program" class="space-y-6 animate-fade-in">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[12px] font-semibold text-white/80 border border-white/10">
              {{ program?.type ? t(program.type) : '' }}
            </span>
            <span
              v-if="program?.status"
              class="inline-flex items-center px-4 py-1.5 bg-[#2E7D32]/80 backdrop-blur-md rounded-full text-[12px] font-semibold text-white border border-white/10"
            >
              {{ program?.status ? t(program.status) : '' }}
            </span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-[60px] font-bold leading-[1.1] tracking-tight max-w-4xl text-white">
            {{ program?.title ? t(program.title) : '' }}
          </h1>

          <p v-if="program?.theme" class="text-lg sm:text-xl text-white/60 font-medium max-w-2xl leading-relaxed">
            "{{ program?.theme ? t(program.theme) : '' }}"
          </p>
        </div>

      </div>
    </section>


    <!-- ─── MAIN CONTENT (pulled up over hero) ───────────────── -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-44 pb-24">
      <div class="flex flex-col lg:flex-row gap-8 items-start">

        <!-- ── Left: Main content ── -->
        <div class="flex-1 min-w-0 space-y-6">

          <!-- Quick info strip -->
          <div class="grid sm:grid-cols-3 gap-4">
            <!-- Date card -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-green-200 hover:shadow-sm transition-all duration-300 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2E7D32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-1">{{ t('Schedule') }}</p>
                <p class="text-[13px] font-semibold text-slate-800 leading-snug">
                  {{ formatDate(program?.startDate || program?.date) }}
                </p>
                <p v-if="program?.startTime" class="text-[12px] text-slate-400 font-medium mt-0.5">
                  {{ program.startTime }}<span v-if="program.endTime"> – {{ program.endTime }}</span>
                </p>
              </div>
            </div>

            <!-- Location card -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-green-200 hover:shadow-sm transition-all duration-300 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2E7D32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-1">{{ t('Location') }}</p>
                <p class="text-[13px] font-semibold text-slate-800 leading-snug">{{ program?.location || t('Virtual') }}</p>
              </div>
            </div>

            <!-- Speakers card -->
            <div v-if="program?.speakers?.length" class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-green-200 hover:shadow-sm transition-all duration-300 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#2E7D32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-1">{{ t('Participation') }}</p>
                <p class="text-[13px] font-semibold text-slate-800">
                  {{ program?.speakers?.length }}
                  {{ program?.speakers?.length === 1 ? t('Speaker') : t('Speakers') }}
                </p>
              </div>
            </div>
          </div>


          <!-- Virtual join bar -->
          <div
            v-if="program && hasVirtualLinks"
            class="bg-[#2E7D32] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 px-7"
          >
            <div class="flex items-center gap-3">
              <div
                v-if="!isArchived && program?.status !== 'completed' && program?.type !== 'past'"
                class="flex items-center gap-3"
              >
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span class="text-white text-[13px] font-semibold">{{ t('Session_Is_Live') }}</span>
              </div>
              <div v-else class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-white text-[13px] font-semibold">{{ t('Past_Session_Links') }}</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-3">
              <a
                v-if="program?.zoomMeetingUrl"
                :href="program?.zoomMeetingUrl"
                target="_blank"
                class="px-5 py-2.5 bg-white text-[#2E7D32] rounded-xl text-[13px] font-semibold hover:bg-green-50 transition-colors"
              >
                {{ t('Watch_Via_Zoom') }}
              </a>
              <a
                v-if="program?.googleMeetUrl"
                :href="program?.googleMeetUrl"
                target="_blank"
                class="px-5 py-2.5 bg-white/15 text-white border border-white/20 rounded-xl text-[13px] font-semibold hover:bg-white/25 transition-colors"
              >
                {{ t('Watch_Via_Meet') }}
              </a>
            </div>
          </div>


          <!-- Dynamic sections -->
          <template v-for="sectionId in (program?.sectionOrder?.length ? program.sectionOrder : ['documents', 'description', 'speakers', 'video', 'agenda', 'gallery'])" :key="sectionId">

            <!-- PDF Document Preview -->
            <div v-if="sectionId === 'documents' && pdfDocuments.length" class="space-y-5">
              <div class="flex items-center gap-3">
                <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase">{{ t('Document_Preview') }}</p>
                <div class="h-px flex-1 bg-slate-100"></div>
              </div>

              <!-- PDF tabs -->
              <div v-if="pdfDocuments.length > 1" class="flex flex-wrap gap-2">
                <button
                  v-for="(doc, idx) in pdfDocuments"
                  :key="idx"
                  @click="selectedPdfIndex = idx"
                  class="px-5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200"
                  :class="selectedPdfIndex === idx
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'"
                >
                  {{ getDocTitle(doc) }}
                </button>
              </div>

              <!-- PDF viewer -->
              <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div class="flex items-center justify-between px-7 py-4 bg-slate-50 border-b border-slate-100">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-[13px] font-semibold text-slate-800 capitalize">{{ getDocTitle(pdfDocuments[selectedPdfIndex] || '') }}</p>
                      <p class="text-[11px] text-slate-400 font-medium">{{ t('PDF_Preview') }}</p>
                    </div>
                  </div>
                  <a
                    :href="pdfDocuments[selectedPdfIndex]"
                    target="_blank"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-[#2E7D32] hover:bg-[#256d29] text-white rounded-xl text-[13px] font-semibold transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {{ t('Download') }}
                  </a>
                </div>
                <div class="w-full" style="height: 600px;">
                  <iframe
                    :key="pdfDocuments[selectedPdfIndex]"
                    :src="pdfDocuments[selectedPdfIndex]"
                    class="w-full h-full border-0"
                    frameborder="0"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>
            </div>


            <!-- Description / Content -->
            <div
              v-if="sectionId === 'description' && (program?.description || program?.content)"
              class="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 animate-fade-in-up"
            >
              <div v-if="loading" class="space-y-4 animate-pulse">
                <div class="h-4 bg-slate-100 w-full rounded-full"></div>
                <div class="h-4 bg-slate-100 w-full rounded-full"></div>
                <div class="h-4 bg-slate-100 w-3/4 rounded-full"></div>
              </div>
              <div v-else-if="program" class="space-y-10">
                <div v-if="program?.description">
                  <div
                    class="text-slate-600 leading-[1.9] text-[15px] font-medium whitespace-pre-wrap"
                    v-html="program?.description ? t(program.description) : ''"
                  ></div>
                </div>
                <div v-if="program?.content" class="pt-10 border-t border-slate-100">
                  <div class="program-content" v-html="program?.content ? t(program.content) : ''"></div>
                </div>
              </div>
            </div>


            <!-- Speakers grid -->
            <div v-if="sectionId === 'speakers' && program?.speakers?.length" class="space-y-5">
              <div class="flex items-center gap-3">
                <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase">{{ t('Distinguished_Panel') }}</p>
                <div class="h-px flex-1 bg-slate-100"></div>
              </div>
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div
                  v-for="(speaker, idx) in program?.speakers"
                  :key="idx"
                  class="bg-white border border-slate-200 rounded-2xl p-7 text-center hover:border-green-200 hover:shadow-sm transition-all duration-300 group"
                >
                  <div class="w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-5 ring-4 ring-green-50 group-hover:ring-green-100 transition-all duration-300">
                    <img
                      v-if="speaker?.imageUrl"
                      :src="speaker?.imageUrl"
                      :alt="speaker?.name"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full bg-green-50 flex items-center justify-center text-[#2E7D32] text-2xl font-bold"
                    >
                      {{ speaker?.name?.[0] }}
                    </div>
                  </div>
                  <h4 class="text-[14px] font-bold text-slate-800 mb-1">{{ speaker?.name }}</h4>
                  <p class="text-[12px] font-semibold text-[#2E7D32] mb-3">{{ speaker?.role }}</p>
                  <p v-if="speaker?.bio" class="text-[12px] text-slate-400 leading-relaxed line-clamp-3">"{{ speaker?.bio }}"</p>
                </div>
              </div>
            </div>


            <!-- Video -->
            <div
              v-if="sectionId === 'video' && program?.uploadedVideoUrl && program.uploadedVideoUrl !== 'null'"
              class="bg-slate-900 rounded-2xl p-3"
            >
              <div class="aspect-video w-full rounded-xl overflow-hidden">
                <iframe
                  :src="getYouTubeEmbedUrl(program.uploadedVideoUrl)"
                  class="w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>


            <!-- Agenda -->
            <div
              v-if="sectionId === 'agenda' && program?.agenda?.length"
              class="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12"
            >
              <div class="flex items-center gap-3 mb-10">
                <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase">{{ t('Strategic_Schedule') }}</p>
                <div class="h-px flex-1 bg-slate-100"></div>
              </div>
              <div class="space-y-0">
                <div
                  v-for="(item, idx) in program?.agenda"
                  :key="idx"
                  class="flex items-start gap-8 group"
                >
                  <div class="flex flex-col items-center flex-shrink-0">
                    <div class="w-10 h-10 rounded-xl bg-green-50 text-[#2E7D32] flex items-center justify-center text-[13px] font-bold group-hover:bg-[#2E7D32] group-hover:text-white transition-all duration-300">
                      {{ Number(idx) + 1 }}
                    </div>
                    <div
                      v-if="Number(idx) < (program?.agenda?.length || 0) - 1"
                      class="w-px h-14 bg-slate-100 mt-1"
                    ></div>
                  </div>
                  <div class="pb-10">
                    <p class="text-[11px] font-bold text-[#2E7D32] mb-1.5 opacity-60 group-hover:opacity-100 transition-opacity">{{ item?.time || 'TBD' }}</p>
                    <h4 class="text-[15px] font-bold text-slate-800 mb-2">{{ item?.title }}</h4>
                    <p v-if="item?.description" class="text-[13px] text-slate-400 leading-relaxed max-w-lg">{{ item?.description }}</p>
                  </div>
                </div>
              </div>
            </div>


            <!-- Gallery -->
            <section v-if="sectionId === 'gallery' && program?.bannerImages?.length > 1">
              <div class="flex items-center gap-3 mb-6">
                <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase">{{ t('Programme_Atmosphere') }}</p>
                <div class="h-px flex-1 bg-slate-100"></div>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px] md:auto-rows-[220px]">
                <div
                  v-for="(img, idx) in program?.bannerImages"
                  :key="idx"
                  class="rounded-2xl overflow-hidden group cursor-pointer"
                  :class="[
                    idx % 7 === 0 ? 'col-span-2 row-span-2' : '',
                    idx % 7 === 2 ? 'col-span-1 row-span-2' : '',
                    idx % 7 === 4 ? 'col-span-2 row-span-1' : '',
                  ]"
                >
                  <img
                    :src="img"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </section>

          </template>


          <!-- Empty state -->
          <div
            v-if="!program?.content && !program?.description && !pdfDocuments.length"
            class="bg-white border border-slate-200 rounded-2xl py-20 text-center"
          >
            <div class="w-16 h-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-5 text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <p class="text-slate-400 text-[14px] font-medium">{{ t('Programme_Finalizing') }}</p>
          </div>

        </div>


        <!-- ── Right: Sidebar ── -->
        <aside class="w-full lg:w-[340px] space-y-5 flex-shrink-0">

          <!-- Registration card -->
          <div
            v-if="program?.registerLink && !isArchived"
            class="bg-[#2E7D32] rounded-2xl p-7 relative overflow-hidden sticky top-10"
          >
            <div class="absolute -right-4 -bottom-4 w-28 h-28 bg-white/5 rounded-full pointer-events-none"></div>
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p class="text-[11px] font-semibold text-green-300 tracking-widest uppercase mb-2">{{ t('Secure_Pass') }}</p>
            <h3 class="text-[18px] font-bold text-white mb-6 leading-snug">{{ t('Registration_Active') }}</h3>
            <a
              :href="program?.registerLink"
              target="_blank"
              class="flex items-center justify-between w-full p-4 bg-white rounded-xl group hover:bg-green-50 transition-colors"
            >
              <span class="text-[#2E7D32] text-[14px] font-bold">{{ t('Register_Entry') }}</span>
              <div class="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center text-white group-hover:translate-x-0.5 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </a>
          </div>


          <!-- Document repository -->
          <div
            v-if="program?.uploadedDocumentFiles?.length"
            class="bg-white border border-slate-200 rounded-2xl p-7 hover:border-green-200 hover:shadow-sm transition-all duration-300"
          >
            <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-5">{{ t('Resource_Archive') }}</p>
            <div class="space-y-3">
              <a
                v-for="(doc, idx) in (program.uploadedDocumentFiles as string[])"
                :key="idx"
                :href="doc"
                target="_blank"
                class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-green-50 border border-transparent hover:border-green-100 transition-all duration-300 group"
              >
                <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-green-200 transition-colors flex-shrink-0">
                  <svg v-if="getDocExt(doc) === 'PDF'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <svg v-else-if="['XLS', 'XLSX'].includes(getDocExt(doc))" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[13px] font-semibold text-slate-700 truncate capitalize group-hover:text-[#2E7D32] transition-colors">{{ getDocTitle(doc) }}</p>
                  <span class="text-[11px] font-bold text-[#2E7D32] bg-green-50 px-2 py-0.5 rounded-md">{{ getDocExt(doc) }}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-300 group-hover:text-[#2E7D32] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          </div>


          <!-- Share card -->
          <div class="bg-white border border-slate-200 rounded-2xl p-7 hover:border-green-200 hover:shadow-sm transition-all duration-300 flex items-center justify-between">
            <p class="text-[13px] font-semibold text-slate-400">{{ t('Share_Brief') }}</p>
            <button
              @click="handleShare"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 text-[#2E7D32] rounded-xl text-[13px] font-semibold hover:bg-[#2E7D32] hover:text-white transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {{ t('Share_Initiative') }}
            </button>
          </div>

        </aside>

      </div>
    </div>

    <!-- Share modal -->
    <ShareModal
      :show="showShareModal"
      :program="program"
      @close="showShareModal = false"
    />

  </div>
</template>


<style scoped>
.font-body {
  font-family: 'DM Sans', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}

/* Program rich content typography */
.program-content { color: #4b5563; font-size: 1rem; line-height: 1.9; font-weight: 400; }
.program-content h1 { font-size: 2rem; font-weight: 800; margin: 2.5rem 0 1rem; color: #111827; letter-spacing: -0.02em; }
.program-content h2 { font-size: 1.6rem; font-weight: 700; margin: 2rem 0 0.75rem; color: #111827; }
.program-content h3 { font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: #111827; }
.program-content p { margin: 1rem 0; }
.program-content ul { list-style-type: none; padding-left: 0; margin: 1.5rem 0; }
.program-content ul li { position: relative; padding-left: 1.5rem; margin-bottom: 0.65rem; }
.program-content ul li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 6px;
  height: 6px;
  background-color: #2E7D32;
  border-radius: 50%;
}
.program-content ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1.5rem 0; }
.program-content li { margin: 0.5rem 0; }
.program-content blockquote {
  border-left: 3px solid #2E7D32;
  padding: 1.25rem 1.75rem;
  margin: 2rem 0;
  background: #f9fafb;
  color: #1B5E20;
  border-radius: 0 1rem 1rem 0;
  font-style: italic;
  font-size: 1.05rem;
}
.program-content a { color: #2E7D32; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
.program-content strong { font-weight: 700; color: #111827; }
.program-content img { max-width: 100%; border-radius: 1rem; margin: 2rem 0; }
.program-content hr { border: none; border-top: 1px solid #f3f4f6; margin: 2.5rem 0; }

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in { animation: fade-in 0.9s ease-out forwards; }
.animate-fade-in-up { opacity: 0; animation: fade-in-up 0.7s ease-out forwards; }
</style>