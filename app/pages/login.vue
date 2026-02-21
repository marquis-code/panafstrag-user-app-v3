<script setup lang="ts">
const { login } = useAuth()
const form = reactive({
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await login(form)
    navigateTo('/admin')
  } catch (err: any) {
    error.value = err.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Login | PANAFSTRAG',
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
        <h1 class="text-3xl font-black tracking-tighter uppercase italic">Welcome <span class="not-italic text-gray-400">Back.</span></h1>
        <p class="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-4">Security Authorized Access Only</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-8">
        <div class="space-y-2">
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Credential ID (Email)</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="name@institution.org"
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-black focus:ring-0 outline-none transition-all font-medium text-sm placeholder:text-gray-300"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Access Key (Password)</label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            placeholder="••••••••"
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-black focus:ring-0 outline-none transition-all font-medium text-sm placeholder:text-gray-300"
          />
        </div>

        <div v-if="error" class="p-4 bg-gray-50 border border-black/5 text-black text-[10px] font-black uppercase tracking-widest rounded-xl text-center italic">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full btn-primary py-5 rounded-xl shadow-none hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 text-[10px] tracking-[0.3em]"
        >
          {{ loading ? 'AUTHORIZING...' : 'AUTHORIZE ACCESS' }}
        </button>
      </form>

      <div class="mt-12 text-center border-t border-gray-100 pt-8">
        <p class="text-gray-400 text-[10px] font-black uppercase tracking-widest">
          New researcher? 
          <NuxtLink to="/register" class="text-black hover:underline ml-2">Request Credentials</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
