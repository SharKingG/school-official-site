<script setup lang="ts">
import { siteConfig } from '~/data/site'
</script>

<template>
  <section class="hero-banner">
    <div class="hero-image" :style="{ backgroundImage: `url(${siteConfig.banner})` }"></div>

    <div class="hero-content-card">
      <p class="hero-kicker">欢迎访问学校官网</p>
      <h2>{{ siteConfig.slogan }}</h2>
      <p>{{ siteConfig.subSlogan }}</p>

      <div class="hero-actions">
        <NuxtLink to="/news?category=campus">集团动态</NuxtLink>
        <NuxtLink to="/news?category=recruit">招生招聘</NuxtLink>
      </div>
    </div>
  </section>
</template>
