<script setup lang="ts">
import { quickLinks as fallbackLinks } from '~/data/site'
import { fetchLinks } from '~/api/cms'

const isOpen = ref(false)
const { data: apiLinks } = await useAsyncData('quick-links', () => fetchLinks({ category: 'QUICK_LINK' }))

const links = computed(() => {
  if (apiLinks.value && apiLinks.value.length > 0) {
    return apiLinks.value.map((item) => ({
      label: item.name,
      path: item.url,
      icon: item.icon || '▦',
      target: item.openTarget === 'BLANK' ? '_blank' : '_self'
    }))
  }

  return fallbackLinks.map((item) => ({ ...item, target: '_self' }))
})
</script>

<template>
  <aside class="floating-tools" :class="{ 'is-open': isOpen }">
    <button class="floating-main" type="button" @click="isOpen = !isOpen">
      <span class="grid-icon">▦</span>
      <em>更多功能</em>
    </button>

    <div class="floating-menu">
      <NuxtLink v-for="item in links" :key="item.label" :to="item.path" :target="item.target">
        <span>{{ item.icon }}</span>
        {{ item.label }}
      </NuxtLink>
    </div>
  </aside>
</template>
