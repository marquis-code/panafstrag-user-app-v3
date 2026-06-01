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
  <div class="container px-6 lg:px-0 mx-auto">
    <!-- Page Hero -->
    <section class="border-b pt-8 md:pt-16 border-gray-100 py-12 md:py-24">
      <div class="max-w-4xl">
        <p class="text-sm md:text-sm font-black text-gray-400 mb-4 md:mb-6">Contact</p>
        <h1 class="text-4xl md:text-8xl font-black leading-none mb-6 md:mb-8" v-html="homeContent?.contactPageTitle || 'Get In<br /><span class=\'text-gray-300\'>Touch</span>'">
        </h1>
        <p class="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed" v-html="homeContent?.contactPageDescription || 'Reach out to PANAFSTRAG for research inquiries, partnership opportunities, or media requests.'">
        </p>
      </div>
    </section>

    <!-- Contact Grid -->
    <section class="py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 border-b border-gray-100">
      <!-- Contact Form -->
      <div class="md:border-r border-gray-100 md:pr-16">
        <p class="text-sm md:text-sm font-black text-gray-400 mb-8 md:mb-12">{{ t('Send a message') }}</p>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 md:gap-8">
          <div class="flex flex-col gap-2">
            <label class="text-sm md:text-sm font-black text-gray-400">{{ t('Full name') }}</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Your full name"
              class="border-b border-gray-200 py-3 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm md:text-sm font-black text-gray-400">{{ t('Email address') }}</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="your@email.com"
              class="border-b border-gray-200 py-3 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm md:text-sm font-black text-gray-400">{{ t('Subject') }}</label>
            <select
              v-model="form.subject"
              required
              class="border-b border-gray-200 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-black transition-colors bg-transparent appearance-none cursor-pointer"
            >
              <option value="" disabled selected class="text-gray-300">{{ t('Select a subject') }}</option>
              <option value="research">{{ t('Research inquiry') }}</option>
              <option value="partnership">{{ t('Partnership') }}</option>
              <option value="media">{{ t('Media request') }}</option>
              <option value="general">{{ t('General inquiry') }}</option>
            </select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm md:text-sm font-black text-gray-400">{{ t('Message') }}</label>
            <textarea
              v-model="form.message"
              required
              rows="5"
              placeholder="Your message..."
              class="border-b border-gray-200 py-3 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent resize-none"
            />
          </div>

          <!-- Success Message -->
          <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0">
            <p v-if="submitted" class="text-sm font-black text-green-600">
              ✓ {{ t('Message sent successfully.') }}
            </p>
          </Transition>

          <button
            type="submit"
            :disabled="loading"
            class="self-start bg-black text-white text-sm md:text-sm font-black px-8 md:px-10 py-3 md:py-4 hover:bg-gray-800 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {{ loading ? t('Sending...') : t('Send message') }}
          </button>
        </form>
      </div>

      <!-- Contact Info -->
      <div class="md:pl-16 flex flex-col gap-12 md:gap-16">
        <div>
          <p class="text-sm md:text-sm font-black text-gray-400 mb-6 md:mb-8">{{ t('Direct contact') }}</p>
          <div class="flex flex-col gap-6">
            <div>
              <p class="text-sm md:text-sm font-black text-gray-400 mb-2">{{ t('Email') }}</p>
              <div v-if="Array.isArray(homeContent?.contactEmail) && homeContent.contactEmail.length > 0" class="flex flex-col gap-1">
                <a v-for="email in homeContent.contactEmail" :key="email" :href="`mailto:${email}`" class="text-sm md:text-sm font-bold hover:text-gray-400 transition-colors">
                  {{ email }}
                </a>
              </div>
              <a v-else-if="typeof homeContent?.contactEmail === 'string' && homeContent?.contactEmail" :href="`mailto:${homeContent.contactEmail}`" class="text-sm md:text-sm font-bold hover:text-gray-400 transition-colors">
                 {{ homeContent.contactEmail }}
              </a>
              <a v-else href="mailto:info@panafstrag.org" class="text-sm md:text-sm font-bold hover:text-gray-400 transition-colors">
                 info@panafstrag.org
              </a>
            </div>
            <div>
              <p class="text-sm md:text-sm font-black text-gray-400 mb-2">{{ t('Phone') }}</p>
              <div v-if="Array.isArray(homeContent?.contactPhone) && homeContent.contactPhone.length > 0" class="flex flex-col gap-1">
                 <a v-for="phone in homeContent.contactPhone" :key="phone" :href="`tel:${phone.replace(/\\s/g, '')}`" class="text-sm md:text-sm font-bold hover:text-gray-400 transition-colors">
                  {{ phone }}
                 </a>
              </div>
              <a v-else-if="typeof homeContent?.contactPhone === 'string' && homeContent?.contactPhone" :href="`tel:${homeContent.contactPhone.replace(/\\s/g, '')}`" class="text-sm md:text-sm font-bold hover:text-gray-400 transition-colors">
                {{ homeContent.contactPhone }}
              </a>
              <a v-else href="tel:+23300000000" class="text-sm md:text-sm font-bold hover:text-gray-400 transition-colors">
                +233 00 000 0000
              </a>
            </div>
          </div>
        </div>

        <div>
          <p class="text-sm md:text-sm font-black text-gray-400 mb-6 md:mb-8">{{ t('Location') }}</p>
          <address class=" text-sm md:text-sm font-bold leading-relaxed text-gray-700 whitespace-pre-line" v-html="homeContent?.contactAddress || 'PANAFSTRAG Secretariat<br />Accra, Ghana<br />West Africa'"></address>
        </div>

        <!-- <div>
          <p class="text-sm md:text-sm font-black text-gray-400 mb-6 md:mb-8">Office Hours</p>
          <div class="flex flex-col gap-3 text-sm md:text-sm">
            <div class="flex justify-between border-b border-gray-100 pb-3">
              <span class="font-black text-sm md:text-sm">Mon – Fri</span>
              <span class="font-bold text-gray-500">{{ homeContent?.contactOfficeHoursMonFri || '8:00 AM – 5:00 PM' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-100 pb-3">
              <span class="font-black text-sm md:text-sm">Saturday</span>
              <span class="font-bold text-gray-500">{{ homeContent?.contactOfficeHoursSat || '9:00 AM – 1:00 PM' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-100 pb-3">
              <span class="font-black text-sm md:text-sm">Sunday</span>
              <span class="font-bold text-gray-500">{{ homeContent?.contactOfficeHoursSun || 'Closed' }}</span>
            </div>
          </div>
        </div> -->

        <div v-if="homeContent?.contactSocialLinks?.length">
          <p class="text-sm md:text-sm font-black text-gray-400 mb-6 md:mb-8">{{ t('Connect') }}</p>
          <div class="flex flex-wrap gap-4">
            <a v-for="link in homeContent.contactSocialLinks" :key="link.platform" :href="link.url" target="_blank" class="px-4 py-2 border border-gray-200 text-sm font-black hover:bg-black hover:text-white transition-all rounded-full">
              {{ link.platform }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

