<script setup lang="ts">
import type { NewsArticle } from '~/api/cms'

const props = withDefaults(
  defineProps<{
    title: string
    articles: NewsArticle[]
    icon?: string
    moreLink?: string
  }>(),
  {
    icon: '📰',
    moreLink: '/news'
  }
)

const firstArticle = computed(() => props.articles[0])
const restArticles = computed(() => props.articles.slice(1))
</script>

<template>
  <section class="section-card">
    <div class="section-title">
      <h3>
        <span class="title-icon">{{ icon }}</span>
        {{ title }}
      </h3>

      <NuxtLink :to="moreLink">+ 更多</NuxtLink>
    </div>

    <NuxtLink
      v-if="firstArticle"
      :to="`/news/${firstArticle.id}`"
      class="feature-article"
    >
      <img
        class="feature-thumb"
        :src="firstArticle.cover || '/images/feature-news.svg'"
        :alt="firstArticle.title"
      />

      <div class="feature-info">
        <strong>{{ firstArticle.title }}</strong>
        <p>{{ firstArticle.summary }}</p>
        <em>{{ firstArticle.date.slice(5) }}</em>
      </div>
    </NuxtLink>

    <ul class="mini-list">
      <li v-for="article in restArticles" :key="article.id">
        <NuxtLink :to="`/news/${article.id}`">
          <span>{{ article.title }}</span>
          <em>{{ article.date.slice(5) }}</em>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
