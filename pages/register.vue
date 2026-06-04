<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
import { useRegister } from '@/composables/modules/auth/useRegister'
const { register } = useRegister()
const form = reactive({
  name: '',
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  try {
    await register(form)
    navigateTo('/login')
  } catch (err: any) {
    error.value = err.data?.message || t('Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}

useHead({
  title: t('Register') + ' | PANAFSTRAG',
})

definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="max-w-md mx-auto py-32 animate-fade-in-up">
    <div class="glass-card p-12 border border-gray-100 shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-black"></div>

      <div class="text-center mb-12">
        <Logo class="justify-center mb-8" />
        <h1 class="text-3xl font-black">{{ t('Request') }} <span class=" text-gray-400">{{ t('Access.') }}</span></h1>
        <p class="text-gray-400 text-sm font-black mt-4">{{ t('Join the research network') }}</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-8">
        <div class="space-y-2">
          <label class="block text-sm font-black text-gray-400 ml-1">{{ t('Full Name') }}</label>
          <input
            v-model="form.name"
            type="text"
            required
            :placeholder="t('Researcher Name')"
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-black focus:ring-0 outline-none transition-all font-medium text-sm placeholder:text-gray-300"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-black text-gray-400 ml-1">{{ t('Email Address') }}</label>
          <input
            v-model="form.email"
            type="email"
            required
            :placeholder="t('name@institution.org')"
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-black focus:ring-0 outline-none transition-all font-medium text-sm placeholder:text-gray-300"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-black text-gray-400 ml-1">{{ t('Secure Password') }}</label>
          <input
            v-model="form.password"
            type="password"
            required
            :placeholder="t('••••••••')"
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-black focus:ring-0 outline-none transition-all font-medium text-sm placeholder:text-gray-300"
          />
        </div>

        <div v-if="error" class="p-4 bg-gray-50 border border-black/5 text-black text-sm font-black rounded-xl text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full btn-primary py-5 rounded-xl shadow-none hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 text-sm "
        >
          {{ loading ? t('PROCESSING REQ...') : t('SUBMIT REQUEST') }}
        </button>
      </form>

      <div class="mt-12 text-center border-t border-gray-100 pt-8">
        <p class="text-gray-400 text-sm font-black">
          {{ t('Already authorized?') }}
          <NuxtLink to="/login" class="text-black hover:underline ml-2">{{ t('Log in here') }}</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
