<script setup lang="ts">
import { siteConfig } from '~/data/site'
import { fetchBanners } from '~/api/cms'

const { data: banners } = await useAsyncData('home-top-banners', () => fetchBanners({ position: 'HOME_TOP' }))
const firstBanner = computed(() => banners.value?.[0])
const bannerImage = computed(() => firstBanner.value?.imageUrl || siteConfig.banner)
const bannerTitle = computed(() => firstBanner.value?.subtitle || siteConfig.slogan)
</script>

<template>
  <section class="hero-banner">
    <div class="hero-image" :style="{ backgroundImage: `url(${bannerImage})` }"></div>

    <div class="hero-content-card">
      <p class="hero-kicker">欢迎访问学校官网</p>
      <h2>{{ bannerTitle }}</h2>
      <p>{{ siteConfig.subSlogan }}</p>

      <div class="hero-actions">
        <NuxtLink to="/news?category=campus">集团动态</NuxtLink>
        <NuxtLink to="/news?category=recruit">招生招聘</NuxtLink>
      </div>
    </div>
  </section>
</template>
