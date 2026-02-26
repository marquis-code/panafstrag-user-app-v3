<template>
  <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
    <!-- Carousel Track -->
    <div class="absolute inset-0 z-0 h-full w-full">
      <TransitionGroup :name="initialized ? 'fade' : ''">
        <div 
          v-for="(slide, index) in carousels" 
          :key="index"
          v-show="currentIndex === index"
          class="absolute inset-0 w-full h-full"
        >
          <!-- Background Image & Overlay -->
          <div class="absolute inset-0 z-0 h-full w-full">
            <img 
              :src="slide.imgUrl || '/hero.jpeg'" 
              class="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-[10000ms]"
              :class="{ 'scale-110': currentIndex === index }"
            />
            <div class="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-black/90"></div>
            <div class="absolute inset-0 bg-black/20"></div>
          </div>

          <div class="container mx-auto px-6 relative z-10 h-full flex items-center">
            <div class="max-w-4xl mx-auto text-center">
              <div v-if="establishedText || $slots.established" class="inline-flex items-center gap-2 px-4 py-2 mb-10 border border-white/10 bg-white/5 backdrop-blur-md rounded-full animate-fade-in-up">
                <span class="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse"></span>
                <span class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                  <slot name="established">{{ establishedText || 'ESTABLISHED 1992' }}</slot>
                </span>
              </div>

              <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 md:mb-10 leading-[0.85] tracking-tighter text-white animate-fade-in-up delay-100 italic uppercase">
                {{ slide.title }}
              </h1>

              <p class="text-lg md:text-xl text-gray-300 mb-10 md:mb-16 max-w-2xl mx-auto leading-relaxed font-medium animate-fade-in-up delay-200">
                {{ slide.description }}
              </p>

              <div class="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-fade-in-up delay-300">
                <NuxtLink to="/programs" class="group relative px-10 py-5 bg-[#2E7D32] text-white font-black text-[10px] tracking-[0.3em] uppercase rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95">
                  <span class="relative z-10">EXPLORE PROGRAMMES</span>
                  <div class="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </NuxtLink>
                <NuxtLink to="/archives" class="px-10 py-5 border border-white/20 text-white font-black text-[10px] tracking-[0.3em] uppercase rounded-xl hover:bg-white hover:text-black transition-all">
                  VIEW ARCHIVES
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Carousel Nav -->
    <div v-if="carousels.length > 1" class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
      <button 
        v-for="(_, i) in carousels" :key="i"
        @click="currentIndex = i"
        class="w-12 h-1 transition-all duration-500"
        :class="currentIndex === i ? 'bg-[#2E7D32] w-20' : 'bg-white/20'"
      ></button>
    </div>

    <!-- Subtle Grid Pattern Overlay -->
    <div class="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none" style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 60px 60px;"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps<{
  carousels: any[],
  establishedText?: string
}>()

const currentIndex = ref(0)
const initialized = ref(false)
let timer: any = null

const preloadImages = () => {
  for (const slide of props.carousels) {
    if (slide.imgUrl) {
      const img = new Image()
      img.src = slide.imgUrl
    }
  }
}

const startTimer = () => {
  if (props.carousels.length <= 1) return
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.carousels.length
  }, 6000)
}

onMounted(async () => {
  preloadImages()
  // Allow the first slide to render without fade animation
  await nextTick()
  await nextTick()
  initialized.value = true
  startTimer()
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
