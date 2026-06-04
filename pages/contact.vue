<script setup lang="ts">
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useI18n } from '@/composables/useI18n'

const { homeContent } = useHomeContent()
const { showToast } = useCustomToast()
const { t } = useI18n()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const submitted = ref(false)

const config = useRuntimeConfig()
const handleSubmit = async () => {
  loading.value = true
  try {
    await $fetch(`${config.public.apiBase}/enquiries`, {
      method: 'POST',
      body: { ...form }
    })
    submitted.value = true
    Object.assign(form, { name: '', email: '', subject: '', message: '' })
    setTimeout(() => submitted.value = false, 5000)
  } catch (error) {
    showToast({
      title: "Error",
      message: "Failed to send message. Please try again later.",
      toastType: "error",
      duration: 3000,
    })
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Contact | PANAFSTRAG',
})
</script>

<template>
  <div class="min-h-screen bg-white font-body">

    <!-- ─── HERO ─────────────────────────────────────────────── -->
    <section class="bg-white border-b border-slate-100">
      <div class="container px-6 lg:px-0 mx-auto pt-16 md:pt-28 pb-14 lg:pb-20">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 bg-green-50 text-[#2E7D32] text-xs font-semibold px-4 py-2 rounded-full mb-7 border border-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {{ t('Get In Touch') }}
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
            {{ t('Connect With') }}
            <span class="text-[#2E7D32]"> PANAFSTRAG.</span>
          </h1>
          <p class="text-[16px] text-slate-500 leading-relaxed max-w-[540px]"
            v-html="homeContent?.contactPageDescription
              ? t(homeContent.contactPageDescription)
              : t('Reach out to PANAFSTRAG for research inquiries, partnership opportunities, or media requests.')">
          </p>
        </div>
      </div>
    </section>


    <!-- ─── CONTACT INFO STRIP ───────────────────────────────── -->
    <section class="bg-slate-50 border-b border-slate-100">
      <div class="container px-6 lg:px-0 mx-auto py-10">
        <div class="grid sm:grid-cols-3 gap-4">

          <!-- Email -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-green-200 hover:shadow-sm transition-all duration-300 flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-1">{{ t('Email') }}</p>
              <template v-if="Array.isArray(homeContent?.contactEmail) && homeContent.contactEmail.length > 0">
                <a v-for="email in homeContent.contactEmail" :key="email" :href="`mailto:${email}`" class="block text-[13px] font-medium text-slate-700 hover:text-[#2E7D32] transition-colors leading-relaxed">{{ email }}</a>
              </template>
              <a v-else-if="typeof homeContent?.contactEmail === 'string' && homeContent?.contactEmail" :href="`mailto:${homeContent.contactEmail}`" class="text-[13px] font-medium text-slate-700 hover:text-[#2E7D32] transition-colors">{{ homeContent.contactEmail }}</a>
              <a v-else href="mailto:info@panafstrag.org" class="text-[13px] font-medium text-slate-700 hover:text-[#2E7D32] transition-colors">info@panafstrag.org</a>
            </div>
          </div>

          <!-- Location -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-green-200 hover:shadow-sm transition-all duration-300 flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#065f46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-1">{{ t('Location') }}</p>
              <address
                class="text-[13px] font-medium text-slate-700 not-italic leading-relaxed"
                v-html="homeContent?.contactAddress || 'PANAFSTRAG Secretariat<br />Accra, Ghana<br />West Africa'"
              />
            </div>
          </div>

          <!-- Phone -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 hover:border-green-200 hover:shadow-sm transition-all duration-300 flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f766e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.41 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.88a16 16 0 0 0 6.29 6.29l1.46-1.46a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-1">{{ t('Phone') }}</p>
              <template v-if="Array.isArray(homeContent?.contactPhone) && homeContent.contactPhone.length > 0">
                <a v-for="phone in homeContent.contactPhone" :key="phone" :href="`tel:${phone.replace(/\s/g, '')}`" class="block text-[13px] font-medium text-slate-700 hover:text-[#2E7D32] transition-colors leading-relaxed">{{ phone }}</a>
              </template>
              <a v-else-if="typeof homeContent?.contactPhone === 'string' && homeContent?.contactPhone" :href="`tel:${homeContent.contactPhone.replace(/\s/g, '')}`" class="text-[13px] font-medium text-slate-700 hover:text-[#2E7D32] transition-colors">{{ homeContent.contactPhone }}</a>
              <a v-else href="tel:+23300000000" class="text-[13px] font-medium text-slate-700 hover:text-[#2E7D32] transition-colors">+233 00 000 0000</a>
            </div>
          </div>

        </div>
      </div>
    </section>


    <!-- ─── MAIN: FORM + SIDEBAR ─────────────────────────────── -->
    <section class="bg-white border-b border-slate-100">
      <div class="container px-6 lg:px-0 mx-auto py-16 lg:py-20">
        <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <!-- ── Left: Form card ── -->
          <div class="lg:col-span-7">
            <div class="bg-white border border-slate-200 rounded-2xl p-7 lg:p-10">

              <!-- Success state -->
              <Transition
                enter-active-class="transition duration-300"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
              >
                <div
                  v-if="submitted"
                  class="flex flex-col items-center justify-center text-center py-16"
                >
                  <div class="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-2">{{ t('Success') }}</p>
                  <h3 class="text-[22px] font-bold text-slate-800 mb-3 leading-snug">{{ t('Message received') }}</h3>
                  <p class="text-[14px] text-slate-400 max-w-xs mx-auto leading-relaxed mb-8">
                    {{ t('Your message has been submitted. A representative will be in touch shortly.') }}
                  </p>
                  <button
                    @click="submitted = false"
                    class="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-green-800 text-white text-[14px] font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
                  >
                    {{ t('Send another message') }}
                  </button>
                </div>
              </Transition>

              <template v-if="!submitted">
                <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-2">{{ t('Send a message') }}</p>
                <h2 class="text-[22px] font-bold text-slate-800 mb-8 leading-snug">{{ t('How can we help you?') }}</h2>

                <form @submit.prevent="handleSubmit" class="space-y-5">

                  <div class="grid sm:grid-cols-2 gap-5">
                    <div class="space-y-1.5">
                      <label class="text-[12px] font-semibold text-slate-500">{{ t('Full name') }}</label>
                      <input
                        v-model="form.name"
                        type="text"
                        :placeholder="t('Your full name')"
                        class="field"
                        required
                      />
                    </div>
                    <div class="space-y-1.5">
                      <label class="text-[12px] font-semibold text-slate-500">{{ t('Email address') }}</label>
                      <input
                        v-model="form.email"
                        type="email"
                        :placeholder="t('your@email.com')"
                        class="field"
                        required
                      />
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[12px] font-semibold text-slate-500">{{ t('Subject') }}</label>
                    <div class="relative">
                      <select
                        v-model="form.subject"
                        class="field appearance-none cursor-pointer pr-9"
                        required
                      >
                        <option value="" disabled selected>{{ t('Select a subject') }}</option>
                        <option value="research">{{ t('Research inquiry') }}</option>
                        <option value="partnership">{{ t('Partnership') }}</option>
                        <option value="media">{{ t('Media request') }}</option>
                        <option value="general">{{ t('General inquiry') }}</option>
                      </select>
                      <svg class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-[12px] font-semibold text-slate-500">{{ t('Message') }}</label>
                    <textarea
                      v-model="form.message"
                      rows="6"
                      :placeholder="t('Your message...')"
                      class="field resize-none leading-relaxed"
                      required
                    />
                  </div>

                  <div class="pt-2">
                    <button
                      type="submit"
                      :disabled="loading"
                      class="w-full inline-flex items-center justify-center gap-2 bg-[#2E7D32] hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200"
                    >
                      <div v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span v-if="loading">{{ t('Sending...') }}</span>
                      <span v-else class="flex items-center gap-2">
                        {{ t('Send message') }}
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </span>
                    </button>
                  </div>

                </form>
              </template>

            </div>
          </div>


          <!-- ── Right: Sidebar ── -->
          <div class="lg:col-span-5 space-y-5">

            <!-- Strategic note card -->
            <div class="bg-[#2E7D32] border border-green-800 rounded-2xl p-7 relative overflow-hidden">
              <svg class="absolute -right-5 -bottom-5 opacity-[0.06] text-white pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <p class="text-[11px] font-semibold text-green-300 tracking-widest uppercase mb-2">{{ t('Pan-African Research') }}</p>
              <h3 class="text-[18px] font-bold text-white mb-3 leading-snug">
                {{ t('Engage with our pan-African scientific network') }}
              </h3>
              <p class="text-[13px] text-green-200 leading-relaxed">
                {{ t('Connect with PANAFSTRAG for research collaborations, governance discussions, and strategic partnerships across Africa.') }}
              </p>
            </div>

            <!-- Direct Contact Details -->
            <div class="bg-white border border-slate-200 rounded-2xl p-7 hover:border-green-200 hover:shadow-sm transition-all duration-300">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.41 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.88a16 16 0 0 0 6.29 6.29l1.46-1.46a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase">{{ t('Direct contact') }}</p>
              </div>

              <div class="space-y-4">
                <div class="flex items-start justify-between py-3 border-b border-slate-100">
                  <span class="text-[13px] font-medium text-slate-500">{{ t('Email') }}</span>
                  <div class="text-right">
                    <template v-if="Array.isArray(homeContent?.contactEmail) && homeContent.contactEmail.length > 0">
                      <a v-for="email in homeContent.contactEmail" :key="email" :href="`mailto:${email}`" class="block text-[13px] font-semibold text-[#2E7D32] hover:underline leading-relaxed">{{ email }}</a>
                    </template>
                    <a v-else-if="typeof homeContent?.contactEmail === 'string' && homeContent?.contactEmail" :href="`mailto:${homeContent.contactEmail}`" class="text-[13px] font-semibold text-[#2E7D32] hover:underline">{{ homeContent.contactEmail }}</a>
                    <a v-else href="mailto:info@panafstrag.org" class="text-[13px] font-semibold text-[#2E7D32] hover:underline">info@panafstrag.org</a>
                  </div>
                </div>
                <div class="flex items-start justify-between py-3 border-b border-slate-100">
                  <span class="text-[13px] font-medium text-slate-500">{{ t('Phone') }}</span>
                  <div class="text-right">
                    <template v-if="Array.isArray(homeContent?.contactPhone) && homeContent.contactPhone.length > 0">
                      <a v-for="phone in homeContent.contactPhone" :key="phone" :href="`tel:${phone.replace(/\s/g, '')}`" class="block text-[13px] font-semibold text-slate-700 hover:text-[#2E7D32] transition-colors leading-relaxed">{{ phone }}</a>
                    </template>
                    <a v-else-if="typeof homeContent?.contactPhone === 'string' && homeContent?.contactPhone" :href="`tel:${homeContent.contactPhone.replace(/\s/g, '')}`" class="text-[13px] font-semibold text-slate-700 hover:text-[#2E7D32] transition-colors">{{ homeContent.contactPhone }}</a>
                    <a v-else href="tel:+23300000000" class="text-[13px] font-semibold text-slate-700">+233 00 000 0000</a>
                  </div>
                </div>
                <div class="flex items-start justify-between py-3">
                  <span class="text-[13px] font-medium text-slate-500">{{ t('Address') }}</span>
                  <address
                    class="text-[13px] font-semibold text-slate-700 not-italic text-right leading-relaxed"
                    v-html="homeContent?.contactAddress || 'PANAFSTRAG Secretariat<br />Accra, Ghana<br />West Africa'"
                  />
                </div>
              </div>
            </div>

            <!-- Social / Connect -->
            <div
              v-if="homeContent?.contactSocialLinks?.length"
              class="bg-white border border-slate-200 rounded-2xl p-7 hover:border-green-200 hover:shadow-sm transition-all duration-300 relative overflow-hidden"
            >
              <svg class="absolute -right-5 -bottom-5 opacity-[0.04] text-green-800 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              <p class="text-[11px] font-semibold text-[#2E7D32] tracking-widest uppercase mb-2">{{ t('Connect') }}</p>
              <h3 class="text-[17px] font-bold text-slate-800 mb-4 leading-snug">{{ t('Follow our work') }}</h3>
              <div class="flex flex-wrap gap-3">
                <a
                  v-for="link in homeContent.contactSocialLinks"
                  :key="link.platform"
                  :href="link.url"
                  target="_blank"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 text-[#2E7D32] text-[12px] font-semibold rounded-xl hover:bg-[#2E7D32] hover:text-white transition-all duration-200"
                >
                  {{ t(link.platform) }}
                </a>
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

.field {
  @apply w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 text-[14px] px-4 py-3 rounded-xl focus:outline-none focus:border-green-300 focus:bg-white focus:ring-2 focus:ring-green-50 transition-all duration-200;
}
</style>