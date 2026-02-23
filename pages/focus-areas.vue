<script setup lang="ts">
import { useFetchFocusAreas } from '@/composables/modules/focusAreas/useFetchFocusAreas'
const { fetchFocusAreas, focusAreas, loading: pending } = useFetchFocusAreas()

useHead({
  title: 'Focus Areas | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-8 md:space-y-16 px-6 lg:px-0 pt-8 md:pt-16 container mx-auto pb-32">
    <div class="max-w-3xl mx-auto text-center mb-12 md:mb-24 animate-fade-in-up">
      <h1 class="text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tighter uppercase italic">Focus <span class="not-italic text-gray-400">Areas.</span></h1>
      <p class="text-gray-500 text-base md:text-lg font-medium leading-relaxed">
        PANAFSTRAG focus areas for studies and research with actionable Policy Briefs and Recommendations.
      </p>
    </div>

    <div v-if="pending">
      <LoadingState />
    </div>

    <div v-else-if="focusAreas?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      <div v-for="(area, i) in (focusAreas as any[])" :key="area._id"
        class="p-6 md:p-10 glass-card group animate-fade-in-up flex items-start gap-4 md:gap-8"
        :class="`delay-${(i % 2 + 1) * 100}`">
        <div class="text-3xl md:text-4xl font-black text-gray-200 tabular-nums italic shrink-0">
          0{{ i + 1 }}
        </div>
        <div>
          <h3 class="text-xl md:text-2xl font-black tracking-tighter uppercase group-hover:text-gray-500 transition-colors leading-tight italic mb-3 md:mb-4">{{ area.name }}</h3>
          <p v-if="area.description" class="text-gray-500 text-xs md:text-sm font-medium leading-relaxed">
            {{ area.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState
        title="NO FOCUS AREAS"
        message="Research priorities are currently being updated."
      />
    </div>
  </div>
</template>
