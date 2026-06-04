<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
import { useFetchBoardMember } from '@/composables/modules/board/useFetchBoardMember'

const route = useRoute()
const { boardMember, loading, fetchBoardMember } = useFetchBoardMember()

useHead({
  title: computed(() => `${boardMember.value?.name || 'Board Member'} | PANAFSTRAG`),
})
</script>

<template>
  <div class="min-h-screen bg-white font-body">

    <!-- ─── HERO STRIP ────────────────────────────────────────── -->
    <section class="bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <NuxtLink
          to="/board"
          class="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-400 hover:text-[#2E7D32] transition-colors duration-200 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-1 transition-transform duration-200"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          {{ t('Back to Board') }}
        </NuxtLink>
      </div>
    </section>

    <!-- ─── SKELETON ──────────────────────────────────────────── -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid lg:grid-cols-12 gap-10 animate-pulse">
        <div class="lg:col-span-4 aspect-[3/4] bg-slate-100 rounded-2xl"></div>
        <div class="lg:col-span-8 space-y-6 pt-4">
          <div class="h-4 bg-slate-100 rounded-full w-1/5"></div>
          <div class="h-10 bg-slate-100 rounded-full w-2/3"></div>
          <div class="h-4 bg-slate-100 rounded-full w-1/3"></div>
          <div class="space-y-3 pt-8">
            <div v-for="i in 6" :key="i" class="h-3 bg-slate-100 rounded-full" :style="{ width: `${85 - i * 5}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── PROFILE ───────────────────────────────────────────── -->
    <div v-else-if="boardMember">

      <!-- Top identity band -->
      <section class="bg-slate-50 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div class="grid lg:grid-cols-12 gap-10 items-end">

            <!-- Avatar -->
            <div class="lg:col-span-4">
              <div class="aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm relative">
                <img
                  v-if="boardMember?.avatar"
                  :src="boardMember.avatar"
                  class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  :alt="boardMember?.name"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-7xl font-bold text-slate-200"
                >
                  {{ boardMember?.name?.charAt(0) || 'B' }}
                </div>
              </div>
            </div>

            <!-- Identity -->
            <div class="lg:col-span-8 space-y-6 pb-2">
              <div class="inline-flex items-center gap-2 bg-green-50 text-[#2E7D32] text-xs font-semibold px-4 py-2 rounded-full border border-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {{ t('Board of Trustees') }}
              </div>

              <div>
                <h1 class="text-4xl sm:text-5xl lg:text-[52px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-4">
                  {{ boardMember?.name }}
                </h1>
                <div class="flex flex-wrap items-center gap-3">
                  <span class="inline-flex items-center bg-[#2E7D32] text-white text-[12px] font-semibold px-4 py-1.5 rounded-full">
                    {{ boardMember?.position ? t(boardMember.position) : '' }}
                  </span>
                  <span
                    v-if="boardMember?.university"
                    class="text-[13px] font-medium text-slate-400 border border-slate-200 px-4 py-1.5 rounded-full bg-white"
                  >
                    {{ boardMember?.university }}
                  </span>
                </div>
              </div>

              <!-- Email row -->
              <div
                v-if="boardMember?.email?.length"
                class="flex flex-wrap gap-3 pt-4 border-t border-slate-200"
              >
                <p class="w-full text-[11px] font-semibold text-slate-400 tracking-widest uppercase mb-1">{{ t('Direct Intelligence') }}</p>
                <a
                  v-for="email in boardMember.email"
                  :key="email"
                  :href="`mailto:${email}`"
                  class="inline-flex items-center gap-2 text-[13px] font-semibold text-[#2E7D32] hover:underline underline-offset-4 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  {{ email }}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ─── BODY: Bio + Duties ─────────────────────────────── -->
      <section class="bg-white border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div class="grid lg:grid-cols-12 gap-10 lg:gap-16">

            <!-- Bio -->
            <div class="lg:col-span-7">
              <div class="bg-white border border-slate-200 rounded-2xl p-7 lg:p-10 hover:border-green-200 hover:shadow-sm transition-all duration-300">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <div>
                    <p class="text-[11px] font-semibold text-green-600 tracking-widest uppercase">{{ t('Curriculum Vitae / Biography') }}</p>
                  </div>
                </div>
                <p class="text-[15px] text-slate-600 leading-[1.85] font-medium whitespace-pre-wrap">
                  {{ boardMember?.bio }}
                </p>
              </div>
            </div>

            <!-- Duties sidebar -->
            <div class="lg:col-span-5 space-y-5">

              <div
                v-if="boardMember?.duties?.length"
                class="bg-white border border-slate-200 rounded-2xl p-7 hover:border-green-200 hover:shadow-sm transition-all duration-300"
              >
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  </div>
                  <p class="text-[11px] font-semibold text-green-600 tracking-widest uppercase">{{ t('Core Responsibilities') }}</p>
                </div>
                <div class="space-y-2">
                  <div
                    v-for="duty in boardMember.duties"
                    :key="duty"
                    class="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-green-200 hover:bg-green-50/30 transition-all duration-200 group"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-[#2E7D32] mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
                    <span class="text-[13px] font-semibold text-slate-700">{{ duty }}</span>
                  </div>
                </div>
              </div>

              <!-- Accent card -->
              <div class="bg-[#2E7D32] border border-green-800 rounded-2xl p-7 relative overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="absolute -right-5 -bottom-5 opacity-[0.07] pointer-events-none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <p class="text-[11px] font-semibold text-green-300 tracking-widest uppercase mb-2">PANAFSTRAG</p>
                <h3 class="text-[17px] font-bold text-white mb-3 leading-snug">
                  {{ t('Board of Trustees') }}
                </h3>
                <p class="text-[13px] text-green-200 leading-relaxed">
                  Serving with distinction across strategic, scientific, and governance mandates for the African region.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- ─── NOT FOUND ─────────────────────────────────────────── -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center">
      <div class="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <p class="text-[11px] font-semibold text-green-600 tracking-widest uppercase mb-2">Not found</p>
      <h2 class="text-[24px] font-bold text-slate-800 mb-3">{{ t('Intelligence Link Severed') }}</h2>
      <p class="text-[14px] text-slate-400 max-w-xs leading-relaxed mb-8">{{ t('The requested file does not exist in our secure archives.') }}</p>
      <NuxtLink
        to="/board"
        class="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-green-800 text-white text-[14px] font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        {{ t('Return to Site') }}
      </NuxtLink>
    </div>

  </div>
</template>

<style scoped>
.font-body {
  font-family: 'DM Sans', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}
</style>