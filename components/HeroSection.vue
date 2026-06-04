<template>
  <section
    class="relative min-h-[90vh] flex items-center overflow-hidden"
    :style="heroSectionStyle"
  >
    <!-- Instant first-slide image: painted immediately, outside Vue transitions -->
    <img
      v-if="firstSlideImg"
      :src="firstSlideImg"
      alt=""
      fetchpriority="high"
      loading="eager"
      decoding="sync"
      class="absolute inset-0 w-full h-full object-cover opacity-50 z-0 hero-instant-img"
    />

    <!-- Layered overlays -->
    <div class="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/50 to-black/80 z-[1]"></div>
    <div class="absolute inset-0 z-[1]" style="background-image: radial-gradient(#ffffff08 1px, transparent 1px); background-size: 48px 48px;"></div>

    <!-- Carousel Track -->
    <div class="absolute inset-0 z-[2] h-full w-full">
      <TransitionGroup :name="initialized ? 'fade' : ''">
        <div
          v-for="(slide, index) in carousels"
          :key="index"
          v-show="currentIndex === index"
          class="absolute inset-0 w-full h-full"
        >
          <!-- Slide background image -->
          <div class="absolute inset-0 z-0 h-full w-full">
            <img
              :src="resolveImageUrl(slide.imgUrl)"
              :fetchpriority="index === 0 ? 'high' : 'low'"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :decoding="index === 0 ? 'sync' : 'async'"
              class="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-[10000ms]"
              :class="{ 'scale-105': currentIndex === index }"
            />
            <div class="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/50 to-black/80"></div>
          </div>

          <!-- Slide content -->
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center">
            <div class="max-w-3xl">

              <!-- Established pill -->
              <div
                v-if="establishedText || $slots.established"
                class="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full animate-fade-in-up"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse inline-block"></span>
                <span class="text-[12px] font-semibold text-slate-300 tracking-widest uppercase">
                  <slot name="established">{{ t(establishedText || 'ESTABLISHED 1992') }}</slot>
                </span>
              </div>

              <!-- Heading -->
              <h1 class="text-4xl sm:text-5xl lg:text-[60px] font-bold text-white leading-[1.05] tracking-tight mb-6 animate-fade-in-up delay-100">
                {{ slide.title ? t(slide.title) : '' }}
              </h1>

              <!-- Description -->
              <p class="text-[16px] sm:text-[18px] text-slate-300 leading-relaxed mb-10 max-w-xl font-medium animate-fade-in-up delay-200">
                {{ slide.description ? t(slide.description) : '' }}
              </p>

              <!-- CTAs -->
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up delay-300">
                <NuxtLink
                  to="/programs"
                  class="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-green-800 text-white text-[14px] font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200"
                >
                  {{ t('EXPLORE PROGRAMMES') }}
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </NuxtLink>
                <NuxtLink
                  to="/archives"
                  class="inline-flex items-center gap-2 text-[14px] font-semibold text-slate-300 hover:text-white border border-white/20 hover:border-white/40 px-7 py-3.5 rounded-xl transition-all duration-200"
                >
                  {{ t('VIEW ARCHIVES') }}
                </NuxtLink>
              </div>

            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Carousel dot nav -->
    <div v-if="carousels.length > 1" class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
      <button
        v-for="(_, i) in carousels"
        :key="i"
        @click="currentIndex = i"
        :aria-label="`${t('Go to slide')} ${i + 1}`"
        class="h-1 rounded-full transition-all duration-500"
        :class="currentIndex === i ? 'bg-[#2E7D32] w-8' : 'bg-white/25 w-4 hover:bg-white/40'"
      ></button>
    </div>

    <!-- Subtle bottom fade to white -->
    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/10 to-transparent z-[3] pointer-events-none"></div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
const { t } = useI18n()
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps<{
  carousels: any[]
  establishedText?: string
}>()

const currentIndex = ref(0)
const initialized = ref(false)
let timer: any = null

const HERO_IMG_CACHE_KEY = 'panafstrag_hero_img_cache'

const getCachedImageMap = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(HERO_IMG_CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

const cacheImageBlob = async (url: string): Promise<string | null> => {
  if (!url || url.startsWith('data:') || url.startsWith('/')) return null
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        try {
          const map = getCachedImageMap()
          map[url] = base64
          localStorage.setItem(HERO_IMG_CACHE_KEY, JSON.stringify(map))
        } catch { /* storage full */ }
        resolve(base64)
      }
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch { return null }
}

const resolveImageUrl = (url: string | undefined): string => {
  if (!url) return '/hero.jpeg'
  const map = getCachedImageMap()
  return map[url] || url
}

const firstSlideImg = computed(() => {
  const url = props.carousels?.[0]?.imgUrl
  return resolveImageUrl(url)
})

const heroSectionStyle = computed(() => ({
  backgroundImage: `url(${firstSlideImg.value})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#0d1a0f',
}))

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: firstSlideImg.value,
      fetchpriority: 'high',
    },
  ],
})

const startTimer = () => {
  if (props.carousels.length <= 1) return
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.carousels.length
  }, 10000)
}

onMounted(async () => {
  for (const slide of props.carousels) {
    if (slide.imgUrl) cacheImageBlob(slide.imgUrl)
  }
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
.hero-instant-img {
  transition: none !important;
  animation: none !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>