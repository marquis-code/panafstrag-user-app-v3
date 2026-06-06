<template>
  <div class="relative group inline-block">
    <button class="flex items-center gap-2 px-3 py-2 text-sm font-black text-black hover:text-black/50 transition-colors rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
      <span>{{ currentLanguageName }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    <div class="absolute right-0 top-full  w-40 bg-black text-white p-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
      <button 
        v-for="loc in locales" 
        :key="loc.code"
        @click="switchLanguage(loc.code)"
        class="w-full text-left px-4 py-3 text-sm font-black transition-colors border-b border-white/10 last:border-0 hover:pl-5"
        :class="{ 'text-[#2E7D32]': currentLocale === loc.code, 'text-gray-400 hover:text-white': currentLocale !== loc.code }"
      >
        {{ loc.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from '#imports';
import { refreshNuxtData } from '#imports';
import { useGlobalLoader, useLanguageSwitching } from '@/composables/useGlobalLoader';

const { locale, locales: i18nLocales, setLocale } = useI18n();

const locales = computed(() => i18nLocales.value || []);
const currentLocale = computed(() => locale.value);

const currentLanguageName = computed(() => {
  const loc = locales.value.find(l => l.code === currentLocale.value);
  return loc ? loc.name : 'English';
});

const switchLanguage = async (code) => {
  if (currentLocale.value === code) return;
  const isLoading = useGlobalLoader();
  const isLanguageSwitching = useLanguageSwitching();

  // Lock loader — prevents loading-watcher from auto-dismissing
  isLanguageSwitching.value = true;
  isLoading.value = true;

  try {
    // Set locale state + localStorage
    locale.value = code;
    localStorage.setItem('app-lang', code);

    // Await ALL useAsyncData composables to fully re-fetch translated data
    // refreshNuxtData() returns a Promise that resolves ONLY when every
    // useAsyncData watcher has completed its fetch cycle end-to-end
    await refreshNuxtData();

    // Small buffer to let Vue re-render the DOM with new translated content
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (err) {
    console.error('Language switch failed:', err);
  } finally {
    isLoading.value = false;
    isLanguageSwitching.value = false;
  }
};
</script>
