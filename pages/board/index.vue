<script setup lang="ts">
import { useFetchBoard } from '@/composables/modules/board/useFetchBoard'
const { boardMembers: members, loading: pending } = useFetchBoard()

useHead({
  title: 'The Board | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-16 pt-16 container px-6 lg:px-0 mx-auto pb-32">
    <div class="max-w-3xl mx-auto text-center mb-20 animate-fade-in-up">
      <h1 class="text-4xl lg:text-5xl font-black mb-6 tracking-tighter uppercase italic">Board of <span class="not-italic text-gray-400">Trustees.</span></h1>
      <p class="text-gray-500 text-lg font-medium leading-relaxed">
        Our board members are distinguished professionals and scholars dedicated to African development and strategic policy research.
      </p>
    </div>

    <div v-if="pending">
      <LoadingState />
    </div>

    <div v-else-if="members?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      <NuxtLink v-for="(member, i) in (members as any[])" :key="member._id"
        :to="`/board/${member._id}`"
        class="glass-card group animate-fade-in-up block hover:scale-[1.02] transition-transform duration-500"
        :class="`delay-${(i % 3 + 1) * 100}`">
        <div class="aspect-square rounded-xl bg-gray-50 mb-8 overflow-hidden relative border border-gray-100 shadow-inner">
          <img v-if="member.avatar" :src="member.avatar" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
          <div v-else class="w-full h-full flex items-center justify-center text-4xl font-black text-gray-200 italic">
            {{ member.name.charAt(0) }}
          </div>
        </div>
        <h3 class="text-2xl font-black mb-2 tracking-tighter uppercase group-hover:text-gray-500 transition-colors leading-tight italic">{{ member.name }}</h3>
        <p class="text-gray-400 font-black mb-1 text-[10px] uppercase tracking-[0.2em]">{{ member.position }}</p>
        <p v-if="member.university" class="text-gray-400 font-medium mb-6 text-[9px] uppercase tracking-widest">{{ member.university }}</p>

        <p class="text-gray-500 text-sm font-medium leading-relaxed mb-10 line-clamp-3">
          {{ member.bio }}
        </p>

        <div class="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
          <span class="text-[9px] font-black uppercase tracking-[0.3em] text-black">View Profile —></span>
          <div class="flex gap-2" v-if="member.duties?.length">
            <div v-for="n in Math.min(member.duties.length, 3)" :key="n" class="w-1.5 h-1.5 rounded-full bg-gray-100 group-hover:bg-black transition-colors"></div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState
        title="BOARD VACANT"
        message="The Board of Trustees registration for this term is currently being finalized."
      />
    </div>
  </div>
</template>
  