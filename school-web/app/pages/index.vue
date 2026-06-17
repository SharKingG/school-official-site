<script setup lang="ts">
import { articles, getArticlesByCategory } from '~/data/news'
import { quickLinks, siteConfig } from '~/data/site'

useHead({
  title: `${siteConfig.schoolName}官网`
})

const featureNews = articles.find((item) => item.isTop) || articles[0]

const groupNews = getArticlesByCategory('campus', 5)
const noticeNews = getArticlesByCategory('notice', 5)

const sections = [
  {
    title: '党建引领',
    icon: '🚩',
    moreLink: '/news?category=party',
    articles: getArticlesByCategory('party', 5)
  },
  {
    title: '学生成长',
    icon: '🌱',
    moreLink: '/news?category=student',
    articles: getArticlesByCategory('student', 5)
  },
  {
    title: '教师发展',
    icon: '👩‍🏫',
    moreLink: '/news?category=teacher',
    articles: getArticlesByCategory('teacher', 5)
  },
  {
    title: '后勤服务',
    icon: '🍽️',
    moreLink: '/news?category=service',
    articles: getArticlesByCategory('service', 5)
  },
  {
    title: '校区动态',
    icon: '🏫',
    moreLink: '/news?category=campusArea',
    articles: getArticlesByCategory('campusArea', 5)
  },
  {
    title: '校庆专栏',
    icon: '🎉',
    moreLink: '/news?category=anniversary',
    articles: getArticlesByCategory('anniversary', 5)
  }
]
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

    <section class="container home-feature">
      <NuxtLink :to="`/news/${featureNews.id}`" class="main-feature">
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
