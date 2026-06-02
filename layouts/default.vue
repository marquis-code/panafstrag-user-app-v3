<template>
  <div class="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">

    <!-- ═══ NAVBAR ═══ -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      :class="scrolled ? 'bg-white/95 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(0,0,0,0.08)]' : 'bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.04)]'"
    >
      <!-- Top ticker bar -->
      <div
        class="overflow-hidden border-b border-black/5 transition-all duration-500"
        :class="scrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'"
      >
        <div class="flex items-center justify-between px-4 md:px-6 h-8">
          <div class="flex items-center gap-2 overflow-hidden">
            <span class="w-1.5 h-1.5 flex-shrink-0 rounded-full bg-[#2E7D32] animate-pulse"></span>
            <span class="text-xs md:text-sm font-black text-gray-500 truncate">
              {{ t(homeContent?.websiteHeaderText || 'Est. 1992 — Panafricana Strategic & Policy Research Group') }}
            </span>
          </div>
          <span class="text-xs md:text-sm font-black text-gray-400 hidden md:block flex-shrink-0 ml-4">
            {{ t(currentDate) }}
          </span>
        </div>
      </div>

      <!-- Main nav -->
      <nav class="px-6 md:px-10 flex items-center justify-between transition-all duration-500"
        :class="scrolled ? 'h-16' : 'h-20'">

        <!-- Logo -->
        <NuxtLink to="/" class="relative z-10 flex-shrink-0 hover:opacity-70 transition-opacity duration-300 active:scale-95">
          <Logo />
        </NuxtLink>

        <!-- Desktop nav links -->
        <div class="hidden lg:flex items-center gap-2">
          <NuxtLink to="/" class="nav-link group relative px-5 py-2 text-sm font-black transition-colors duration-200 hover:text-black/50" active-class="!text-black">
            {{ t('Home') }}
            <span class="absolute bottom-0 left-5 right-5 h-[1.5px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </NuxtLink>

          <!-- Dropdown: The Institute -->
          <div class="relative group" @mouseenter="instituteHover = true" @mouseleave="instituteHover = false">
            <button class="nav-link group relative px-5 py-2 text-sm font-black transition-colors duration-200 hover:text-black/50 flex items-center gap-1 rounded-full">
              {{ t('The Institute') }}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 transition-transform duration-300" :class="instituteHover ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              <span class="absolute bottom-0 left-5 right-5 h-[1.5px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </button>
            <div class="absolute top-full pt-4 left-0 w-64 bg-black text-white p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] opacity-0 translate-y-6 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) z-50 border border-white/10">
              <div class="mb-4 flex items-center gap-3">
                <div class="h-[1px] w-4 bg-white/30"></div>
                <span class="text-sm font-black text-white/30">{{ t('Organization') }}</span>
              </div>
              <div class="flex flex-col gap-4">
                <NuxtLink v-for="item in instituteItemsRes" :key="item.path" :to="item.path" class="text-sm font-black hover:text-gray-400 transition-all duration-300 py-2 border-b border-white/5 last:border-0 hover:pl-2">
                  {{ item.label }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <NuxtLink
            v-for="item in primaryItemsRes"
            :key="item.path"
            :to="item.path"
            class="nav-link group relative px-5 py-2 text-sm font-black transition-colors duration-200 hover:text-black/50"
            active-class="!text-black"
          >
            <span class="absolute bottom-0 left-5 right-5 h-[1.5px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            {{ item.label }}
          </NuxtLink>

          <LanguageSwitcher class="ml-4" />

          <!-- CTA pill -->
          <NuxtLink
            to="/contact"
            class="ml-8 px-6 py-2.5 bg-black text-white text-sm font-black hover:bg-black/80 active:scale-95 transition-all duration-200 rounded-full shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)]"
          >
            {{ t('Contact') }} →
          </NuxtLink>

          <!-- Desktop Search Trigger -->
          <button @click="isSearchOpen = true" class="ml-4 flex items-center justify-center p-2.5 rounded-full border border-black/10 hover:bg-black/5 transition-colors group" title="Global Search">
             <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-black/60 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </button>
        </div>

        <!-- Mobile Search & Language Trigger -->
        <div class="lg:hidden ml-auto mr-2 flex items-center gap-1">
          <LanguageSwitcher />
          <button @click="isSearchOpen = true" class="p-2 text-black hover:bg-black/5 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <!-- Mobile hamburger -->
        <button
          @click="toggleMobile"
          class="lg:hidden relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-[5px] group"
          :aria-label="isMobileOpen ? 'Close menu' : 'Open menu'"
        >
          <span
            class="block w-6 h-[1.5px] bg-current transition-all duration-300"
            :class="isMobileOpen ? 'rotate-45 translate-y-[6.5px] bg-white' : ''"
          ></span>
          <span
            class="block h-[1.5px] bg-current transition-all duration-300"
            :class="isMobileOpen ? 'opacity-0 w-0 bg-white' : 'w-4'"
          ></span>
          <span
            class="block w-6 h-[1.5px] bg-current transition-all duration-300"
            :class="isMobileOpen ? '-rotate-45 -translate-y-[6.5px] bg-white' : ''"
          ></span>
        </button>
      </nav>
    </header>

    <!-- ═══ FULLSCREEN MOBILE MENU ═══ -->
    <Transition
      enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
      enter-from-class="opacity-0 clip-top"
      enter-to-class="opacity-100 clip-full"
      leave-active-class="transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)]"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileOpen"
        class="fixed inset-0 z-40 bg-black text-white flex flex-col lg:hidden overflow-hidden"
      >
        <!-- Decorative grid lines -->
        <div class="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-5">
          <div v-for="i in 5" :key="i" class="border-l border-white h-full"></div>
        </div>

        <!-- Nav items -->
        <div class="flex-1 flex flex-col justify-center px-10 pt-28 pb-16 relative z-10 overflow-y-auto">
          <div class="mb-10 flex items-center justify-between">
            <span class="text-sm font-black text-white/30">{{ t('Intelligence Network') }}</span>
            <div class="h-[1px] flex-1 bg-white/10 ml-6"></div>
          </div>

          <!-- Section: Principal -->
          <div class="grid md:grid-cols-2 gap-12">
            <div class="space-y-8">
              <h3 class="text-sm font-black text-gray-500">01. {{ t('Principal') }}</h3>
              <nav class="flex flex-col gap-4">
                <NuxtLink to="/" @click="isMobileOpen = false" class="text-4xl font-black hover:text-gray-400 transition-colors">{{ t('Home') }}</NuxtLink>
                <NuxtLink v-for="item in primaryItemsRes" :key="item.path" :to="item.path" @click="isMobileOpen = false" class="text-4xl font-black hover:text-gray-400 transition-colors">
                  {{ item.label }}
                </NuxtLink>
                <NuxtLink to="/contact" @click="isMobileOpen = false" class="text-4xl font-black hover:text-gray-400 transition-colors flex items-center gap-3">
                  {{ t('Contact') }} <span class="text-lg">→</span>
                </NuxtLink>
              </nav>
            </div>

            <!-- Section: The Institute -->
            <div class="space-y-8">
              <h3 class="text-sm font-black text-gray-500">02. {{ t('The Institute') }}</h3>
              <nav class="flex flex-col gap-4">
                <NuxtLink v-for="item in instituteItemsRes" :key="item.path" :to="item.path" @click="isMobileOpen = false" class="text-2xl font-black hover:text-gray-400 transition-colors opacity-60 hover:opacity-100">
                  {{ item.label }}
                </NuxtLink>
              </nav>
            </div>
          </div>

          <!-- Bottom info row -->
          <div class="mt-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 opacity-30">
            <div class="flex flex-col gap-1">
              <span class="text-sm font-black ">{{ t('Established') }}</span>
              <span class="text-2xl font-black">1992</span>
            </div>
            <div class="flex gap-6">
              <a href="#" class="text-sm font-black hover:text-white transition-colors">{{ t('Twitter') }}</a>
              <a href="#" class="text-sm font-black hover:text-white transition-colors">{{ t('LinkedIn') }}</a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══ MAIN CONTENT ═══ -->
    <main class="pt-[112px]">
      <slot />
    </main>

    <!-- ═══ FOOTER ═══ -->
    <footer class="relative bg-[#0F1A13] text-white pt-24 pb-12 overflow-hidden mt-20">
      <!-- Glow Effects -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#2E7D32] to-transparent opacity-30"></div>
      <div class="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#2E7D32] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-20">
          <!-- Brand Column -->
          <div class="col-span-1 lg:col-span-4 flex flex-col items-start lg:pr-10">
            <Logo class="invert brightness-0 mb-8 transform hover:scale-105 transition-transform duration-500 origin-left" />
            <p class="text-gray-400 leading-relaxed text-sm font-medium mb-10 max-w-sm">
              {{ t('An independent intelligence network and strategic policy research group dedicated to sustainable development, global positioning, and the strategic security of the African continent and its diaspora.') }}
            </p>
            <div class="flex items-center gap-4">
              <span class="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
              <span class="text-sm font-black text-gray-500">{{ t('Global Coverage') }}</span>
            </div>
          </div>

          <!-- Navigation Links Grid -->
          <div class="col-span-1 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-10">
            <!-- Organization -->
            <div class="flex flex-col gap-6">
              <h4 class="text-sm font-black text-[#2E7D32] border-b border-white/10 pb-4">{{ t('Organization') }}</h4>
              <nav class="flex flex-col gap-4">
                <NuxtLink v-for="item in instituteItemsRes" :key="item.path" :to="item.path"
                  class="text-sm font-bold text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 relative group inline-flex max-w-max">
                  <span class="relative z-10">{{ item.label }}</span>
                  <span class="absolute left-0 -bottom-1 w-full h-px bg-[#2E7D32] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </NuxtLink>
              </nav>
            </div>

            <!-- Focus Areas -->
            <div class="flex flex-col gap-6">
              <h4 class="text-sm font-black text-[#2E7D32] border-b border-white/10 pb-4">{{ t('Activities') }}</h4>
              <nav class="flex flex-col gap-4">
                <NuxtLink v-for="item in primaryItemsRes" :key="item.path" :to="item.path"
                  class="text-sm font-bold text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 relative group inline-flex max-w-max">
                  <span class="relative z-10">{{ item.label }}</span>
                  <span class="absolute left-0 -bottom-1 w-full h-px bg-[#2E7D32] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </NuxtLink>
              </nav>
            </div>

            <!-- Socials -->
            <div class="flex flex-col gap-6">
              <h4 class="text-sm font-black text-[#2E7D32] border-b border-white/10 pb-4">{{ t('Connect') }}</h4>
              <nav class="flex flex-col gap-4">
                <template v-if="homeContent?.contactSocialLinks?.length">
                  <a v-for="link in homeContent.contactSocialLinks" :key="link.platform" :href="link.url" target="_blank" class="text-sm font-bold text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-flex items-center gap-2 group">
                    <span class="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#2E7D32] transition-colors"></span>
                    {{ t(link.platform) }}
                  </a>
                </template>
                <template v-else>
                  <a href="#" class="text-sm font-bold text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-flex items-center gap-2 group">
                    <span class="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#2E7D32] transition-colors"></span>
                    {{ t('Twitter (X)') }}
                  </a>
                  <a href="#" class="text-sm font-bold text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-flex items-center gap-2 group">
                    <span class="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#2E7D32] transition-colors"></span>
                    {{ t('LinkedIn') }}
                  </a>
                </template>
              </nav>
            </div>

            <!-- Get Involved (CTA) -->
            <div class="flex flex-col gap-6">
              <h4 class="text-sm font-black text-[#2E7D32] border-b border-white/10 pb-4">{{ t('Participate') }}</h4>
              <p class="text-sm text-gray-400 leading-relaxed font-medium">{{ t('Join our strategic network of thinkers and leaders.') }}</p>
              <NuxtLink to="/contact" class="mt-2 text-sm font-black text-center bg-white text-black py-4 px-6 hover:bg-[#2E7D32] hover:text-white transition-colors duration-500 w-full shadow-[0_0_20px_rgba(46,125,50,0.2)] hover:shadow-[0_0_30px_rgba(46,125,50,0.5)]">
                {{ t('JOIN NOW') }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        <!-- Bottom Bar -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <p class="text-gray-600 text-sm font-black ">
            © {{ new Date().getFullYear() }} {{ t('PANAFSTRAG. All Rights Reserved.') }}
          </p>
          <div class="flex gap-6">
            <NuxtLink to="/privacy-policy" class="text-gray-600 text-sm font-black hover:text-white transition-colors">{{ t('Privacy Policy') }}</NuxtLink>
            <NuxtLink to="/terms" class="text-gray-600 text-sm font-black hover:text-white transition-colors">{{ t('Terms of Service') }}</NuxtLink>
          </div>
        </div>
      </div>
    </footer>

    <!-- Chat Widget -->
    <!-- Chat Widget -->
    <ChatWidget />

    <!-- Global Search Modal -->
    <SearchModal :isOpen="isSearchOpen" @close="isSearchOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
import { useI18n } from '@/composables/useI18n'

const { homeContent } = useHomeContent()
const { t } = useI18n()

const isMobileOpen = ref(false)
const scrolled = ref(false)
const isSearchOpen = ref(false)

const instituteHover = ref(false)

const instituteItemsRes = computed(() => {
  if (homeContent.value?.instituteNavItems?.length) {
    return homeContent.value.instituteNavItems.map((item: any) => ({ ...item, label: t(item.label) }))
  }
  return [
    { label: t('The Ubuntu Team'), path: '/board' },
    { label: t('Organogram'), path: '/organogram' },
    { label: t('Focus Areas'), path: '/focus-areas' },
    { label: t('Cells'), path: '/cells' },
    { label: t('Language Groups'), path: '/language-groups' },
  ]
})

const primaryItemsRes = computed(() => {
  if (homeContent.value?.primaryNavItems?.length) {
    return homeContent.value.primaryNavItems.map((item: any) => ({ ...item, label: t(item.label) }))
  }
  return [
    { label: t('Programmes'), path: '/programs' },
    { label: t('Archives'), path: '/archives' },
  ]
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).toUpperCase()
})

const toggleMobile = () => {
  isMobileOpen.value = !isMobileOpen.value
  document.body.style.overflow = isMobileOpen.value ? 'hidden' : ''
}

// Close on route change
const route = useRoute()
watch(() => route.path, () => {
  isMobileOpen.value = false
  document.body.style.overflow = ''
})

// Scroll detection
onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 40
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})
</script>

<style scoped>
.nav-link {
  position: relative;
}

/* Stagger mobile items on open */
.mobile-nav-item {
  animation: slideUp 0.5s cubic-bezier(0.76, 0, 0.24, 1) both;
}

.mobile-nav-item:nth-child(1) { animation-delay: 0.05s; }
.mobile-nav-item:nth-child(2) { animation-delay: 0.1s; }
.mobile-nav-item:nth-child(3) { animation-delay: 0.15s; }
.mobile-nav-item:nth-child(4) { animation-delay: 0.2s; }
.mobile-nav-item:nth-child(5) { animation-delay: 0.25s; }
.mobile-nav-item:nth-child(6) { animation-delay: 0.3s; }

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
