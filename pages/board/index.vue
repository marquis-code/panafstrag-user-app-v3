<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useFetchBoard } from '@/composables/modules/board/useFetchBoard'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'

const { t } = useI18n()
const { boardMembers: members, loading: pending } = useFetchBoard()
const { homeContent } = useHomeContent()

useHead({
  title: 'Ubuntu Team | PANAFSTRAG',
})
</script>

<template>
  <div class="min-h-screen bg-white font-body">

    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <section class="bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pb-20">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-green-50 text-[#2E7D32] text-xs font-semibold px-4 py-2 rounded-full mb-7 border border-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Leadership Council
          </div>
          <h1
            class="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
            v-html="homeContent?.boardPageTitle || t('Board_Of_Trustees_HTML')"
          ></h1>
          <p
            class="text-[16px] text-slate-500 leading-relaxed max-w-[580px]"
            v-html="homeContent?.boardPageDescription || t('Board_Description')"
          ></p>
        </div>
      </div>
    </section>

    <!-- ─── BOARD GRID ────────────────────────────────────────── -->
    <section class="bg-slate-50 border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">

        <!-- Skeleton loading -->
        <div v-if="pending" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="i in 6"
            :key="i"
            class="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse h-[480px]"
          ></div>
        </div>

        <!-- Board members grid -->
        <div v-else-if="members?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="(member, i) in (members as any[])"
            :key="member?._id"
            :to="`/board/${member?._id}`"
            class="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-md transition-all duration-300 flex flex-col"
          >
            <!-- Avatar -->
            <div class="relative overflow-hidden bg-slate-100 aspect-[4/3]">
              <img
                v-if="member?.avatar"
                :src="member.avatar"
                class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                :alt="member?.name"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-5xl font-black text-slate-200"
              >
                {{ member?.name?.charAt(0) || 'B' }}
              </div>

              <!-- Duties badge -->
              <div
                v-if="member?.duties?.length"
                class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-slate-200 text-[11px] font-semibold text-[#2E7D32] px-3 py-1 rounded-full"
              >
                {{ member.duties.length }} {{ member.duties.length === 1 ? 'role' : 'roles' }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 flex flex-col flex-1">
              <div class="mb-4">
                <p class="text-[11px] font-semibold text-green-600 tracking-widest uppercase mb-1">
                  {{ member?.position }}
                </p>
                <h3 class="text-[18px] font-bold text-slate-800 leading-snug group-hover:text-[#2E7D32] transition-colors duration-200">
                  {{ member?.name }}
                </h3>
                <p v-if="member?.university" class="text-[12px] text-slate-400 font-medium mt-1">
                  {{ member?.university }}
                </p>
              </div>

              <p class="text-[13px] text-slate-500 leading-relaxed line-clamp-3 flex-1 mb-6">
                {{ member?.bio }}
              </p>

              <!-- Footer -->
              <div class="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                <span class="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#2E7D32]">
                  {{ t('View_Profile') }}
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
                <div class="flex gap-1.5" v-if="member?.duties?.length">
                  <div
                    v-for="n in Math.min(member?.duties?.length || 0, 3)"
                    :key="n"
                    class="w-2 h-2 rounded-full bg-slate-100 group-hover:bg-[#2E7D32] transition-colors duration-300"
                    :style="{ transitionDelay: `${n * 60}ms` }"
                  ></div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Empty state -->
        <div v-else class="flex flex-col items-center justify-center py-24 text-center">
          <div class="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <p class="text-[11px] font-semibold text-green-600 tracking-widest uppercase mb-2">No members yet</p>
          <h3 class="text-[20px] font-bold text-slate-800 mb-2">{{ t('BOARD_VACANT') }}</h3>
          <p class="text-[14px] text-slate-400 max-w-xs leading-relaxed">{{ t('BOARD_VACANT_MSG') }}</p>
        </div>

      </div>
    </section>

  </div>
</template>

<style scoped>
.font-body {
  font-family: 'DM Sans', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
}
</style>