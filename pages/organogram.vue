<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
import { useFetchOrganogram } from '@/composables/modules/organogram/useFetchOrganogram'

const { homeContent } = useHomeContent()
const { organogramNodes, loading: pending } = useFetchOrganogram()

const tier1 = computed(() => (organogramNodes.value as any[]).filter(n => n.level === 1))
const tier2 = computed(() => (organogramNodes.value as any[]).filter(n => n.level === 2))
const tier3 = computed(() => (organogramNodes.value as any[]).filter(n => n.level === 3))
const tier4 = computed(() => (organogramNodes.value as any[]).filter(n => n.level === 4))

const getNodesByParent = (parentId: string) => {
  return (organogramNodes.value as any[]).filter(n => n.parentId === parentId)
}

useHead({
  title: 'Institutional Organogram | PANAFSTRAG',
})
</script>

<template>
  <div class="min-h-screen bg-white font-body">

    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <section class="bg-white border-b border-slate-100">
      <div class="container px-6 lg:px-0 mx-auto pt-16 md:pt-28 pb-14 lg:pb-20">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-green-50 text-[#2E7D32] text-xs font-semibold px-4 py-2 rounded-full mb-7 border border-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            {{ t('Institutional Structure') }}
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
            v-html="homeContent?.organogramPageTitle
              ? t(homeContent.organogramPageTitle)
              : t('Institutional') + ' <span class=\'text-[#2E7D32]\'>' + t('Organogram') + '</span>'"
          />
          <p class="text-[16px] text-slate-500 leading-relaxed max-w-[540px]">
            {{ t('A structured view of PANAFSTRAG\'s governance, leadership, and operational hierarchy across all tiers.') }}
          </p>
        </div>
      </div>
    </section>


    <!-- ─── TIER LEGEND STRIP ─────────────────────────────────── -->
    <section class="bg-slate-50 border-b border-slate-100">
      <div class="container px-6 lg:px-0 mx-auto py-8">
        <div class="flex flex-wrap gap-3 items-center">
          <span class="text-[11px] font-semibold text-slate-400 tracking-widest uppercase mr-2">{{ t('Legend') }}</span>
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] text-[12px] font-semibold rounded-full">
            <span class="w-2 h-2 rounded-full bg-[#2E7D32]/40 inline-block"></span>
            {{ t('Governance') }}
          </span>
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white text-[12px] font-semibold rounded-full">
            <span class="w-2 h-2 rounded-full bg-white/50 inline-block"></span>
            {{ t('Secretariat') }}
          </span>
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-[#2E7D32]/80 text-white text-[12px] font-semibold rounded-full">
            <span class="w-2 h-2 rounded-full bg-white/50 inline-block"></span>
            {{ t('Hubs') }}
          </span>
          <span class="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white text-[12px] font-semibold rounded-full">
            <span class="w-2 h-2 rounded-full bg-white/40 inline-block"></span>
            {{ t('Units') }}
          </span>
        </div>
      </div>
    </section>


    <!-- ─── ORGANOGRAM TREE ───────────────────────────────────── -->
    <section class="bg-white border-b border-slate-100">
      <div class="container px-6 lg:px-0 mx-auto py-16 lg:py-20">

        <!-- Loading -->
        <div v-if="pending" class="flex flex-col items-center justify-center py-24 gap-4">
          <div class="w-10 h-10 border-[3px] border-green-100 border-t-[#2E7D32] rounded-full animate-spin"></div>
          <p class="text-[13px] font-semibold text-slate-400">{{ t('Loading organogram...') }}</p>
        </div>

        <!-- Tree -->
        <div v-else class="overflow-x-auto">
          <div class="min-w-[1100px] flex flex-col items-center relative pb-16">

            <div v-for="node in tier1" :key="node._id" class="flex flex-col items-center w-full animate-fade-in-up">

              <!-- ── Tier 1: Governance ── -->
              <div class="node-governance rounded-2xl px-10 py-8 text-center max-w-[480px] w-full relative z-20">
                <div class="inline-flex items-center gap-2 bg-[#2E7D32]/10 text-[#2E7D32] text-[10px] font-semibold px-3 py-1 rounded-full mb-4 tracking-widest uppercase border border-[#2E7D32]/15">
                  {{ t('Tier 1 — Governance') }}
                </div>
                <h2 class="text-[18px] font-bold text-[#1b5e20] mb-2 leading-snug">{{ node?.title }}</h2>
                <p class="text-[13px] font-medium text-[#2E7D32]/80 leading-relaxed whitespace-pre-line" v-html="node?.description" />
              </div>

              <!-- Connector T1 → T2 -->
              <div class="flex flex-col items-center py-1">
                <div class="w-px h-10 bg-slate-300"></div>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M6 8L0 0h12L6 8z" fill="#94a3b8"/></svg>
              </div>

              <!-- ── Tier 2: Secretariat ── -->
              <div v-for="sec in tier2" :key="sec._id" class="flex flex-col items-center w-full animate-fade-in-up delay-100">

                <div class="node-secretariat rounded-2xl px-8 py-6 text-left max-w-[420px] w-full relative z-20">
                  <div class="inline-flex items-center gap-2 bg-white/15 text-white/70 text-[10px] font-semibold px-3 py-1 rounded-full mb-4 tracking-widest uppercase border border-white/20">
                    {{ t('Tier 2 — Secretariat') }}
                  </div>
                  <h3 class="text-[16px] font-bold text-white mb-2 leading-snug">{{ sec?.title }}</h3>
                  <p class="text-[13px] font-medium text-green-100 leading-relaxed whitespace-pre-line" v-html="sec?.description" />
                </div>

                <!-- Connector T2 → T3 horizontal branch -->
                <div class="flex flex-col items-center py-1">
                  <div class="w-px h-10 bg-slate-300"></div>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M6 8L0 0h12L6 8z" fill="#94a3b8"/></svg>
                </div>

                <!-- ── Tier 3 + Tier 4 ── -->
                <div class="relative w-full flex flex-col items-center">

                  <!-- Horizontal bar spanning tier-3 nodes -->
                  <div class="h-px bg-slate-200 absolute top-0 w-[72%] left-1/2 -translate-x-1/2 z-0"></div>

                  <div class="flex justify-between w-[72%] relative mt-0 gap-4">
                    <div
                      v-for="(hub, hIndex) in tier3"
                      :key="hub._id"
                      class="flex flex-col items-center flex-1 animate-fade-in-up"
                      :style="{ animationDelay: `${200 + hIndex * 80}ms` }"
                    >

                      <!-- Drop from horizontal bar to hub -->
                      <div class="flex flex-col items-center">
                        <div class="w-px h-10 bg-slate-200"></div>
                        <svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M5 7L0 0h10L5 7z" fill="#94a3b8"/></svg>
                      </div>

                      <!-- Hub card -->
                      <div class="node-hub rounded-xl px-5 py-4 text-center w-full mb-8 relative z-10">
                        <div class="text-[10px] font-semibold text-white/60 tracking-widest uppercase mb-1">{{ t('Hub') }}</div>
                        <h4 class="text-[13px] font-bold text-white leading-snug">{{ hub?.title }}</h4>
                      </div>

                      <!-- Leaf connector horizontal bar -->
                      <div class="relative w-full flex flex-col items-center">
                        <div v-if="getNodesByParent(hub._id).length > 1" class="h-px bg-slate-200 absolute top-0 w-full z-0"></div>

                        <!-- Tier 4: Leaf nodes -->
                        <div class="flex flex-wrap justify-center gap-3 pt-0">
                          <div
                            v-for="leaf in getNodesByParent(hub._id)"
                            :key="leaf._id"
                            class="flex flex-col items-center animate-fade-in-up"
                          >
                            <!-- Drop to leaf -->
                            <div class="flex flex-col items-center">
                              <div class="w-px h-8 bg-slate-200"></div>
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M4 6L0 0h8L4 6z" fill="#94a3b8"/></svg>
                            </div>
                            <div class="node-leaf rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                              <span class="text-[12px] font-bold text-white leading-snug line-clamp-4 block">{{ leaf?.title }}</span>
                              <p v-if="leaf?.description" class="text-[11px] mt-2 text-white/70 leading-relaxed font-medium" v-html="leaf?.description" />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

  </div>
</template>


<style scoped>
.font-body {
  font-family: 'DM Sans', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}

/* ── Node styles ── */
.node-governance {
  @apply bg-[#E8F5E9] border border-[#2E7D32]/20;
}

.node-secretariat {
  @apply bg-[#2E7D32] border border-black/10;
}

.node-hub {
  @apply bg-[#2E7D32]/85 border border-white/10 min-w-[160px];
}

.node-leaf {
  @apply bg-slate-700 border border-white/10 shadow-sm min-h-[90px] w-[140px] flex flex-col items-center justify-center;
}

/* ── Stagger delays ── */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-500 { animation-delay: 500ms; }

/* ── Fade-in animation ── */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>