<script setup lang="ts">
import { useFetchPrograms } from '@/composables/modules/programs/useFetchPrograms'
import { useFetchObjectives } from '@/composables/modules/objective/useObjective'
import { useFetchResponsibilities } from '@/composables/modules/responsibility/useResponsibility'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
import { useActiveBanner } from '@/composables/modules/active-banner/useActiveBanner'

const { programs: allPrograms, loading: pending } = useFetchPrograms()
const { objectives, fetchObjectives } = useFetchObjectives()
const { responsibilities, fetchResponsibilities } = useFetchResponsibilities()
const { homeContent } = useHomeContent()
const { activeBanner } = useActiveBanner()

const bannerProgram = computed(() => activeBanner.value?.programId || null)

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
  title: 'PANAFSTRAG | Panafricana Stratetegic & Policy Research Group',
})
</script>

<template>
  <div class="space-y-16 md:space-y-32 pb-32 bg-white">
    <HeroSection 
      :establishedText="homeContent?.heroEstablishedText"
      :carousels="homeContent?.carousels || [
        {
          title: 'Strategic Research.',
          description: 'Providing deep strategic insights and policy recommendations to foster sustainable development and security across the African continent.',
          imgUrl: ''
        }
      ]" 
    />

    <!-- Active Programme Spotlight -->
    <section v-if="bannerProgram" class="container mx-auto px-6 animate-fade-in-up">
      <div class="relative overflow-hidden rounded-[1.5rem] bg-[#0A0A0A] border border-white/5 shadow-2xl group">
        <!-- Background Glow -->
        <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2E7D32]/10 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none"></div>
        
        <div class="grid lg:grid-cols-2 items-center">
          <!-- Visual Context (Left) -->
          <div class="relative aspect-video lg:aspect-auto lg:h-[450px] overflow-hidden order-2 lg:order-1">
            <img 
              v-if="bannerProgram.bannerImages?.length" 
              :src="bannerProgram.bannerImages[0]" 
              class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            />
            <img 
              v-else-if="bannerProgram.imageUrl" 
              :src="bannerProgram.imageUrl" 
              class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-gray-900 via-[#2E7D32]/20 to-black"></div>
            
            <!-- Gradient Overlays -->
            <div class="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent hidden lg:block"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent lg:hidden"></div>
          </div>

          <!-- Information (Right) -->
          <div class="p-6 md:p-10 lg:p-12 flex flex-col justify-center order-1 lg:order-2 space-y-6 md:space-y-8 relative z-10">
            <div>
              <div class="flex flex-wrap items-center gap-3 mb-6">
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-[#2E7D32] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-[#2E7D32]/20">
                  <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  Active Selection
                </div>
                <span v-if="bannerProgram.type" class="px-3 py-1 border border-white/10 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                  {{ bannerProgram.type }}
                </span>
              </div>

              <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter italic leading-[1.1] mb-6 group-hover:text-[#2E7D32] transition-colors duration-500">
                {{ bannerProgram.title }}
              </h2>

              <p v-if="bannerProgram.theme" class="text-gray-400 text-base md:text-lg font-medium leading-relaxed max-w-xl">
                {{ bannerProgram.theme }}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-6 py-6 border-y border-white/5">
              <div v-if="bannerProgram.date" class="space-y-1">
                <span class="text-[8px] font-black text-[#2E7D32] uppercase tracking-[0.3em]">Event Date</span>
                <p class="text-white text-sm font-bold">{{ new Date(bannerProgram.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
              </div>
              <div v-if="bannerProgram.location" class="space-y-1">
                <span class="text-[8px] font-black text-[#2E7D32] uppercase tracking-[0.3em]">Location</span>
                <p class="text-white text-sm font-bold line-clamp-1">{{ bannerProgram.location }}</p>
              </div>
            </div>

            <div class="flex items-center gap-6">
              <NuxtLink :to="`/programs/${bannerProgram._id}`" class="group/btn relative px-8 py-4 bg-white text-black font-black text-[9px] tracking-[0.3em] uppercase rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95">
                <span class="relative z-10">ENGAGE DETAILS</span>
                <div class="absolute inset-0 bg-[#2E7D32] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
              </NuxtLink>
              
              <NuxtLink v-if="bannerProgram.registerLink" :to="bannerProgram.registerLink" target="_blank" class="text-white text-[9px] font-black uppercase tracking-[0.2em] border-b border-[#2E7D32] pb-1 hover:text-[#2E7D32] transition-all">
                JOIN VIRTUAL ROOM
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us Section -->
    <section v-if="homeContent" class="container mx-auto px-6">
      <div class="max-w-4xl mx-auto text-center space-y-10 md:space-y-14 animate-fade-in-up">
        <div class="border-b border-gray-100 pb-8 md:pb-10">
          <span class="text-[10px] font-black uppercase tracking-[0.5em] text-[#2E7D32] mb-4 block">{{ homeContent.aboutUsSubTitle || 'Who We Are' }}</span>
          <h2 class="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-tight" v-html="homeContent.aboutUsTitle || 'About <span class=\'not-italic text-gray-400\'>PANAFSTRAG</span>'"></h2>
        </div>
        
        <div class="max-w-3xl mx-auto">
          <p class="text-gray-500 text-lg md:text-xl font-medium leading-relaxed whitespace-pre-line" v-html="homeContent.aboutUsDescription || 'Panafricana Stratetegic & Policy Research Group was founded in 1992 to provide an in-depth study and analysis of the challenges of political stability, safety and development in Africa and propose policy options and strategies for these issues while synergising the potentials of its diaspora for executing these policies.'"></p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <!-- <section class="container mx-auto px-6">
      <div class="grid md:grid-cols-3 gap-8 md:gap-12">
        <div v-for="(feature, i) in features" :key="i"
          class="glass-card group animate-fade-in-up"
          :class="`delay-${(i + 1) * 100}`">
          <div class="w-14 h-14 bg-black rounded-lg mb-6 md:mb-8 flex items-center justify-center text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-[#2E7D32]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="feature.iconPath" />
            </svg>
          </div>
          <h3 class="text-xl md:text-2xl font-black mb-4 md:mb-6 tracking-tighter uppercase italic">{{ feature.title }}</h3>
          <p class="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </section> -->

    <!-- Objectives & Responsibilities -->
    <section class="container mx-auto px-6 space-y-32">
        <!-- Objectives -->
        <div class="space-y-8 md:space-y-12 animate-fade-in-up">
           <div class="border-b border-gray-100 pb-6 md:pb-12 text-center md:text-left">
             <span class="text-[10px] font-black uppercase tracking-[0.5em] text-[#2E7D32] mb-4 block" v-html="homeContent?.objectivesSubTitle || 'Strategic Alignment'"></span>
             <h2 class="text-3xl md:text-6xl font-black tracking-tighter uppercase italic" v-html="homeContent?.objectivesTitle || 'Institutional <br class=\'md:hidden\' /> <span class=\'not-italic text-gray-400\'>Objectives.</span>'"></h2>
           </div>
           <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
              <div v-for="(obj, i) in (objectives as any[])" :key="i" class="space-y-4 group">
                <span class="text-[#2E7D32] font-black text-4xl md:text-5xl opacity-20 group-hover:opacity-100 transition-all duration-500">{{ (i+1).toString().padStart(2, '0') }}</span>
                <p class="text-gray-500 font-bold leading-relaxed text-sm md:text-base tracking-tight" v-html="obj.description"></p>
              </div>
              <div v-if="!objectives?.length" class="col-span-full py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                <p class="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Strategic objectives pending...</p>
              </div>
           </div>
        </div>

        <!-- Responsibilities -->
        <div class="space-y-8 md:space-y-12 animate-fade-in-up">
           <div class="border-b border-gray-100 pb-6 md:pb-12 text-center md:text-right">
             <span class="text-[10px] font-black uppercase tracking-[0.5em] text-[#2E7D32] mb-4 block text-center md:text-right" v-html="homeContent?.responsibilitiesSubTitle || 'Code of Conduct'"></span>
             <h2 class="text-3xl md:text-6xl font-black tracking-tighter uppercase italic" v-html="homeContent?.responsibilitiesTitle || 'Core <br class=\'md:hidden\' /> <span class=\'not-italic text-gray-400\'>Responsibilities.</span>'"></h2>
           </div>
           <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              <div v-for="(res, i) in (responsibilities as any[])" :key="i" class="p-8 md:p-12 bg-gray-50 rounded-2xl hover:bg-[#2E7D32] hover:text-white transition-all duration-500 group shadow-sm">
                <p class="font-bold text-sm md:text-base leading-loose" v-html="res.description"></p>
              </div>
              <div v-if="!responsibilities?.length" class="col-span-full py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-center">
                <p class="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Commitments under review...</p>
              </div>
           </div>
        </div>
    </section>

    <!-- Recent Programmes Section -->
    <section class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 md:mb-16 border-b border-gray-100 pb-6 md:pb-8 gap-4">
        <div>
          <span v-if="homeContent?.programsSubTitle" class="text-[10px] font-black uppercase tracking-[0.5em] text-[#2E7D32] mb-4 block" v-html="homeContent.programsSubTitle"></span>
          <h2 class="text-3xl md:text-4xl font-black tracking-tighter uppercase italic" v-html="homeContent?.programsTitle || 'Recent <span class=\'not-italic text-gray-400\'>Programmes</span>'"></h2>
        </div>
        <NuxtLink to="/programs" class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#2E7D32] transition-colors self-start md:self-auto">View All Programmes —></NuxtLink>
      </div>

      <div v-if="pending" class="grid md:grid-cols-3 gap-8 md:gap-12">
        <div v-for="i in 3" :key="i" class="h-[400px] md:h-[500px] bg-gray-50 rounded-2xl animate-pulse"></div>
      </div>

      <div v-else class="grid md:grid-cols-3 gap-8 md:gap-12">
        <div v-for="(program, i) in (programs as any[])" :key="program._id"
          class="group relative animate-fade-in-up"
          :class="`delay-${(i + 1) * 100}`">
          <div class="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-sm">
            <img v-if="program.imageUrl" :src="program.imageUrl" alt="" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            <img v-else src="@/assets/images/program-placeholder.png" alt="" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100" />
          </div>
          <div class="space-y-3 md:space-y-4">
            <span class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#2E7D32]">{{ program.type }}</span>
            <h4 class="text-xl md:text-2xl font-black uppercase tracking-tighter group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-tight italic">{{ program.title }}</h4>
            <div class="pt-2 md:pt-4 flex items-center gap-4">
              <NuxtLink :to="`/programs`" class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] border-b-2 border-black pb-1 hover:border-[#2E7D32] transition-all">Read Details</NuxtLink>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!programs?.length" class="col-span-full py-24 md:py-32 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
          <p class="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">No recent programmes found.</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="container mx-auto px-6">
      <div class="bg-black rounded-[1.5rem] md:rounded-[2rem] p-10 md:p-24 text-center text-white relative overflow-hidden group">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#2E7D32_0%,transparent_100%)] opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
        <div class="relative z-10 max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-7xl font-black mb-6 md:mb-10 tracking-tighter uppercase italic leading-[0.9]" v-html="homeContent?.ctaTitle || 'Participate in <br class=\'hidden md:block\' /> <span class=\'not-italic text-[#2E7D32]\'>the Future.</span>'"></h2>
          <p class="text-gray-400 mb-10 md:mb-16 text-base md:text-xl leading-relaxed font-medium uppercase tracking-widest text-[10px]" v-html="homeContent?.ctaDescription || 'Join a network of leading experts dedicated to solving the most pressing strategic challenges facing the African continent today.'"></p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button class="btn-secondary !py-3 md:!py-4 !bg-[#2E7D32] !text-white !border-transparent hover:!bg-white hover:!text-black w-full sm:w-auto">
              GET INVOLVED
            </button>
            <NuxtLink to="/contact" class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#2E7D32] transition-colors">
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
