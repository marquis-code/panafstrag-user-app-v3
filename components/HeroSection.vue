<template>
  <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
    <!-- Background Video & Overlay -->
    <div class="absolute inset-0 z-0 h-full w-full">
      <video
        autoplay
        muted
        loop
        playsinline
        class="absolute inset-0 w-full h-full object-cover opacity-70 scale-105"
        poster="@/assets/images/hero-poster.jpg"
      >
        <source src="https://player.vimeo.com/external/494252666.hd.mp4?s=3187c53d169a842f1f44a8e329e61c552097063a&profile_id=174" type="video/mp4">
      </video>
      <div class="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-black/90"></div>
      <div class="absolute inset-0 bg-black/20"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 mb-10 border border-white/10 bg-white/5 backdrop-blur-md rounded-full animate-fade-in-up">
          <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">ESTABLISHED 1992</span>
        </div>

        <h1 class="text-4xl sm:text-6xl lg:text-9xl font-black mb-6 md:mb-10 leading-[0.85] tracking-tighter text-white animate-fade-in-up delay-100 italic">
          STRATEGIC <br />
          <span class="not-italic text-gray-400">RESEARCH.</span>
        </h1>

        <p class="text-lg md:text-xl text-gray-300 mb-10 md:mb-16 max-w-2xl mx-auto leading-relaxed font-medium animate-fade-in-up delay-200">
          Providing deep strategic insights and policy recommendations to foster sustainable development and security across the African continent.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-fade-in-up delay-300">
          <NuxtLink to="/programs" class="group relative px-10 py-5 bg-white text-black font-black text-[10px] tracking-[0.3em] uppercase rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95">
            <span class="relative z-10 transition-colors group-hover:text-white">EXPLORE PROGRAMS</span>
            <div class="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </NuxtLink>
          <NuxtLink to="/archives" class="px-10 py-5 border border-white/20 text-white font-black text-[10px] tracking-[0.3em] uppercase rounded-xl hover:bg-white hover:text-black transition-all">
            VIEW ARCHIVES
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Subtle Grid Pattern Overlay -->
    <div class="absolute inset-0 z-[1] opacity-[0.1] pointer-events-none" style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 60px 60px;"></div>
  </section>
</template>
