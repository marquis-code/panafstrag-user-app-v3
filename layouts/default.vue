<template>
  <div class="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">

    <!-- ═══ NAVBAR ═══ -->
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      :class="scrolled ? 'bg-white/95 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(0,0,0,0.08)]' : 'bg-transparent'"
    >
      <!-- Top ticker bar -->
      <div
        class="overflow-hidden border-b border-black/5 transition-all duration-500"
        :class="scrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'"
      >
        <div class="flex items-center justify-between px-6 h-8">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></span>
            <span class="text-[9px] font-black uppercase tracking-[0.4em] text-black/40">
              Est. 1992 — Pan-African Strategic & Policy Research Group
            </span>
          </div>
          <span class="text-[9px] font-black uppercase tracking-[0.3em] text-black/30 hidden md:block">
            {{ currentDate }}
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
        <div class="hidden lg:flex items-center">
          <div class="flex items-center">
            <NuxtLink
              v-for="(item, i) in navItems"
              :key="item.path"
              :to="item.path"
              class="nav-link group relative px-5 py-2 text-[11px] font-black uppercase tracking-[0.25em] transition-colors duration-200 hover:text-black/50"
              active-class="!text-black"
            >
              <!-- Animated underline -->
              <span class="absolute bottom-0 left-5 right-5 h-[1.5px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              <!-- Number accent -->
              <span class="absolute -top-0.5 left-3 text-[7px] font-black text-black/20 tracking-normal tabular-nums opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                0{{ i + 1 }}
              </span>
              {{ item.label }}
            </NuxtLink>
          </div>

          <!-- CTA pill -->
          <NuxtLink
            to="/contact"
            class="ml-8 px-6 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.25em] hover:bg-black/80 active:scale-95 transition-all duration-200 rounded-none"
          >
            Contact →
          </NuxtLink>
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
        <div class="flex-1 flex flex-col justify-center px-10 pt-28 pb-16 relative z-10">
          <div class="mb-10">
            <span class="text-[9px] font-black uppercase tracking-[0.5em] text-white/30">Navigation</span>
          </div>

          <nav class="flex flex-col">
            <NuxtLink
              v-for="(item, i) in navItems"
              :key="item.path"
              :to="item.path"
              @click="isMobileOpen = false"
              class="mobile-nav-item group flex items-baseline gap-4 py-4 border-b border-white/10 hover:pl-4 transition-all duration-300"
            >
              <span class="text-[10px] font-black text-white/20 tabular-nums w-6 flex-shrink-0">0{{ i + 1 }}</span>
              <span class="text-4xl sm:text-5xl font-black uppercase tracking-tight group-hover:text-white/60 transition-colors duration-200">
                {{ item.label }}
              </span>
              <span class="ml-auto text-white/20 group-hover:text-white/60 transition-colors duration-200 text-2xl">→</span>
            </NuxtLink>
          </nav>

          <!-- Bottom info row -->
          <div class="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div class="flex flex-col gap-1">
              <span class="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Established</span>
              <span class="text-2xl font-black text-white/60">1992</span>
            </div>
            <div class="flex gap-6">
              <a href="#" class="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Twitter</a>
              <a href="#" class="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" class="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">ResearchGate</a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══ MAIN CONTENT ═══ -->
    <main class="pt-[calc(2rem+5rem)]">
      <slot />
    </main>

    <!-- ═══ FOOTER ═══ -->
    <footer class="bg-black text-white py-24">
      <div class="container mx-auto px-6">
        <div class="grid md:grid-cols-4 gap-16 mb-24">
          <div class="col-span-2">
            <Logo class="invert brightness-0 mb-8" />
            <p class="text-gray-400 max-w-sm leading-relaxed text-sm">
              Strategic and Policy Research Group dedicated to the sustainable development and security of the African continent.
            </p>
          </div>
          <div>
            <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Navigation</h4>
            <div class="flex flex-col gap-4">
              <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
                class="text-sm font-bold hover:text-gray-400 transition-colors">
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>
          <div>
            <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Social</h4>
            <div class="flex flex-col gap-4">
              <a href="#" class="text-sm font-bold hover:text-gray-400 transition-colors">Twitter (X)</a>
              <a href="#" class="text-sm font-bold hover:text-gray-400 transition-colors">LinkedIn</a>
              <a href="#" class="text-sm font-bold hover:text-gray-400 transition-colors">ResearchGate</a>
            </div>
          </div>
        </div>
        <div class="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p class="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            © {{ new Date().getFullYear() }} PANAFSTRAG.
          </p>
          <p class="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            ESTABLISHED 1992.
          </p>
        </div>
      </div>
    </footer>

    <!-- Chat Widget -->
    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
const isMobileOpen = ref(false)
const scrolled = ref(false)

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'The Board', path: '/board' },
  { label: 'Cells', path: '/cells' },
  { label: 'Programs', path: '/programs' },
  { label: 'Archives', path: '/archives' },
  { label: 'Contact', path: '/contact' },
]

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
