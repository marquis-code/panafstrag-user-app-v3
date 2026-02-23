<template>
  <div class="relative inline-block w-full" ref="dropdownRef">
    <!-- Trigger -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="w-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl text-left flex items-center justify-between group hover:bg-white/20 transition-all duration-300 shadow-sm"
      :class="{ 'ring-2 ring-[#25d366]/50 border-[#25d366]/50': isOpen }"
    >
      <span :class="['text-sm font-medium transition-colors', modelValue ? 'text-gray-900' : 'text-gray-400']">
        {{ selectedLabel || placeholder }}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-400 group-hover:text-[#25d366] transition-all duration-300"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Content -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-[100] mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden py-1 max-h-60 overflow-y-auto custom-scrollbar"
      >
        <div v-if="options.length === 0" class="px-4 py-3 text-xs text-gray-400 italic">
          No options available
        </div>
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          @click="selectOption(option)"
          class="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 flex items-center justify-between group transition-colors"
          :class="{ 'bg-green-50/50 text-[#25d366] font-bold': modelValue === option.value }"
        >
          <span>{{ option.label }}</span>
          <svg
            v-if="modelValue === option.value"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-[#25d366]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string;
  value: string | number;
}

const props = defineProps<{
  options: Option[];
  modelValue: string | number | null;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue);
  return selected ? selected.label : null;
});

const selectOption = (option: Option) => {
  emit('update:modelValue', option.value);
  emit('change', option.value);
  isOpen.value = false;
};

// Close on outside click
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      isOpen.value = false;
    }
  };
  window.addEventListener('click', handleClickOutside);
  onUnmounted(() => window.removeEventListener('click', handleClickOutside));
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,0.1);
}
</style>
