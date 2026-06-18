<script setup lang="ts">
import { fetchBanners } from '~/api/cms'
import { fetchSiteSettings } from '~/api/site'

const { data: settings } = await useAsyncData('site-settings-hero', fetchSiteSettings)
const { data: banners } = await useAsyncData('home-top-banners', () => fetchBanners({ position: 'HOME_TOP' }))
const firstBanner = computed(() => banners.value?.[0])
const bannerImage = computed(() => firstBanner.value?.imageUrl || settings.value?.banner || '/images/campus-banner.svg')
const bannerTitle = computed(() => firstBanner.value?.subtitle || settings.value?.slogan || '厚德 博学 求实 创新')
</script>

<template>
  <section class="hero-banner">
    <div class="hero-image" :style="{ backgroundImage: `url(${bannerImage})` }"></div>
    <div class="hero-content-card">
      <p class="hero-kicker">欢迎访问学校官网</p>
      <h2>{{ bannerTitle }}</h2>
      <p>{{ settings?.subSlogan }}</p>
      <div class="hero-actions">
        <NuxtLink to="/news?category=campus">集团动态</NuxtLink>
        <NuxtLink to="/news?category=recruit">招生招聘</NuxtLink>
      </div>
    </div>
  </section>
</template>
