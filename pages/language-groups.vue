<script setup lang="ts">
import { useFetchLanguageGroups } from '@/composables/modules/languageGroups/useFetchLanguageGroups'
const { fetchLanguageGroups, languageGroups, loading: pending } = useFetchLanguageGroups()

useHead({
  title: 'Language Groups | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-16 px-6 lg:px-0 pt-16 container mx-auto pb-32">
    <div class="max-w-3xl mx-auto text-center mb-24 animate-fade-in-up">
      <h1 class="text-4xl lg:text-5xl font-black mb-6 tracking-tighter uppercase italic">Language <span class="not-italic text-gray-400">Groups.</span></h1>
      <p class="text-gray-500 text-lg font-medium leading-relaxed">
        PANAFSTRAG Language Groups bring together Africana people sharing common official languages or mother tongues to foster collaboration without linguistic obstacles.
      </p>
    </div>

    <div v-if="pending">
      <LoadingState />
    </div>

    <div v-else-if="languageGroups?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      <div v-for="(group, i) in (languageGroups as any[])" :key="group._id"
        class="flex flex-col group glass-card overflow-hidden animate-fade-in-up"
        :class="`delay-${(i % 3 + 1) * 100}`">
        <div class="p-10 flex-1 space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-black text-white flex items-center justify-center font-black italic rounded">
               {{ group.name.charAt(0) }}
            </div>
            <h3 class="text-2xl font-black tracking-tighter uppercase group-hover:text-gray-500 transition-colors leading-tight italic">{{ group.name }}</h3>
          </div>
          <p class="text-gray-500 text-sm font-medium leading-relaxed">
            {{ group.description }}
          </p>
          <div v-if="group.url" class="pt-4">
             <a :href="group.url" target="_blank" class="text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-black inline-block pb-1 hover:border-gray-300 transition-all">Visit Platform →</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState
        title="NO GROUPS"
        message="The linguistic collaboration network is currently being restructured."
      />
    </div>

    <div class="max-w-4xl mx-auto mt-32 space-y-12 bg-gray-50 p-12 rounded-2xl border border-gray-100">
      <div class="grid md:grid-cols-2 gap-12">
        <div>
          <h3 class="text-xl font-black uppercase italic mb-4">Function</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            The Group provides a platform for easy production of knowledge and ideas without language obstacles. It provides a common linguistic, Ourstory, economic, social and cultural platform for Africana people in all official languages.
          </p>
        </div>
        <div>
          <h3 class="text-xl font-black uppercase italic mb-4">Membership</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Co-Leaders of each Group forward nominees with C.Vs to the Board for ratification. It is open to volunteers ready to offer actionable thoughts and work within PANAFSTRAG Cells.
          </p>
        </div>
        <div>
          <h3 class="text-xl font-black uppercase italic mb-4">Leadership</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            Co-Leaders (1 man & 1 woman) are appointed from the Board, with one from the Continent and the other from the 6th Region. They represent each Group on the Board.
          </p>
        </div>
        <div>
          <h3 class="text-xl font-black uppercase italic mb-4">Fees</h3>
          <p class="text-gray-600 text-sm leading-relaxed">
            No fees are payable but donations for projects and activities of the Cells are encouraged. Language Groups organize activities through the Cells.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
