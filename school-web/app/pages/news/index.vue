<script setup lang="ts">
import {
  articles,
  categoryOptions,
  getArticlesByCategory,
  type NewsCategory
} from '~/data/news'
import { siteConfig } from '~/data/site'

const route = useRoute()

const currentCategory = computed(() => String(route.query.category || 'all'))

const pageTitle = computed(() => {
  if (currentCategory.value === 'all') {
    return '全部新闻'
  }

  return (
    categoryOptions.find((item) => item.key === currentCategory.value)?.label ||
    '新闻列表'
  )
})

const currentArticles = computed(() => {
  if (currentCategory.value === 'all') {
    return articles
  }

  return getArticlesByCategory(currentCategory.value as NewsCategory)
})

useHead(() => ({
  title: `${pageTitle.value} - ${siteConfig.schoolName}`
}))
</script>

<template>
  <main class="page-main">
    <section class="container">
      <div class="page-header">
        <h2>{{ pageTitle }}</h2>
        <p>及时发布学校新闻、通知公告、招生招聘和校园动态</p>
      </div>

      <div class="category-tabs">
        <NuxtLink
          to="/news"
          :class="{ 'is-active': currentCategory === 'all' }"
        >
          全部
        </NuxtLink>

        <NuxtLink
          v-for="item in categoryOptions"
          :key="item.key"
          :to="`/news?category=${item.key}`"
          :class="{ 'is-active': currentCategory === item.key }"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <div class="list-page">
        <NuxtLink
          v-for="article in currentArticles"
          :key="article.id"
          :to="`/news/${article.id}`"
          class="list-item"
        >
          <img
            class="list-thumb"
            :src="article.cover || '/images/feature-news.svg'"
            :alt="article.title"
          />

          <div class="list-info">
            <span>{{ article.categoryName }}</span>
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
          </div>

          <time>{{ article.date }}</time>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
