<script setup lang="ts">
import { siteConfig } from '~/data/site'
import {
  fetchArticleDetail,
  fetchRelatedArticles,
  type NewsArticle
} from '~/api/cms'

const route = useRoute()

const { data: detailData, pending } = await useAsyncData(
  `article-detail-${route.params.id}`,
  async () => {
    try {
      const article = await fetchArticleDetail(String(route.params.id))
      const relatedArticles = await fetchRelatedArticles(article, 4)

      return {
        errorMessage: '',
        article,
        relatedArticles
      }
    } catch (error: any) {
      return {
        errorMessage:
          error?.message || '无法连接 school-api，请确认后端服务已经启动。',
        article: null as NewsArticle | null,
        relatedArticles: [] as NewsArticle[]
      }
    }
  }
)

const article = computed(() => detailData.value?.article || null)
const relatedArticles = computed(() => detailData.value?.relatedArticles || [])
const errorMessage = computed(() => detailData.value?.errorMessage || '')

useHead(() => ({
  title: article.value
    ? `${article.value.title} - ${siteConfig.schoolName}`
    : `文章不存在 - ${siteConfig.schoolName}`
}))
</script>

<template>
  <main class="page-main">
    <section class="container article-layout">
      <article v-if="pending" class="article-detail">
        <h2>正在加载文章...</h2>
        <p>正在从 school-api 获取文章详情。</p>
      </article>

      <article v-else-if="article" class="article-detail">
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
          <span v-if="article.author">作者：{{ article.author }}</span>
          <span v-if="article.viewCount !== undefined">浏览：{{ article.viewCount }}</span>
        </div>

        <img
          v-if="article.headImage || article.cover"
          class="article-cover"
          :src="article.headImage || article.cover"
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
        <h2>文章不存在或接口连接失败</h2>
        <p v-if="errorMessage" class="article-summary">{{ errorMessage }}</p>
        <p v-else>你访问的文章不存在或已被删除。</p>
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

        <p v-if="relatedArticles.length === 0" class="side-empty">
          暂无相关推荐
        </p>
      </aside>
    </section>
  </main>
</template>
