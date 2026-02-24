<script setup lang="ts">
import { useFetchProgram } from '@/composables/modules/programs/useFetchProgram'

const route = useRoute()
const { program, loading, fetchProgram } = useFetchProgram()

onMounted(() => {
  if (route.params.id) {
    fetchProgram(route.params.id as string)
  }
})

useHead({
  title: computed(() => `${program.value?.title || 'Program'} | PANAFSTRAG`),
})
</script>

<template>
  <div class="min-h-screen px-6 lg:px-0 bg-[#FDFDFD]">
    <!-- Header -->
    <section class="relative bg-black text-white pt-32 pb-48 overflow-hidden group">
      <div class="absolute inset-0 z-0">
        <img v-if="program?.imageUrl" :src="program.imageUrl" class="w-full h-full object-cover opacity-30 grayscale group-hover:scale-110 transition-transform duration-[3s]" />
        <div class="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black"></div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <!-- Back Link -->
        <NuxtLink to="/programs" class="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-white transition-colors mb-16">
          ← Back to Intelligence Hub
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
          <div class="inline-block px-4 py-1.5 border border-white/20 bg-white/5 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.3em]">
            {{ program.type }} Module
          </div>

          <h1 class="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[1.1]">
            {{ program.title }}
          </h1>

          <div v-if="program.theme" class="text-xl lg:text-3xl font-bold italic text-gray-400 max-w-2xl leading-relaxed">
            "{{ program.theme }}"
          </div>

          <div class="flex flex-wrap items-center gap-8 pt-8 border-t border-white/10">
            <div class="flex flex-col gap-1">
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Timeline</span>
              <span class="text-sm font-black uppercase tracking-widest text-white/80">
                {{ program.startDate || new Date(program.date).toLocaleDateString('en-US', { dateStyle: 'long' }) }}
              </span>
            </div>
             <div v-if="program.location" class="flex flex-col gap-1">
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Strategic Hub</span>
              <span class="text-sm font-black uppercase tracking-widest text-white/80">{{ program.location }}</span>
            </div>
             <div v-if="program.status" class="flex flex-col gap-1">
              <span class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 italic">Operational Status</span>
              <span class="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest">{{ program.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="relative -mt-24 z-20 pb-40">
      <div class="container mx-auto px-6">
        <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">

          <!-- Content Left -->
          <div class="flex-1 bg-white p-12 md:p-20 shadow-2xl border border-black/5 animate-fade-in-up delay-100">
            <div v-if="loading" class="space-y-6">
               <div v-for="i in 10" :key="i" class="h-4 bg-gray-50 w-full"></div>
            </div>
            <div v-else-if="program" class="prose prose-xl max-w-none">
              <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-12 italic">Intel Summary & Objectives</h4>
              <p class="text-gray-600 font-medium leading-[1.8] text-lg whitespace-pre-wrap" v-html="program.description"></p>

              <!-- Video Content -->
              <div v-if="program.uploadedVideoUrl && program.uploadedVideoUrl !== 'null'" class="mt-20 pt-20 border-t border-gray-100">
                <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10 italic">Archived Visual Intelligence</h4>
                <div class="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group relative">
                   <iframe :src="program.uploadedVideoUrl" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="w-full lg:w-1/3 space-y-12 lg:pt-32 animate-fade-in-up delay-200">
            <!-- Registration / CTA -->
            <div v-if="program?.registerLink" class="bg-black text-white p-10 rounded-[2rem] shadow-2xl group transition-all duration-500 hover:bg-black/90">
               <h4 class="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8 italic">Deployment Phase</h4>
               <p class="text-lg font-bold mb-10 leading-relaxed italic">Join this strategic mission and contribute to African policy development.</p>
               <a :href="program.registerLink" target="_blank" class="block w-full text-center py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gray-200 transition-colors shadow-lg">REGISTER MISSION</a>
            </div>

            <!-- Download Resources -->
            <div v-if="program?.uploadedDocumentFiles?.length" class="p-10 border-2 border-dashed border-gray-200 rounded-[2rem]">
               <h4 class="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10 italic">Intelligence Assets</h4>
               <div class="space-y-4">
                  <a v-for="(doc, idx) in (program.uploadedDocumentFiles as string[])" :key="idx" :href="doc" target="_blank" class="flex items-center gap-4 group p-4 hover:bg-gray-50 rounded-xl transition-all">
                    <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-black group-hover:bg-black group-hover:text-white transition-all">{{ Number(idx) + 1 }}</div>
                    <div class="flex flex-col">
                       <span class="text-[10px] font-black uppercase tracking-widest text-black/60 group-hover:text-black transition-colors italic">ASSET FILE</span>
                       <span class="text-[8px] font-bold text-gray-300">Click to Synchronize</span>
                    </div>
                    <span class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">↓</span>
                  </a>
               </div>
            </div>

            <!-- Strategic Share -->
            <div class="p-10 bg-gray-50 rounded-[2rem]">
               <h4 class="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 italic">Disseminate Intel</h4>
               <div class="flex gap-6">
                  <button class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all text-xs">𝕏</button>
                  <button class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all text-xs">In</button>
                  <button class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all text-xs">🔗</button>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
</style>
