<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getArticlesApi } from '../api/articles'
import { getCategoriesApi } from '../api/categories'
import { readStorage } from '../utils/storage'
import { initialBanners, initialAdmissions, initialRecruitments } from '../data/mockData'

const router = useRouter()
const articleCount = ref(0)
const categoryCount = ref(0)
const banners = readStorage('school_admin_banners', initialBanners)
const admissions = readStorage('school_admin_admissions', initialAdmissions)
const recruitments = readStorage('school_admin_recruitments', initialRecruitments)
const loading = ref(false)

const quickLinks = [
  { title: '发布文章', desc: '调用后端接口写入 MySQL', path: '/articles/publish' },
  { title: '网站栏目管理', desc: '维护数据库中的栏目树', path: '/columns' },
  { title: '管理所有文章', desc: '查询、编辑、置顶和删除文章', path: '/articles/all' },
  { title: '招生管理', desc: '后续阶段接入真实接口', path: '/admissions' }
]

async function loadStats() {
  loading.value = true

  try {
    const [articleResult, categoryResult] = await Promise.all([
      getArticlesApi({ page: 1, pageSize: 1 }),
      getCategoriesApi()
    ])

    articleCount.value = articleResult.pagination?.total || articleResult.list?.length || 0
    categoryCount.value = categoryResult.length || 0
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>

<template>
  <div v-loading="loading">
    <div class="stat-grid">
      <div class="stat-card">
        <strong>{{ articleCount }}</strong>
        <span>数据库文章</span>
      </div>
      <div class="stat-card">
        <strong>{{ categoryCount }}</strong>
        <span>数据库栏目</span>
      </div>
      <div class="stat-card">
        <strong>{{ banners.length }}</strong>
        <span>横幅数量</span>
      </div>
      <div class="stat-card">
        <strong>{{ admissions.length + recruitments.length }}</strong>
        <span>招生招聘计划</span>
      </div>
    </div>

    <el-alert
      title="第六阶段说明"
      type="success"
      description="登录、栏目管理、发布文章、管理我的文章、管理所有文章已经接入 school-api 和 MySQL。横幅、链接、学校领导、招生、招聘、公共查询、文件管理仍暂用 localStorage，后续阶段继续接入接口。"
      show-icon
      :closable="false"
      style="margin-bottom: 18px"
    />

    <div class="page-card">
      <h3>快捷入口</h3>
      <div class="quick-grid">
        <div v-for="item in quickLinks" :key="item.path" class="quick-card" @click="router.push(item.path)">
          <h4>{{ item.title }}</h4>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
