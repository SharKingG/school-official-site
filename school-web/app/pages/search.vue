<script setup lang="ts">
import { searchArticles } from '~/data/news'
import { siteConfig } from '~/data/site'

const route = useRoute()

const keyword = ref(String(route.query.keyword || ''))

watch(
  () => route.query.keyword,
  (value) => {
    keyword.value = String(value || '')
  }
)

const results = computed(() => searchArticles(keyword.value))

function handleSearch() {
  const value = keyword.value.trim()

  if (!value) {
    navigateTo('/search')
    return
  }

  navigateTo(`/search?keyword=${encodeURIComponent(value)}`)
}

useHead({
  title: `文章搜索 - ${siteConfig.schoolName}`
})
</script>

<template>
  <main class="page-main">
    <section class="container">
      <div class="page-header">
        <h2>文章搜索</h2>
        <p>输入关键词，搜索校园新闻、通知公告和招生招聘信息</p>
      </div>

      <form class="search-page-box" @submit.prevent="handleSearch">
        <input v-model="keyword" type="text" placeholder="请输入搜索关键词" />
        <button type="submit">搜索</button>
      </form>

      <div class="search-result-title">
        共找到 {{ results.length }} 条结果
      </div>

      <div class="list-page">
        <NuxtLink
          v-for="article in results"
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
