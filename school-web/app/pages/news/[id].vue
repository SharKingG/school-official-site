<script setup lang="ts">
import { articles, getArticleById } from '~/data/news'
import { siteConfig } from '~/data/site'

const route = useRoute()

const article = computed(() => getArticleById(String(route.params.id)))

const relatedArticles = computed(() => {
  const current = article.value

  if (!current) {
    return []
  }

  return articles
    .filter((item) => item.category === current.category && item.id !== current.id)
    .slice(0, 4)
})

useHead(() => ({
  title: article.value
    ? `${article.value.title} - ${siteConfig.schoolName}`
    : `文章不存在 - ${siteConfig.schoolName}`
}))
</script>

<template>
  <main class="page-main">
    <section class="container article-layout">
      <article v-if="article" class="article-detail">
        <div class="breadcrumb">
          <NuxtLink to="/">首页</NuxtLink>
          <span>/</span>
          <NuxtLink :to="`/news?category=${article.category}`">
            {{ article.categoryName }}
          </NuxtLink>
          <span>/</span>
          <em>正文</em>
        </div>

        <h2>{{ article.title }}</h2>

        <div class="article-meta">
          <span>栏目：{{ article.categoryName }}</span>
          <span>发布日期：{{ article.date }}</span>
        </div>

        <img
          v-if="article.cover"
          class="article-cover"
          :src="article.cover"
          :alt="article.title"
        />

        <p class="article-summary">{{ article.summary }}</p>

        <div class="article-content">
          <p v-for="paragraph in article.content" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>
      </article>

      <article v-else class="article-detail">
        <h2>文章不存在</h2>
        <p>你访问的文章不存在或已被删除。</p>
        <NuxtLink to="/news" class="back-link">返回新闻列表</NuxtLink>
      </article>

      <aside class="article-side">
        <h3>相关推荐</h3>

        <NuxtLink
          v-for="item in relatedArticles"
          :key="item.id"
          :to="`/news/${item.id}`"
        >
          <strong>{{ item.title }}</strong>
          <span>{{ item.date.slice(5) }}</span>
        </NuxtLink>
      </aside>
    </section>
  </main>
</template>
