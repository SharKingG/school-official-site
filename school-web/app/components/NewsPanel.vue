<script setup lang="ts">
import type { NewsArticle } from '~/api/cms'

withDefaults(
  defineProps<{
    title: string
    articles: NewsArticle[]
    icon?: string
    moreLink?: string
  }>(),
  {
    icon: '📌',
    moreLink: '/news'
  }
)
</script>

<template>
  <section class="news-panel">
    <div class="panel-title">
      <h3>
        <span class="title-icon">{{ icon }}</span>
        {{ title }}
      </h3>

      <NuxtLink :to="moreLink">+ 更多</NuxtLink>
    </div>

    <ul class="article-list">
      <li v-for="article in articles" :key="article.id">
        <NuxtLink :to="`/news/${article.id}`">
          <span>{{ article.title }}</span>
          <em>{{ article.date.slice(5) }}</em>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
