<script setup lang="ts">
import { useFetchBoardMember } from '@/composables/modules/board/useFetchBoardMember'

const route = useRoute()
const { boardMember, loading, fetchBoardMember } = useFetchBoardMember()

onMounted(() => {
  if (route.params.id) {
    fetchBoardMember(route.params.id as string)
  }
})

useHead({
  title: computed(() => `${boardMember.value?.name || 'Board Member'} | PANAFSTRAG`),
})
</script>

<template>
  <div class="min-h-screen px-6 lg:px-0 bg-white">
    <!-- Back Button -->
    <div class="container mx-auto px-6 pt-12">
      <NuxtLink to="/board" class="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors group">
        <span class="transition-transform group-hover:-translate-x-2">←</span> Back to Board
      </NuxtLink>
    </div>

    <div v-if="loading" class="container mx-auto px-6 py-32">
       <div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-20 animate-pulse">
         <div class="w-full md:w-1/3 aspect-[3/4] bg-gray-50 rounded-2xl"></div>
         <div class="flex-1 space-y-8">
           <div class="h-16 bg-gray-50 w-3/4"></div>
           <div class="h-4 bg-gray-50 w-1/4"></div>
           <div class="space-y-4 pt-12">
             <div v-for="i in 6" :key="i" class="h-4 bg-gray-50 w-full"></div>
           </div>
         </div>
       </div>
    </div>

    <div v-else-if="boardMember" class="container mx-auto px-6 py-24">
      <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
        <!-- Profile Image -->
        <div class="w-full lg:w-1/3 animate-fade-in-up">
          <div class="aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-50 border border-black/5 shadow-2xl relative">
            <img v-if="boardMember.avatar" :src="boardMember.avatar" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
            <div v-else class="w-full h-full flex items-center justify-center text-8xl font-black text-gray-200 italic">
              {{ boardMember.name.charAt(0) }}
            </div>

            <!-- Floating accent -->
            <div class="absolute bottom-10 -right-10 w-32 h-32 bg-black rounded-full mix-blend-difference hidden lg:block"></div>
          </div>
        </div>

        <!-- Details -->
        <div class="flex-1 space-y-12 animate-fade-in-up delay-200">
          <div>
            <span class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 block">Board of Trustees</span>
            <h1 class="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none mb-6">
              {{ boardMember.name }}
            </h1>
            <div class="flex flex-wrap items-center gap-6">
              <span class="px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest">{{ boardMember.position }}</span>
              <span v-if="boardMember.university" class="text-[10px] font-black uppercase tracking-widest text-gray-400 italic underline decoration-gray-200 underline-offset-8">{{ boardMember.university }}</span>
            </div>
          </div>

          <!-- Contact Row -->
          <div v-if="boardMember.email?.length" class="flex flex-col gap-2 pt-8 border-t border-black/5">
            <span class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">Direct Intelligence</span>
            <div class="flex flex-wrap gap-8">
              <a v-for="email in boardMember.email" :key="email" :href="`mailto:${email}`" class="text-sm font-black hover:text-gray-400 transition-colors uppercase tracking-widest">{{ email }}</a>
            </div>
          </div>

          <!-- Bio -->
          <div class="prose prose-xl max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest">
            <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 italic">Curriculum Vitae / Biography</h4>
            <p class="text-gray-600 font-medium leading-[1.8] text-lg whitespace-pre-wrap">
              {{ boardMember.bio }}
            </p>
          </div>

          <!-- Duties -->
          <div v-if="boardMember.duties?.length" class="pt-12 border-t border-black/5">
            <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10 italic">Core Responsibilities</h4>
            <div class="grid sm:grid-cols-2 gap-4">
              <div v-for="duty in boardMember.duties" :key="duty" class="p-6 bg-gray-50 rounded-2xl flex items-center gap-4 group hover:bg-black hover:text-white transition-all duration-500">
                <span class="w-1.5 h-1.5 rounded-full bg-black group-hover:bg-white"></span>
                <span class="text-[10px] font-black uppercase tracking-widest">{{ duty }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="container mx-auto px-6 py-32 text-center">
       <h2 class="text-4xl font-black text-gray-200 uppercase tracking-widest">Intelligence Link Severed</h2>
       <p class="text-gray-400 mt-4 uppercase text-[10px] tracking-[0.4em]">The requested file does not exist in our secure archives.</p>
       <NuxtLink to="/board" class="inline-block mt-12 px-10 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">Return to Site</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
</style>
