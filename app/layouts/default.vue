<template>
  <div class="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
      <nav class="container mx-auto px-6 h-24 flex items-center justify-between">
        <NuxtLink to="/" class="hover:opacity-80 transition-all duration-300 active:scale-95">
          <Logo />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center gap-10">
          <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" 
            class="text-[13px] font-black uppercase tracking-[0.2em] hover:text-gray-400 transition-all duration-300"
            active-class="text-black pointer-events-none">
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="flex items-center gap-6">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="isMobileMenuOpen" class="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 shadow-xl">
          <div class="flex flex-col gap-4">
            <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" 
              class="text-lg font-bold hover:text-indigo-600 transition-colors"
              @click="isMobileMenuOpen = false">
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-12">
      <slot />
    </main>

    <!-- Footer -->
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
              <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" class="text-sm font-bold hover:text-gray-400 transition-colors">
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

<script setup>
const isMobileMenuOpen = ref(false)

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'The Board', path: '/board' },
  { label: 'Cells', path: '/cells' },
  { label: 'Programs', path: '/programs' },
  { label: 'Archives', path: '/archives' },
  { label: 'Contact', path: '/contact' }
]
</script>
