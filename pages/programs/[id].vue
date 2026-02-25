<script setup lang="ts">
import { useFetchProgram } from '@/composables/modules/programs/useFetchProgram'

const route = useRoute()
const { program, loading, fetchProgram } = useFetchProgram()

onMounted(() => {
  if (route.params.id) {
    fetchProgram(route.params.id as string)
  }
})

const heroImage = computed(() => {
  if (program.value?.bannerImages?.length) return program.value.bannerImages[0]
  if (program.value?.imageUrl) return program.value.imageUrl
  return null
})

const hasVirtualLinks = computed(() => {
  return program.value?.zoomMeetingUrl || program.value?.googleMeetUrl || program.value?.uploadedVideoUrl
})

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return ''
  // Handle various YouTube URL formats
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  return url
}

useHead({
  title: computed(() => `${program.value?.title || 'Program'} | PANAFSTRAG`),
})
</script>

<template>
  <div class="min-h-screen bg-[#FDFDFD]">
    <!-- Hero -->
    <section class="relative bg-black text-white pt-32 pb-52 overflow-hidden group">
      <div class="absolute inset-0 z-0">
        <img v-if="heroImage" :src="heroImage" class="w-full h-full object-cover opacity-30 grayscale group-hover:scale-110 transition-transform duration-[3s]" />
        <div v-else class="w-full h-full bg-gradient-to-br from-gray-900 via-[#2E7D32]/10 to-black"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <NuxtLink to="/programs" class="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-white transition-colors mb-16">
          ← Back to Programs
        </NuxtLink>

        <div v-if="loading" class="max-w-4xl space-y-10 animate-pulse">
          <div class="h-4 bg-white/10 w-32"></div>
          <div class="h-24 bg-white/10 w-full"></div>
          <div class="flex gap-4">
            <div class="h-10 bg-white/10 w-40"></div>
            <div class="h-10 bg-white/10 w-40"></div>
          </div>
        </div>

        <div v-else-if="program" class="max-w-4xl space-y-12 animate-fade-in-up">
          <div class="flex flex-wrap items-center gap-3">
            <span class="px-4 py-1.5 border border-white/20 bg-white/5 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.3em]">{{ program.type }} Module</span>
            <span v-if="program.status" class="px-4 py-1.5 bg-white text-black text-[9px] font-black uppercase tracking-[0.3em]">{{ program.status }}</span>
            <span v-if="program.location" class="px-4 py-1.5 border border-white/20 bg-white/5 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.3em]">📍 {{ program.location }}</span>
          </div>

          <h1 class="text-4xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[1.05]">
            {{ program.title }}
          </h1>

          <div v-if="program.theme" class="text-xl lg:text-3xl font-bold italic text-gray-400 max-w-2xl leading-relaxed">
            "{{ program.theme }}"
          </div>

          <div class="flex flex-wrap items-center gap-8 pt-8 border-t border-white/10">
            <div v-if="program.startDate" class="flex flex-col gap-1">
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Start</span>
              <span class="text-sm font-black uppercase tracking-widest text-white/80">{{ program.startDate }}</span>
            </div>
            <div v-if="program.endDate" class="flex flex-col gap-1">
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 italic">End</span>
              <span class="text-sm font-black uppercase tracking-widest text-white/80">{{ program.endDate }}</span>
            </div>
            <div v-if="!program.startDate && program.date" class="flex flex-col gap-1">
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Date</span>
              <span class="text-sm font-black uppercase tracking-widest text-white/80">{{ new Date(program.date).toLocaleDateString('en-US', { dateStyle: 'long' }) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Virtual Event Bar -->
    <div v-if="program && hasVirtualLinks" class="bg-[#2E7D32] text-white">
      <div class="container mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-4 md:gap-6">
        <span class="text-[9px] font-black uppercase tracking-[0.3em]">JOIN VIRTUALLY:</span>
        <a v-if="program.zoomMeetingUrl" :href="program.zoomMeetingUrl" target="_blank" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          ZOOM MEETING
        </a>
        <a v-if="program.googleMeetUrl" :href="program.googleMeetUrl" target="_blank" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          GOOGLE MEET
        </a>
        <a v-if="program.uploadedVideoUrl" :href="program.uploadedVideoUrl" target="_blank" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          WATCH VIDEO
        </a>
      </div>
    </div>

    <!-- Main Content -->
    <section class="relative -mt-24 z-20 pb-40">
      <div class="container mx-auto px-6">
        <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-20">

          <!-- Content Left -->
          <div class="flex-1 space-y-0">
            <!-- Description & Rich Content Card -->
            <div class="bg-white p-8 md:p-16 shadow-2xl border border-black/5 animate-fade-in-up delay-100">
              <div v-if="loading" class="space-y-6">
                <div v-for="i in 10" :key="i" class="h-4 bg-gray-50 w-full"></div>
              </div>
              <div v-else-if="program">
                <!-- Brief Description -->
                <div v-if="program.description">
                  <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 italic">Summary</h4>
                  <p class="text-gray-600 font-medium leading-[1.8] text-lg whitespace-pre-wrap mb-12" v-html="program.description"></p>
                </div>

                <!-- Rich Content -->
                <div v-if="program.content">
                  <h4 v-if="program.description" class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 italic pt-8 border-t border-gray-100">Program Details</h4>
                  <div class="program-content" v-html="program.content"></div>
                </div>

                <!-- Fallback if no content or description -->
                <div v-if="!program.content && !program.description" class="py-12 text-center">
                  <p class="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Program details coming soon...</p>
                </div>
              </div>
            </div>

            <!-- Video Embed -->
            <div v-if="program?.uploadedVideoUrl && program.uploadedVideoUrl !== 'null'" class="bg-white p-8 md:p-16 shadow-2xl border border-black/5 border-t-0 animate-fade-in-up delay-200">
              <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 italic">Program Video</h4>
              <div class="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                <iframe :src="getYouTubeEmbedUrl(program.uploadedVideoUrl)" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>

            <!-- Agenda -->
            <div v-if="program?.agenda?.length" class="bg-white p-8 md:p-16 shadow-2xl border border-black/5 border-t-0 animate-fade-in-up delay-300">
              <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10 italic">Program Agenda</h4>
              <div class="space-y-0">
                <div v-for="(item, idx) in program.agenda" :key="idx" class="flex items-start gap-6 group">
                  <!-- Timeline Dot -->
                  <div class="flex flex-col items-center">
                    <div class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 group-hover:bg-[#2E7D32] transition-colors">
                      {{ idx + 1 }}
                    </div>
                    <div v-if="idx < program.agenda.length - 1" class="w-0.5 h-full min-h-[3rem] bg-gray-200"></div>
                  </div>
                  <div class="pb-8 flex-1">
                    <p class="text-[10px] font-black text-[#2E7D32] uppercase tracking-widest mb-1">{{ item.time }}</p>
                    <p class="text-lg font-black uppercase tracking-tight leading-tight">{{ item.title }}</p>
                    <p v-if="item.description" class="text-gray-500 text-sm mt-2 leading-relaxed">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Speakers -->
            <div v-if="program?.speakers?.length" class="bg-white p-8 md:p-16 shadow-2xl border border-black/5 border-t-0 animate-fade-in-up delay-400">
              <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10 italic">Speakers & Panelists</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div v-for="(speaker, idx) in program.speakers" :key="idx" class="group text-center space-y-4">
                  <div class="w-28 h-28 mx-auto rounded-full bg-gray-100 overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow border-4 border-white">
                    <img v-if="speaker.imageUrl" :src="speaker.imageUrl" :alt="speaker.name" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 text-3xl font-black">
                      {{ speaker.name?.[0]?.toUpperCase() || '?' }}
                    </div>
                  </div>
                  <div>
                    <p class="font-black text-sm uppercase tracking-tight leading-tight">{{ speaker.name }}</p>
                    <p class="text-[9px] font-black text-[#2E7D32] uppercase tracking-widest mt-1">{{ speaker.role }}</p>
                    <p v-if="speaker.bio" class="text-gray-500 text-xs mt-3 leading-relaxed line-clamp-4">{{ speaker.bio }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Banner Images Gallery -->
            <div v-if="program?.bannerImages?.length > 1" class="bg-white p-8 md:p-16 shadow-2xl border border-black/5 border-t-0 animate-fade-in-up">
              <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 italic">Program Gallery</h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="(img, idx) in program.bannerImages" :key="idx" class="aspect-video rounded-xl overflow-hidden bg-gray-100 group">
                  <img :src="img" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="w-full lg:w-1/3 space-y-8 lg:pt-32 animate-fade-in-up delay-200">
            <!-- Registration CTA -->
            <div v-if="program?.registerLink" class="bg-black text-white p-8 md:p-10 rounded-[2rem] shadow-2xl group transition-all duration-500 hover:bg-black/90">
              <h4 class="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mb-6 italic">Registration</h4>
              <p class="text-base font-bold mb-8 leading-relaxed italic">Join this strategic mission and contribute to African policy development.</p>
              <a :href="program.registerLink" target="_blank" class="block w-full text-center py-4 bg-[#2E7D32] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#1B5E20] transition-colors rounded-xl shadow-lg">
                REGISTER NOW
              </a>
            </div>

            <!-- Quick Info -->
            <div v-if="program" class="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm space-y-6">
              <h4 class="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 italic">Quick Info</h4>
              <div v-if="program.type" class="flex justify-between items-center py-3 border-b border-gray-50">
                <span class="text-[9px] font-black uppercase tracking-widest text-gray-400">Type</span>
                <span class="text-[10px] font-black uppercase tracking-widest">{{ program.type }}</span>
              </div>
              <div v-if="program.status" class="flex justify-between items-center py-3 border-b border-gray-50">
                <span class="text-[9px] font-black uppercase tracking-widest text-gray-400">Status</span>
                <span class="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest">{{ program.status }}</span>
              </div>
              <div v-if="program.location" class="flex justify-between items-center py-3 border-b border-gray-50">
                <span class="text-[9px] font-black uppercase tracking-widest text-gray-400">Location</span>
                <span class="text-[10px] font-black uppercase tracking-widest">{{ program.location }}</span>
              </div>
              <div v-if="program.speakers?.length" class="flex justify-between items-center py-3 border-b border-gray-50">
                <span class="text-[9px] font-black uppercase tracking-widest text-gray-400">Speakers</span>
                <span class="text-[10px] font-black uppercase tracking-widest">{{ program.speakers.length }}</span>
              </div>
              <div v-if="program.agenda?.length" class="flex justify-between items-center py-3">
                <span class="text-[9px] font-black uppercase tracking-widest text-gray-400">Agenda Items</span>
                <span class="text-[10px] font-black uppercase tracking-widest">{{ program.agenda.length }}</span>
              </div>
            </div>

            <!-- Download Resources -->
            <div v-if="program?.uploadedDocumentFiles?.length" class="p-8 border-2 border-dashed border-gray-200 rounded-[2rem]">
              <h4 class="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 italic">Documents</h4>
              <div class="space-y-3">
                <a v-for="(doc, idx) in (program.uploadedDocumentFiles as string[])" :key="idx" :href="doc" target="_blank" class="flex items-center gap-4 group p-3 hover:bg-gray-50 rounded-xl transition-all">
                  <div class="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center font-black text-xs group-hover:bg-black group-hover:text-white transition-all">{{ Number(idx) + 1 }}</div>
                  <div class="flex flex-col flex-1 min-w-0">
                    <span class="text-[10px] font-black uppercase tracking-widest text-black/60 group-hover:text-black transition-colors truncate">{{ doc?.split('/').pop()?.toUpperCase() || 'DOCUMENT' }}</span>
                    <span class="text-[8px] font-bold text-gray-300">Click to download</span>
                  </div>
                  <span class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-sm">↓</span>
                </a>
              </div>
            </div>

            <!-- Social Share -->
            <div class="p-8 bg-gray-50 rounded-[2rem]">
              <h4 class="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6 italic">Share</h4>
              <div class="flex gap-4">
                <button class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all text-xs font-black">𝕏</button>
                <button class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all text-xs font-black">In</button>
                <button class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all text-xs">🔗</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
/* Rich content typography */
.program-content h1 { font-size: 2rem; font-weight: 900; margin: 1.5rem 0 0.75rem; letter-spacing: -0.025em; color: #1a1a1a; }
.program-content h2 { font-size: 1.5rem; font-weight: 800; margin: 1.25rem 0 0.5rem; letter-spacing: -0.015em; color: #1a1a1a; }
.program-content h3 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #1a1a1a; }
.program-content p { margin: 0.5rem 0; line-height: 1.8; color: #4b5563; font-size: 1rem; }
.program-content ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
.program-content ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
.program-content li { margin: 0.25rem 0; line-height: 1.7; color: #4b5563; }
.program-content blockquote {
  border-left: 4px solid #2E7D32;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background: #f9fafb;
  font-style: italic;
  color: #6b7280;
  border-radius: 0 0.5rem 0.5rem 0;
}
.program-content a { color: #2E7D32; text-decoration: underline; }
.program-content a:hover { color: #1B5E20; }
.program-content strong { font-weight: 800; color: #1a1a1a; }
.program-content em { font-style: italic; }
.program-content img { max-width: 100%; border-radius: 0.75rem; margin: 1.5rem 0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
.program-content hr { border: none; border-top: 2px solid #e5e7eb; margin: 2rem 0; }
.program-content code { background: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.875em; }
.program-content pre { background: #1f2937; color: #e5e7eb; padding: 1.5rem; border-radius: 0.75rem; overflow-x: auto; margin: 1.5rem 0; }
.program-content pre code { background: none; padding: 0; color: inherit; }
</style>
