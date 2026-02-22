<script setup lang="ts">
import { useFetchOrganogram } from '@/composables/modules/organogram/useFetchOrganogram'

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
  <div class="min-h-screen px-6 lg:px-0 bg-[#FDFDFD] pb-32">
    <!-- Header -->
    <section class="pt-24 pb-16 border-b border-gray-100 bg-white">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-4xl mx-auto">
          <span class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 block">Institutional Structure</span>
          <h1 class="text-[5vw] lg:text-7xl font-black tracking-tighter uppercase italic leading-none">
            ORGANO<span class="not-italic text-gray-400">GRAM.</span>
          </h1>
        </div>
      </div>
    </section>

    <!-- Organogram Tree -->
    <div class="container mx-auto px-6 py-20 overflow-x-auto">
      <div v-if="pending" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-[#42A5F5] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else class="min-w-[1200px] flex flex-col items-center relative">

        <!-- Tier 1: Governance -->
        <div v-for="node in tier1" :key="node._id" class="flex flex-col items-center w-full relative">
          <div class="node-governance p-8 text-center min-w-[400px] shadow-2xl relative z-20 animate-fade-in-up">
            <h2 class="text-xl font-black uppercase tracking-tight mb-2">{{ node.title }}</h2>
            <p class="text-[11px] font-bold leading-relaxed whitespace-pre-line opacity-80">{{ node.description }}</p>
          </div>

          <!-- Vertical Line connecting T1 to T2 -->
          <div class="w-[2px] h-12 bg-black"></div>

          <!-- Tier 2: Secretariat -->
          <div v-for="sec in tier2" :key="sec._id" class="flex flex-col items-center w-full relative">
            <div class="node-secretariat p-6 text-left min-w-[300px] shadow-xl relative z-20 animate-fade-in-up delay-100">
              <h3 class="text-lg font-black uppercase tracking-tight mb-2">{{ sec.title }}:</h3>
              <p class="text-[11px] font-bold leading-relaxed whitespace-pre-line opacity-90">{{ sec.description }}</p>
            </div>

            <!-- Vertical Line connecting T2 to Horizontal branch -->
            <div class="w-[2px] h-12 bg-black"></div>

            <!-- Horizontal Branching Line Container -->
            <div class="relative w-full flex flex-col items-center">
              <!-- The horizontal connector bar -->
              <div class="h-[2px] bg-black absolute top-0 w-[60%] left-1/2 -translate-x-1/2"></div>

              <!-- Tier 3: Hubs -->
              <div class="flex justify-between w-[60%] relative mt-0">
                <div v-for="(hub, hIndex) in tier3" :key="hub._id" class="flex flex-col items-center flex-1 relative">
                   <!-- Dropdown vertical line from horizontal bar to Hub -->
                   <div class="w-[2px] h-12 bg-black"></div>

                   <div class="node-hub px-8 py-4 shadow-lg mb-12 animate-fade-in-up" :style="{ animationDelay: `${200 + hIndex * 100}ms` }">
                     <h4 class="text-sm font-black tracking-[0.2em] uppercase">{{ hub.title }}</h4>
                   </div>

                   <!-- Horizontal Branching for Leaf Nodes -->
                   <div class="relative w-full flex flex-col items-center">
                      <!-- Horizontal bar for children -->
                      <div class="h-[2px] bg-black absolute top-0 w-full"></div>

                      <!-- Tier 4: Leaf Nodes Grid -->
                      <div class="flex flex-wrap justify-center gap-4 pt-12">
                        <div v-for="leaf in getNodesByParent(hub._id)" :key="leaf._id"
                          class="node-leaf p-4 text-center shadow-md animate-fade-in-up hover:scale-105 transition-transform border border-black/10"
                        >
                          <span class="text-[10px] font-black leading-tight uppercase line-clamp-4">{{ leaf.title }}</span>
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

    <!-- Notes Section -->
    <section class="container mx-auto px-6 mt-32 animate-fade-in-up delay-500">
      <div class="max-w-6xl mx-auto bg-[#FFFFE0] border border-gray-200 p-12 font-bold text-[11px] text-gray-800 leading-relaxed shadow-sm">
        <h4 class="uppercase tracking-widest text-xs mb-8">NOTES:</h4>
        <div class="space-y-6">
          <p>1. AFRICANA The definition of Africana (Global African) Studies, according to Penn State University, USA, is a multi-disciplinary field of study which rigorously examines:</p>
          <div class="space-y-4">
            <p>• The historical, cultural, economic, scientific, and religious networks of the African Continent.</p>
            <p>• The dispersal of Africans across the Atlantic to Europe, North America, Latin America and the Caribbean; the dispersal of Africans across the Mediterranean Red Sea to the Middle East, the movement of Africans across the Sahara Dessert to North Africa and beyond and the movement of Africans across the Indian Ocean to Asia.</p>
            <p>• The expansion of Trade between Africa and Europe, North and South America, Middle East and Asia. (https://africana.sas.upenn.edu/department)</p>
          </div>
          <div class="space-y-4 pt-4">
            <p>- EACH CELL CAN BE BROKEN INTO SUB-CELLS IF NECESSARY, ACCORDING TO EXPERTISE & SKILLS</p>
            <p>- ALL CELLS TO PLEASE HAVE LANGUAGE REPRESENTATION</p>
            <p>- CO-LEADERS ARE VOLUNTARY COORDINATORS OF CELLS & GROUPS TO BE PROPOSED TO THE BOARD FOR APPROVAL.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.node-governance {
  @apply bg-[#E1E2FF] border border-black/20;
}

.node-secretariat {
  @apply bg-[#42A5F5] text-white border border-black/20;
}

.node-hub {
  @apply bg-[#42A5F5] text-white border border-black/20 min-w-[200px] text-center;
}

.node-leaf {
  @apply bg-[#42A5F5] text-white flex items-center justify-center min-h-[100px] w-[150px] border border-black/20;
}

/* Connectors using absolute positioning for better control than after/before in some cases */
.vertical-line {
  @apply w-[2px] bg-black;
}

/* Stagger animations */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-500 { animation-delay: 500ms; }

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
