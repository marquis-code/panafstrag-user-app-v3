<script setup lang="ts">
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'

const { homeContent } = useHomeContent()

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
    alert('Failed to send message. Please try again later.')
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
        <p class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 md:mb-6">Contact</p>
        <h1 class="text-4xl md:text-8xl font-black uppercase leading-none tracking-tight mb-6 md:mb-8" v-html="homeContent?.contactPageTitle || 'Get In<br /><span class=\'text-gray-300\'>Touch</span>'">
        </h1>
        <p class="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed" v-html="homeContent?.contactPageDescription || 'Reach out to PANAFSTRAG for research inquiries, partnership opportunities, or media requests.'">
        </p>
      </div>
    </section>

    <!-- Contact Grid -->
    <section class="py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 border-b border-gray-100">
      <!-- Contact Form -->
      <div class="md:border-r border-gray-100 md:pr-16">
        <p class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8 md:mb-12">Send a Message</p>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-6 md:gap-8">
          <div class="flex flex-col gap-2">
            <label class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Your full name"
              class="border-b border-gray-200 py-3 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="your@email.com"
              class="border-b border-gray-200 py-3 text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Subject</label>
            <select
              v-model="form.subject"
              required
              class="border-b border-gray-200 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-black transition-colors bg-transparent appearance-none cursor-pointer"
            >
              <option value="" disabled selected class="text-gray-300">Select a subject</option>
              <option value="research">Research Inquiry</option>
              <option value="partnership">Partnership</option>
              <option value="media">Media Request</option>
              <option value="general">General Inquiry</option>
            </select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Message</label>
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
            <p v-if="submitted" class="text-[10px] font-black uppercase tracking-widest text-green-600">
              ✓ Message sent successfully.
            </p>
          </Transition>

          <button
            type="submit"
            :disabled="loading"
            class="self-start bg-black text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] px-8 md:px-10 py-3 md:py-4 hover:bg-gray-800 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {{ loading ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </div>

      <!-- Contact Info -->
      <div class="md:pl-16 flex flex-col gap-12 md:gap-16">
        <div>
          <p class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 md:mb-8">Direct Contact</p>
          <div class="flex flex-col gap-6">
            <div>
              <p class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Email</p>
              <a href="mailto:info@panafstrag.org" class="text-xs md:text-sm font-bold hover:text-gray-400 transition-colors">
                info@panafstrag.org
              </a>
            </div>
            <div>
              <p class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Phone</p>
              <a href="tel:+23300000000" class="text-xs md:text-sm font-bold hover:text-gray-400 transition-colors">
                +233 00 000 0000
              </a>
            </div>
          </div>
        </div>

        <div>
          <p class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 md:mb-8">Location</p>
          <address class="not-italic text-xs md:text-sm font-bold leading-relaxed text-gray-700">
            PANAFSTRAG Secretariat<br />
            Accra, Ghana<br />
            West Africa
          </address>
        </div>

        <div>
          <p class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 md:mb-8">Office Hours</p>
          <div class="flex flex-col gap-3 text-xs md:text-sm">
            <div class="flex justify-between border-b border-gray-100 pb-3">
              <span class="font-black uppercase tracking-wider text-[10px] md:text-[11px]">Mon – Fri</span>
              <span class="font-bold text-gray-500">8:00 AM – 5:00 PM</span>
            </div>
            <div class="flex justify-between border-b border-gray-100 pb-3">
              <span class="font-black uppercase tracking-wider text-[10px] md:text-[11px]">Saturday</span>
              <span class="font-bold text-gray-500">9:00 AM – 1:00 PM</span>
            </div>
            <div class="flex justify-between">
              <span class="font-black uppercase tracking-wider text-[10px] md:text-[11px]">Sunday</span>
              <span class="font-bold text-gray-500">Closed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


