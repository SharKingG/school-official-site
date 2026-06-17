<script setup lang="ts">
import { quickLinks, siteConfig } from '~/data/site'
import {
  fetchArticles,
  fetchArticlesByCategorySlug,
  type NewsArticle
} from '~/api/cms'

useHead({
  title: `${siteConfig.schoolName}官网`
})

const sectionConfigs = [
  { title: '党建引领', icon: '🚩', slug: 'party' },
  { title: '学生成长', icon: '🌱', slug: 'student' },
  { title: '教师发展', icon: '👩‍🏫', slug: 'teacher' },
  { title: '后勤服务', icon: '🍽️', slug: 'service' },
  { title: '招生招聘', icon: '📣', slug: 'recruit' },
  { title: '校庆专栏', icon: '🎉', slug: 'anniversary' }
]

const emptyArticle: NewsArticle = {
  id: '0',
  title: '暂无文章',
  date: '',
  category: 'none',
  categoryName: '暂无栏目',
  summary: '请先启动后端服务，并在后台发布文章。',
  content: [],
  cover: '/images/feature-news.svg'
}

const { data: homeData, pending } = await useAsyncData('home-data', async () => {
  try {
    const topResult = await fetchArticles({ page: 1, pageSize: 1, isTop: true })
    const latestResult = await fetchArticles({ page: 1, pageSize: 1 })
    const groupResult = await fetchArticlesByCategorySlug('campus', 5)
    const noticeResult = await fetchArticlesByCategorySlug('notice', 5)

    const sectionResults = await Promise.all(
      sectionConfigs.map(async (section) => {
        const result = await fetchArticlesByCategorySlug(section.slug, 5)

        return {
          title: section.title,
          icon: section.icon,
          moreLink: `/news?category=${section.slug}`,
          articles: result.list
        }
      })
    )

    return {
      errorMessage: '',
      featureNews: topResult.list[0] || latestResult.list[0] || emptyArticle,
      groupNews: groupResult.list,
      noticeNews: noticeResult.list,
      sections: sectionResults
    }
  } catch (error: any) {
    return {
      errorMessage:
        error?.message || '无法连接 school-api，请确认后端服务已经启动。',
      featureNews: emptyArticle,
      groupNews: [],
      noticeNews: [],
      sections: sectionConfigs.map((section) => ({
        title: section.title,
        icon: section.icon,
        moreLink: `/news?category=${section.slug}`,
        articles: [] as NewsArticle[]
      }))
    }
  }
})

const featureNews = computed(() => homeData.value?.featureNews || emptyArticle)
const groupNews = computed(() => homeData.value?.groupNews || [])
const noticeNews = computed(() => homeData.value?.noticeNews || [])
const sections = computed(() => homeData.value?.sections || [])
const errorMessage = computed(() => homeData.value?.errorMessage || '')
</script>

<template>
  <main>
    <HeroBanner />

    <section class="quick-links-wrap">
      <div class="container quick-links">
        <NuxtLink v-for="item in quickLinks" :key="item.label" :to="item.path">
          <span>{{ item.icon }}</span>
          <strong>{{ item.label }}</strong>
        </NuxtLink>
      </div>
    </section>

    <section v-if="errorMessage" class="container api-alert">
      <strong>接口连接提示：</strong>
      <span>{{ errorMessage }}</span>
    </section>

    <section v-if="pending" class="container loading-card">
      正在从 school-api 加载首页内容...
    </section>

    <section class="container home-feature">
      <NuxtLink :to="featureNews.id === '0' ? '/news' : `/news/${featureNews.id}`" class="main-feature">
        <img
          class="main-feature-img"
          :src="featureNews.cover || '/images/feature-news.svg'"
          :alt="featureNews.title"
        />

        <div class="main-feature-text">
          <p>{{ featureNews.categoryName }}</p>
          <h2>{{ featureNews.title }}</h2>
          <span>{{ featureNews.summary }}</span>
        </div>
      </NuxtLink>

      <div class="home-panels">
        <NewsPanel
          title="集团动态"
          icon="📰"
          :articles="groupNews"
          more-link="/news?category=campus"
        />

        <NewsPanel
          title="通知公告"
          icon="🔔"
          :articles="noticeNews"
          more-link="/news?category=notice"
        />
      </div>
    </section>

    <section class="container section-grid">
      <NewsSection
        v-for="section in sections"
        :key="section.title"
        :title="section.title"
        :icon="section.icon"
        :articles="section.articles"
        :more-link="section.moreLink"
      />
    </section>
  </main>
</template>
