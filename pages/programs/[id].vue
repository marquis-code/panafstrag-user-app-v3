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
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  return url
}

const formatDate = (date: string) => {
  try { return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }
  catch { return date }
}

useHead({
  title: computed(() => `${program.value?.title || 'Programme'} | PANAFSTRAG`),
})
</script>

<template>
  <div class="min-h-screen bg-[#F9FBFA]">
    <!-- Hero Area -->
    <section class="relative bg-[#1A3A1C] pt-32 pb-60 overflow-hidden">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <img v-if="heroImage" :src="heroImage" class="w-full h-full object-cover opacity-15 grayscale mix-blend-luminosity" />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A3A1C]/80 to-[#1A3A1C]"></div>
      </div>

      <!-- Subtle Decorative Elements -->
      <div class="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-[#2E7D32]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#2E7D32]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="container mx-auto px-6 relative z-10 max-w-6xl">
        <NuxtLink to="/programs" class="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-12 group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Programmes
        </NuxtLink>

        <!-- Loading State -->
        <div v-if="loading" class="space-y-6 animate-pulse">
          <div class="h-14 bg-white/5 w-3/4 rounded-2xl"></div>
          <div class="h-6 bg-white/5 w-1/2 rounded-lg"></div>
        </div>

        <!-- Programme Hero Info -->
        <div v-else-if="program" class="space-y-8 animate-fade-in">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-bold tracking-[0.1em] uppercase text-white/80 border border-white/10">
              {{ program.type }}
            </span>
            <span v-if="program.status" class="px-4 py-1 bg-[#2E7D32]/80 backdrop-blur-md rounded-full text-[11px] font-bold tracking-[0.1em] uppercase text-white border border-white/5 shadow-lg">
              {{ program.status }}
            </span>
          </div>

          <h1 class="text-3xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight max-w-5xl text-white">
            {{ program.title }}
          </h1>

          <p v-if="program.theme" class="text-xl md:text-2xl text-white/60 font-medium max-w-3xl leading-relaxed italic">
            "{{ program.theme }}"
          </p>
        </div>
      </div>
    </section>

    <!-- Integrated Content Area -->
    <div class="container mx-auto px-6 max-w-6xl relative z-20 -mt-40">
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Main Content (Cards) -->
        <div class="flex-1 space-y-8">
          
          <!-- Quick Statistics/Info Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-[100ms]">
            <div class="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-xl shadow-black/[0.03] flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Schedule</p>
                <p class="text-sm font-bold text-gray-900">{{ program?.startDate || formatDate(program?.date) }}</p>
              </div>
            </div>
            
            <div class="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-xl shadow-black/[0.03] flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Location</p>
                <p class="text-sm font-bold text-gray-900 truncate max-w-[150px]">{{ program?.location || 'Virtual' }}</p>
              </div>
            </div>

            <div class="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-xl shadow-black/[0.03] flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Participation</p>
                <p class="text-sm font-bold text-gray-900">{{ program?.speakers?.length || 0 }} Speakers</p>
              </div>
            </div>
          </div>

          <!-- Virtual Join Bar (Now Integrated better) -->
          <div v-if="program && hasVirtualLinks" class="bg-[#2E7D32] rounded-[2rem] p-4 flex flex-wrap items-center justify-between gap-4 px-8 shadow-xl shadow-[#2E7D32]/10 animate-fade-in-up delay-[150ms]">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <span class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </div>
              <span class="text-white text-[11px] font-bold tracking-[0.2em] uppercase">The session is live</span>
            </div>
            
            <div class="flex flex-wrap items-center gap-3">
              <a v-if="program.zoomMeetingUrl" :href="program.zoomMeetingUrl" target="_blank" class="px-6 py-2.5 bg-white text-[#2E7D32] rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-gray-100 transition-all flex items-center gap-2">
                Join via Zoom
              </a>
              <a v-if="program.googleMeetUrl" :href="program.googleMeetUrl" target="_blank" class="px-6 py-2.5 bg-white/15 text-white border border-white/20 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-white/25 transition-all flex items-center gap-2">
                Join via Meet
              </a>
            </div>
          </div>

          <!-- Main Narrative Content -->
          <div class="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-black/[0.02] border border-gray-100 animate-fade-in-up delay-[200ms]">
            <div v-if="loading" class="space-y-6">
              <div class="h-4 bg-gray-50 w-full rounded-full"></div>
              <div class="h-4 bg-gray-50 w-full rounded-full"></div>
              <div class="h-4 bg-gray-50 w-3/4 rounded-full"></div>
            </div>
            <div v-else-if="program" class="space-y-12">
              <div v-if="program.description">
                <h3 class="text-[11px] font-bold text-[#2E7D32] tracking-[0.3em] uppercase mb-8 opacity-60">Mission Overview</h3>
                <div class="text-gray-600 leading-[2] text-[16px] font-medium whitespace-pre-wrap lg:pr-10" v-html="program.description"></div>
              </div>

              <div v-if="program.content" class="pt-12 border-t border-gray-50">
                <h3 class="text-[11px] font-bold text-[#2E7D32] tracking-[0.3em] uppercase mb-10 opacity-60">Systemic Framework</h3>
                <div class="program-content" v-html="program.content"></div>
              </div>

              <div v-if="!program.content && !program.description" class="py-20 text-center">
                <div class="w-20 h-20 mx-auto rounded-3xl bg-gray-50 flex items-center justify-center mb-6 text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </div>
                <p class="text-gray-400 font-medium italic">Programme information is currently being finalized.</p>
              </div>
            </div>
          </div>

          <!-- Speakers Grid -->
          <div v-if="program?.speakers?.length" class="space-y-8 animate-fade-in-up delay-[250ms]">
            <div class="flex items-center gap-4">
              <h3 class="text-[11px] font-bold text-[#2E7D32] tracking-[0.3em] uppercase opacity-60">Distinguished Panel</h3>
              <div class="h-px flex-1 bg-gray-100"></div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="(speaker, idx) in program.speakers" :key="idx" class="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm group hover:shadow-xl hover:shadow-[#2E7D32]/5 hover:-translate-y-1 transition-all duration-500">
                <div class="w-24 h-24 mx-auto rounded-[2rem] overflow-hidden mb-6 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-lg">
                  <img v-if="speaker.imageUrl" :src="speaker.imageUrl" :alt="speaker.name" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  <div v-else class="w-full h-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] text-3xl font-bold">
                    {{ speaker.name?.[0] }}
                  </div>
                </div>
                <div class="text-center">
                  <h4 class="text-sm font-bold text-gray-900 mb-1">{{ speaker.name }}</h4>
                  <p class="text-[10px] font-bold text-[#2E7D32] tracking-widest uppercase mb-4">{{ speaker.role }}</p>
                  <p v-if="speaker.bio" class="text-xs text-gray-400 leading-relaxed line-clamp-3 italic">"{{ speaker.bio }}"</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Video Showcase -->
          <div v-if="program?.uploadedVideoUrl && program.uploadedVideoUrl !== 'null'" class="bg-[#111111] rounded-[3rem] p-4 animate-fade-in-up delay-[300ms]">
            <div class="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <iframe :src="getYouTubeEmbedUrl(program.uploadedVideoUrl)" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>

          <!-- Timeline Agenda -->
          <div v-if="program?.agenda?.length" class="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-lg shadow-black/[0.01] border border-gray-50 animate-fade-in-up delay-[350ms]">
            <h3 class="text-[11px] font-bold text-[#2E7D32] tracking-[0.3em] uppercase mb-16 opacity-60">Strategic Schedule</h3>
            
            <div class="space-y-0">
              <div v-for="(item, idx) in program.agenda" :key="idx" class="flex items-start gap-10 group">
                <div class="flex flex-col items-center">
                  <div class="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-xs font-black flex-shrink-0 group-hover:bg-[#2E7D32] group-hover:text-white transition-all duration-500">
                    {{ idx + 1 }}
                  </div>
                  <div v-if="idx < program.agenda.length - 1" class="w-0.5 h-16 bg-gray-50 group-hover:bg-[#2E7D32]/10 transition-colors"></div>
                </div>
                <div class="pb-12">
                  <span class="text-[10px] font-black text-[#2E7D32] tracking-[0.2em] uppercase mb-2 block opacity-40 group-hover:opacity-100 transition-opacity">{{ item.time || 'TBD' }}</span>
                  <p class="text-lg font-bold text-gray-900 mb-3">{{ item.title }}</p>
                  <p v-if="item.description" class="text-sm text-gray-400 leading-relaxed max-w-xl">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar (Floating Info Content) -->
        <aside class="w-full lg:w-[350px] space-y-6">
          
          <!-- Registration Card -->
          <div v-if="program?.registerLink" class="bg-[#2E7D32] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-[#2E7D32]/20 sticky top-10">
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl group-hover:w-40 transition-all duration-700"></div>
            
            <h4 class="text-[10px] font-bold tracking-[0.4em] uppercase text-white/50 mb-6 italic">Secure Pass</h4>
            <p class="text-lg font-bold mb-10 leading-snug">Registration portal is currently active for this initiative.</p>
            
            <a :href="program.registerLink" target="_blank" class="flex items-center justify-between w-full p-4 bg-white rounded-2xl group/btn hover:bg-gray-50 transition-colors">
              <span class="text-[#2E7D32] text-xs font-bold tracking-widest uppercase ml-2">Register Entry</span>
              <div class="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white group-hover/btn:translate-x-1 transition-transform">
                →
              </div>
            </a>
          </div>

          <!-- Document Repository -->
          <div v-if="program?.uploadedDocumentFiles?.length" class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-black/[0.02]">
            <h4 class="text-[10px] font-bold tracking-[0.4em] uppercase text-[#2E7D32] mb-8 italic opacity-40">Documentation</h4>
            <div class="space-y-3">
              <a v-for="(doc, idx) in (program.uploadedDocumentFiles as string[])" :key="idx" :href="doc" target="_blank" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#E8F5E9]/50 transition-all group">
                <div class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#2E7D32] transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[11px] font-bold text-gray-700 truncate capitalize">{{ doc?.split('/').pop()?.split('-').pop() || 'Module Documentation' }}</p>
                  <p class="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">Download Resources</p>
                </div>
              </a>
            </div>
          </div>

          <!-- Share / Connect -->
          <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex items-center justify-between">
            <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-300">Share Brief</span>
            <div class="flex gap-2">
              <button class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-[#2E7D32] hover:text-white transition-all text-xs font-black text-gray-400">𝕏</button>
              <button class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-[#2E7D32] hover:text-white transition-all text-xs font-black text-gray-400">IN</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
    
    <!-- Gallery Divider (if more than 1 image) -->
    <section v-if="program?.bannerImages?.length > 1" class="py-24 animate-fade-in-up">
      <div class="container mx-auto px-6 max-w-6xl">
        <h3 class="text-[11px] font-bold text-[#2E7D32] tracking-[0.3em] uppercase mb-12 opacity-60 text-center">Programme Atmosphere</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="(img, idx) in program.bannerImages" :key="idx" class="aspect-square rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg">
            <img :src="img" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Space -->
    <div class="h-40"></div>
  </div>
</template>

<style>
/* Refined Narrative Typography */
.program-content { color: #555c68; font-size: 1rem; line-height: 2; font-weight: 400; }
.program-content h1 { font-size: 2.5rem; font-weight: 800; margin: 3rem 0 1rem; color: #111827; letter-spacing: -0.02em; }
.program-content h2 { font-size: 2rem; font-weight: 700; margin: 2.5rem 0 0.75rem; color: #111827; }
.program-content h3 { font-size: 1.5rem; font-weight: 600; margin: 2rem 0 0.5rem; color: #111827; }
.program-content p { margin: 1rem 0; }
.program-content ul { list-style-type: none; padding-left: 0; margin: 1.5rem 0; }
.program-content ul li { position: relative; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.program-content ul li::before { 
  content: ''; 
  position: absolute; 
  left: 0; 
  top: 0.7em; 
  width: 6px; 
  height: 6px; 
  background-color: #2E7D32; 
  border-radius: 50%;
}
.program-content ol { list-style-type: decimal; padding-left: 1.5rem; margin: 1.5rem 0; }
.program-content li { margin: 0.5rem 0; }
.program-content blockquote {
  border-left: 4px solid #2E7D32;
  padding: 1.5rem 2rem;
  margin: 2.5rem 0;
  background: #fdfdfd;
  color: #1B5E20;
  border-radius: 0 1.5rem 1.5rem 0;
  font-style: italic;
  font-size: 1.1rem;
  box-shadow: inset 10px 0 20px -10px rgba(0,0,0,0.05);
}
.program-content a { color: #2E7D32; font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
.program-content strong { font-weight: 700; color: #111827; }
.program-content img { max-width: 100%; border-radius: 2rem; margin: 2.5rem 0; box-shadow: 0 30px 60px -20px rgba(0,0,0,0.1); }
.program-content hr { border: none; border-top: 1px solid #F3F4F6; margin: 3rem 0; }

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
.delay-\[100ms\] { animation-delay: 100ms; }
.delay-\[150ms\] { animation-delay: 150ms; }
.delay-\[200ms\] { animation-delay: 200ms; }
.delay-\[250ms\] { animation-delay: 250ms; }
.delay-\[300ms\] { animation-delay: 300ms; }
.delay-\[350ms\] { animation-delay: 350ms; }
</style>
