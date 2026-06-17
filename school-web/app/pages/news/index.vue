<script setup lang="ts">
import { siteConfig } from '~/data/site'
import {
  fetchArticles,
  fetchCategories,
  type NewsArticle,
  type NewsCategoryOption,
  type ApiPagination
} from '~/api/cms'

const route = useRoute()

const currentCategory = computed(() => String(route.query.category || 'all'))
const currentPage = computed(() => Math.max(Number(route.query.page || 1), 1))

function emptyPagination(): ApiPagination {
  return {
    page: currentPage.value,
    pageSize: 10,
    total: 0,
    totalPages: 0
  }
}

const { data: pageData, pending } = await useAsyncData(
  'news-list',
  async () => {
    try {
      const categories = await fetchCategories()
      const current = categories.find((item) => item.key === currentCategory.value)

      const result = await fetchArticles({
        page: currentPage.value,
        pageSize: 10,
        categoryId: currentCategory.value === 'all' ? undefined : current?.id,
        status: 'PUBLISHED'
      })

      const title =
        currentCategory.value === 'all' ? '全部新闻' : current?.label || '新闻列表'

      return {
        errorMessage: '',
        categories,
        pageTitle: title,
        articles: result.list,
        pagination: result.pagination
      }
    } catch (error: any) {
      return {
        errorMessage:
          error?.message || '无法连接 school-api，请确认后端服务已经启动。',
        categories: [] as NewsCategoryOption[],
        pageTitle: '新闻列表',
        articles: [] as NewsArticle[],
        pagination: emptyPagination()
      }
    }
  },
  {
    watch: [currentCategory, currentPage]
  }
)

const pageTitle = computed(() => pageData.value?.pageTitle || '新闻列表')
const categoryOptions = computed(() => pageData.value?.categories || [])
const currentArticles = computed(() => pageData.value?.articles || [])
const pagination = computed(() => pageData.value?.pagination || emptyPagination())
const errorMessage = computed(() => pageData.value?.errorMessage || '')

function pagePath(page: number) {
  const query = new URLSearchParams()

  if (currentCategory.value !== 'all') {
    query.set('category', currentCategory.value)
  }

  if (page > 1) {
    query.set('page', String(page))
  }

  const text = query.toString()
  return text ? `/news?${text}` : '/news'
}

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

      <div v-if="errorMessage" class="api-alert">
        <strong>接口连接提示：</strong>
        <span>{{ errorMessage }}</span>
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

      <div v-if="pending" class="loading-card">
        正在从 school-api 加载新闻列表...
      </div>

      <div v-else-if="currentArticles.length === 0" class="empty-card">
        暂无文章。你可以先进入后台发布文章，再回到前台刷新查看。
      </div>

      <div v-else class="list-page">
        <NuxtLink
          v-for="article in currentArticles"
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
