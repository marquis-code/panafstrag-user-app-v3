<script setup lang="ts">
import { useFetchPrograms } from '@/composables/modules/programs/useFetchPrograms'
import { useFetchObjectives } from '@/composables/modules/objective/useObjective'
import { useFetchResponsibilities } from '@/composables/modules/responsibility/useResponsibility'

const { programs: allPrograms, loading: pending } = useFetchPrograms()
const { objectives, fetchObjectives } = useFetchObjectives()
const { responsibilities, fetchResponsibilities } = useFetchResponsibilities()

onMounted(() => {
  fetchObjectives()
  fetchResponsibilities()
})

// Cast to any[] to avoid 'never' errors if the ref is not properly typed in the composable
const programs = computed(() => (allPrograms.value as any[])?.slice(0, 3) || [])

const features = [
  {
    title: 'Strategic Analysis',
    description: 'In-depth geopolitical and economic evaluations to guide policy-making at the highest levels.',
    iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
  },
  {
    title: 'Security Focus',
    description: 'Comprehensive research into regional stability, peace-building, and conflict resolution.',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.056c1.295-1.01 2.434-2.126 3.425-3.328a11.955 11.955 0 001.993-4.148c.156-.562.238-1.15.238-1.758 0-3.149-1.464-5.952-3.765-7.794'
  },
  {
    title: 'Collaborative Policy',
    description: 'Fostering partnerships between governments, private sectors, and civil societies.',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  }
]

useHead({
  title: 'PANAFSTRAG | Pan-African Strategic and Policy Research Group',
})
</script>

<template>
  <div class="space-y-32 px-6 lg:px-0 pb-32 bg-white">
    <HeroSection />

    <!-- Features Section -->
    <section class="container mx-auto px-6">
      <div class="grid md:grid-cols-3 gap-12">
        <div v-for="(feature, i) in features" :key="i"
          class="glass-card group animate-fade-in-up"
          :class="`delay-${(i + 1) * 100}`">
          <div class="w-14 h-14 bg-black rounded-lg mb-8 flex items-center justify-center text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="feature.iconPath" />
            </svg>
          </div>
          <h3 class="text-2xl font-black mb-6 tracking-tighter uppercase italic">{{ feature.title }}</h3>
          <p class="text-gray-500 leading-relaxed font-medium">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Objectives & Responsibilities -->
    <section class="container mx-auto px-6">
      <div class="grid lg:grid-cols-2 gap-24">
        <!-- Objectives -->
        <div class="space-y-12 animate-fade-in-up delay-400">
           <div class="border-b border-gray-100 pb-8">
             <h2 class="text-3xl font-black tracking-tighter uppercase italic">Institutional <span class="not-italic text-gray-400">Objectives.</span></h2>
           </div>
           <div class="space-y-6">
              <div v-for="(obj, i) in (objectives as any[])" :key="i" class="flex gap-6 group">
                <span class="text-gray-200 font-black text-4xl group-hover:text-black transition-colors duration-500">{{ (i+1).toString().padStart(2, '0') }}</span>
                <p class="text-gray-500 font-medium leading-relaxed pt-2">{{ obj.description }}</p>
              </div>
              <div v-if="!objectives?.length" class="py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                <p class="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Strategic objectives pending...</p>
              </div>
           </div>
        </div>

        <!-- Responsibilities -->
        <div class="space-y-12 animate-fade-in-up delay-500">
           <div class="border-b border-gray-100 pb-8">
             <h2 class="text-3xl font-black tracking-tighter uppercase italic">Core <span class="not-italic text-gray-400">Responsibilities.</span></h2>
           </div>
           <div class="grid sm:grid-cols-1 gap-6">
              <div v-for="(res, i) in (responsibilities as any[])" :key="i" class="p-8 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all duration-500 group">
                <p class="font-bold text-sm leading-relaxed">{{ res.description }}</p>
              </div>
              <div v-if="!responsibilities?.length" class="py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                <p class="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Commitments under review...</p>
              </div>
           </div>
        </div>
      </div>
    </section>

    <!-- Recent Programs Section -->
    <section class="container mx-auto px-6">
      <div class="flex items-center justify-between mb-16 border-b border-gray-100 pb-8">
        <div>
          <h2 class="text-4xl font-black tracking-tighter uppercase italic">Recent <span class="not-italic text-gray-400">Programs.</span></h2>
        </div>
        <NuxtLink to="/programs" class="text-[10px] font-black uppercase tracking-[0.3em] hover:text-gray-400 transition-colors">View All Programs —></NuxtLink>
      </div>

      <div v-if="pending" class="grid md:grid-cols-3 gap-12">
        <div v-for="i in 3" :key="i" class="h-[500px] bg-gray-50 rounded-2xl animate-pulse"></div>
      </div>

      <div v-else class="grid md:grid-cols-3 gap-12">
        <div v-for="(program, i) in (programs as any[])" :key="program._id"
          class="group relative animate-fade-in-up"
          :class="`delay-${(i + 1) * 100}`">
          <div class="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-8 shadow-sm">
            <img v-if="program.imageUrl" :src="program.imageUrl" alt="" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-200 font-black text-6xl italic">
              PAS
            </div>
          </div>
          <div class="space-y-4">
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{{ program.type }}</span>
            <h4 class="text-2xl font-black uppercase tracking-tighter group-hover:text-gray-500 transition-colors line-clamp-2 leading-tight">{{ program.title }}</h4>
            <div class="pt-4 flex items-center gap-4">
              <NuxtLink :to="`/programs`" class="text-[10px] font-black uppercase tracking-[0.1em] border-b-2 border-black pb-1 hover:border-gray-300 transition-all">Read Details</NuxtLink>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!programs?.length" class="col-span-full py-32 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
          <p class="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">No recent programs found.</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="container mx-auto px-6">
      <div class="bg-black rounded-[2rem] p-16 md:p-24 text-center text-white relative overflow-hidden group">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#333_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div class="relative z-10 max-w-3xl mx-auto">
          <h2 class="text-5xl md:text-7xl font-black mb-10 tracking-tighter uppercase italic">Participate in <br /> <span class="not-italic text-gray-400">the Future.</span></h2>
          <p class="text-gray-400 mb-16 text-xl leading-relaxed font-medium">
            Join a network of leading experts dedicated to solving the most pressing strategic challenges facing the African continent today.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button class="btn-secondary !bg-black !text-white !border-white hover:!bg-white hover:!text-black w-full sm:w-auto">
              GET INVOLVED
            </button>
            <NuxtLink to="/contact" class="text-[10px] font-black uppercase tracking-[0.3em] hover:text-gray-400 transition-colors">
              CONTACT OUR GROUP —>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
</style>
