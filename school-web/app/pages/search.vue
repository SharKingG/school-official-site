<script setup lang="ts">
import { siteConfig } from '~/data/site'
import {
  fetchArticles,
  type NewsArticle,
  type ApiPagination
} from '~/api/cms'

const route = useRoute()

const keyword = ref(String(route.query.keyword || ''))
const currentKeyword = computed(() => String(route.query.keyword || ''))
const currentPage = computed(() => Math.max(Number(route.query.page || 1), 1))

watch(
  () => route.query.keyword,
  (value) => {
    keyword.value = String(value || '')
  }
)

function emptyPagination(): ApiPagination {
  return {
    page: currentPage.value,
    pageSize: 10,
    total: 0,
    totalPages: 0
  }
}

const { data: searchData, pending } = await useAsyncData(
  'search-result',
  async () => {
    try {
      const result = await fetchArticles({
        page: currentPage.value,
        pageSize: 10,
        keyword: currentKeyword.value,
        status: 'PUBLISHED'
      })

      return {
        errorMessage: '',
        articles: result.list,
        pagination: result.pagination
      }
    } catch (error: any) {
      return {
        errorMessage:
          error?.message || '无法连接 school-api，请确认后端服务已经启动。',
        articles: [] as NewsArticle[],
        pagination: emptyPagination()
      }
    }
  },
  {
    watch: [currentKeyword, currentPage]
  }
)

const results = computed(() => searchData.value?.articles || [])
const pagination = computed(() => searchData.value?.pagination || emptyPagination())
const errorMessage = computed(() => searchData.value?.errorMessage || '')

function handleSearch() {
  const value = keyword.value.trim()

  if (!value) {
    navigateTo('/search')
    return
  }

  navigateTo(`/search?keyword=${encodeURIComponent(value)}`)
}

function pagePath(page: number) {
  const query = new URLSearchParams()

  if (currentKeyword.value) {
    query.set('keyword', currentKeyword.value)
  }

  if (page > 1) {
    query.set('page', String(page))
  }

  const text = query.toString()
  return text ? `/search?${text}` : '/search'
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

      <div v-if="errorMessage" class="api-alert">
        <strong>接口连接提示：</strong>
        <span>{{ errorMessage }}</span>
      </div>

      <form class="search-page-box" @submit.prevent="handleSearch">
        <input v-model="keyword" type="text" placeholder="请输入搜索关键词" />
        <button type="submit">搜索</button>
      </form>

      <div class="search-result-title">
        共找到 {{ pagination.total }} 条结果
      </div>

      <div v-if="pending" class="loading-card">
        正在从 school-api 搜索文章...
      </div>

      <div v-else-if="results.length === 0" class="empty-card">
        暂无搜索结果。
      </div>

      <div v-else class="list-page">
        <NuxtLink
          v-for="article in results"
          :key="article.id"
          :to="`/news/${article.id}`"
          class="list-item"
        >
          <img
            class="list-thumb"
            :src="article.listImage || article.cover || '/images/feature-news.svg'"
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

      <div v-if="pagination.totalPages > 1" class="pager">
        <NuxtLink
          v-if="pagination.page > 1"
          :to="pagePath(pagination.page - 1)"
        >
          上一页
        </NuxtLink>

        <span>第 {{ pagination.page }} / {{ pagination.totalPages }} 页，共 {{ pagination.total }} 条</span>

        <NuxtLink
          v-if="pagination.page < pagination.totalPages"
          :to="pagePath(pagination.page + 1)"
        >
          下一页
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
