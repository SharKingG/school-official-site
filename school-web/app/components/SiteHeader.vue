<script setup lang="ts">
import { fetchSiteSettings } from '~/api/site'

const keyword = ref('')
const { data: settings } = await useAsyncData('site-settings-header', fetchSiteSettings)

function handleSearch() {
  const value = keyword.value.trim()
  if (!value) {
    navigateTo('/search')
    return
  }
  navigateTo(`/search?keyword=${encodeURIComponent(value)}`)
}
</script>

<template>
  <header class="site-header">
    <div class="header-decoration header-decoration-left"></div>
    <div class="header-decoration header-decoration-right"></div>

    <div class="container header-inner">
      <NuxtLink to="/" class="brand" aria-label="返回首页">
        <img class="brand-logo-img" :src="settings?.logo" :alt="settings?.schoolName" />
        <div class="brand-text">
          <h1>{{ settings?.schoolName }}</h1>
          <p>{{ settings?.schoolEnglishName }}</p>
        </div>
      </NuxtLink>

      <form class="site-search" @submit.prevent="handleSearch">
        <input v-model="keyword" type="text" :placeholder="settings?.searchPlaceholder || '文章搜索'" />
        <button type="submit">搜索</button>
      </form>
    </div>
  </header>
</template>
