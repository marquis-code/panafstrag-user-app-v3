<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { useFetchLanguageGroups } from '@/composables/modules/languageGroups/useFetchLanguageGroups'
import { useHomeContent } from '@/composables/modules/home-content/useHomeContent'
const { t } = useI18n()
const { fetchLanguageGroups, languageGroups, loading: pending } = useFetchLanguageGroups()
const { homeContent } = useHomeContent()

useHead({
  title: 'Language Groups | PANAFSTRAG',
})
</script>

<template>
  <div class="space-y-16 px-6 lg:px-0 pt-16 container mx-auto pb-32">
    <div class="max-w-3xl mx-auto text-center mb-24 animate-fade-in-up">
      <h1 class="text-4xl lg:text-5xl font-black mb-6" v-html="homeContent?.languageGroupsPageTitle || t('Language_Groups_HTML')"></h1>
      <p class="text-gray-500 text-lg font-medium leading-relaxed" v-html="homeContent?.languageGroupsPageDescription || t('Language_Groups_Desc')"></p>
    </div>

    <div v-if="pending" class="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      <div v-for="i in 3" :key="i" class="h-48 bg-gray-50 rounded-2xl animate-pulse"></div>
    </div>


    <div v-else-if="languageGroups?.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      <div v-for="(group, i) in (languageGroups as any[])" :key="group?._id"
        class="flex flex-col group glass-card overflow-hidden animate-fade-in-up"
        :class="`delay-${(i % 3 + 1) * 100}`">
        <div class="p-10 flex-1 space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-black text-white flex items-center justify-center font-black rounded">
               {{ group?.name?.charAt(0) || 'G' }}
            </div>
            <h3 class="text-2xl font-black group-hover:text-gray-500 transition-colors leading-tight">{{ group?.name }}</h3>
          </div>
          <p class="text-gray-500 text-sm font-medium leading-relaxed" v-html="group?.description"></p>
          <div v-if="group?.url" class="pt-4">
             <a :href="group.url" target="_blank" class="text-sm font-black border-b-2 border-black inline-block pb-1 hover:border-gray-300 transition-all">{{ t('Visit_Platform') }}</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState
        :title="t('NO_GROUPS')"
        :message="t('NO_GROUPS_MSG')"
      />
    </div>

    <div v-if="homeContent" class="max-w-4xl mx-auto mt-32 space-y-12 bg-gray-50 p-12 rounded-2xl border border-gray-100">
      <div class="grid md:grid-cols-2 gap-12">
        <div>
          <h3 class="text-xl font-black mb-4" v-html="homeContent?.languageGroupFunctionTitle || t('Function_Title')"></h3>
          <p class="text-gray-600 text-sm leading-relaxed" v-html="homeContent?.languageGroupFunction || t('Function_Desc')"></p>
        </div>
        <div>
          <h3 class="text-xl font-black mb-4" v-html="homeContent?.languageGroupMembershipTitle || t('Membership_Title')"></h3>
          <p class="text-gray-600 text-sm leading-relaxed" v-html="homeContent?.languageGroupMembership || t('Membership_Desc')"></p>
        </div>
        <div>
          <h3 class="text-xl font-black mb-4" v-html="homeContent?.languageGroupLeadershipTitle || t('Leadership_Title')"></h3>
          <p class="text-gray-600 text-sm leading-relaxed" v-html="homeContent?.languageGroupLeadership || t('Leadership_Desc')"></p>
        </div>
        <div>
          <h3 class="text-xl font-black mb-4" v-html="homeContent?.languageGroupFeesTitle || t('Fees_Title')"></h3>
          <p class="text-gray-600 text-sm leading-relaxed" v-html="homeContent?.languageGroupFees || t('Fees_Desc')"></p>
        </div>
      </div>
    </div>
  </div>
</template>
