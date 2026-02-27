import { ref, onMounted } from 'vue';
import { homeContentApiFactory } from "@/api_factory/modules/home-content";

const CACHE_KEY = 'panafstrag_home_content_cache';

/**
 * Reads cached homeContent from localStorage (sync, instant).
 * Returns null if nothing cached or if parsing fails.
 */
const readCache = (): any | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Writes homeContent data to localStorage for instant access on next load.
 */
const writeCache = (data: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — ignore silently
  }
};

export const useHomeContent = () => {
  const loading = ref(false);
  // AGGRESSIVE: immediately hydrate from localStorage cache so carousel images
  // are available on the very first render frame — no dark flash.
  const homeContent = ref<any>(readCache());
  const error = ref<string | null>(null);

  const fetchHomeContent = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await homeContentApiFactory.getHomeContent() as any;
      homeContent.value = res.data;
      // Persist to cache for next page load / refresh
      writeCache(res.data);
      return res;
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch home content';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchHomeContent();
  });

  return { fetchHomeContent, homeContent, loading, error };
};
