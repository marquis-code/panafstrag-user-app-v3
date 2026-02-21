<script setup lang="ts">
import { useFetchBoard } from '@/composables/modules/board/useFetchBoard'
const { boardMembers: members, loading: pending } = useFetchBoard()

useHead({
  title: 'The Board | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-16 pb-32">
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
      <div v-for="(member, i) in (members as any[])" :key="member._id"
        class="glass-card group animate-fade-in-up"
        :class="`delay-${(i % 3 + 1) * 100}`">
        <div class="aspect-square rounded-xl bg-gray-50 mb-8 overflow-hidden relative border border-gray-100 shadow-inner">
          <img v-if="member.imageUrl" :src="member.imageUrl" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
          <div v-else class="w-full h-full flex items-center justify-center text-4xl font-black text-gray-200 italic">
            {{ member.name.charAt(0) }}
          </div>
        </div>
        <h3 class="text-2xl font-black mb-2 tracking-tighter uppercase group-hover:text-gray-500 transition-colors leading-tight italic">{{ member.name }}</h3>
        <p class="text-gray-400 font-black mb-6 text-[10px] uppercase tracking-[0.2em]">{{ member.role }}</p>
        <p class="text-gray-500 text-sm font-medium leading-relaxed mb-10 line-clamp-3">
          {{ member.bio }}
        </p>
        <div v-if="member.duties?.length" class="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
          <span v-for="duty in member.duties" :key="duty" class="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-500">
            {{ duty }}
          </span>
        </div>
      </div>
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
