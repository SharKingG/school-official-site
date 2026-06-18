<script setup lang="ts">
import { quickLinks } from '~/data/site'
import { fetchHomeSections, fetchSiteSettings } from '~/api/site'
import {
  fetchArticles,
  fetchArticlesByCategorySlug,
  type NewsArticle
} from '~/api/cms'

const { data: settings } = await useAsyncData('site-settings-index', fetchSiteSettings)

useHead(() => ({
  title: settings.value?.browserTitle || `${settings.value?.schoolName || '学校'}官网`
}))

const defaultSectionConfigs = [
  { title: '党建引领', icon: '🚩', categorySlug: 'party', articleLimit: 5, moreLink: '/news?category=party' },
  { title: '学生成长', icon: '🌱', categorySlug: 'student', articleLimit: 5, moreLink: '/news?category=student' },
  { title: '教师发展', icon: '👩‍🏫', categorySlug: 'teacher', articleLimit: 5, moreLink: '/news?category=teacher' },
  { title: '后勤服务', icon: '🍽️', categorySlug: 'service', articleLimit: 5, moreLink: '/news?category=service' },
  { title: '招生招聘', icon: '📣', categorySlug: 'recruit', articleLimit: 5, moreLink: '/news?category=recruit' },
  { title: '校庆专栏', icon: '🎉', categorySlug: 'anniversary', articleLimit: 5, moreLink: '/news?category=anniversary' }
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
    const apiSections = await fetchHomeSections()
    const sectionConfigs = apiSections.length
      ? apiSections.map((item) => ({
          title: item.title,
          icon: item.icon || '📰',
          categorySlug: item.categorySlug || '',
          articleLimit: item.articleLimit || 5,
          moreLink: item.moreLink || `/news?category=${item.categorySlug || ''}`
        }))
      : defaultSectionConfigs

    const topResult = await fetchArticles({ page: 1, pageSize: 1, isTop: true })
    const latestResult = await fetchArticles({ page: 1, pageSize: 1 })
    const groupResult = await fetchArticlesByCategorySlug('campus', 5)
    const noticeResult = await fetchArticlesByCategorySlug('notice', 5)

    const sectionResults = await Promise.all(
      sectionConfigs.map(async (section) => {
        const result = section.categorySlug
          ? await fetchArticlesByCategorySlug(section.categorySlug, section.articleLimit || 5)
          : { list: [] }

        return {
          title: section.title,
          icon: section.icon,
          moreLink: section.moreLink || '/news',
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
      errorMessage: error?.message || '无法连接 school-api，请确认后端服务已经启动。',
      featureNews: emptyArticle,
      groupNews: [],
      noticeNews: [],
      sections: defaultSectionConfigs.map((section) => ({
        title: section.title,
        icon: section.icon,
        moreLink: section.moreLink,
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

    <section v-if="pending" class="container loading-card">正在从 school-api 加载首页内容...</section>

    <section class="container home-feature">
      <NuxtLink :to="featureNews.id === '0' ? '/news' : `/news/${featureNews.id}`" class="main-feature">
        <img class="main-feature-img" :src="featureNews.cover || '/images/feature-news.svg'" :alt="featureNews.title" />
        <div class="main-feature-text">
          <p>{{ featureNews.categoryName }}</p>
          <h2>{{ featureNews.title }}</h2>
          <span>{{ featureNews.summary }}</span>
        </div>
      </NuxtLink>

      <div class="home-panels">
        <NewsPanel title="集团动态" icon="📰" :articles="groupNews" more-link="/news?category=campus" />
        <NewsPanel title="通知公告" icon="🔔" :articles="noticeNews" more-link="/news?category=notice" />
      </div>
    </section>

    <section class="container section-grid">
      <NewsSection v-for="section in sections" :key="section.title" :title="section.title" :icon="section.icon" :articles="section.articles" :more-link="section.moreLink" />
    </section>
  </main>
</template>
