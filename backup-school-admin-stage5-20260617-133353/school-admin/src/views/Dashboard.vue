<script setup>
import { useRouter } from 'vue-router'
import { readStorage } from '../utils/storage'
import { initialArticles, initialBanners, initialAdmissions, initialRecruitments } from '../data/mockData'

const router = useRouter()
const articles = readStorage('school_admin_articles', initialArticles)
const banners = readStorage('school_admin_banners', initialBanners)
const admissions = readStorage('school_admin_admissions', initialAdmissions)
const recruitments = readStorage('school_admin_recruitments', initialRecruitments)

const quickLinks = [
  { title: '发布文章', desc: '填写常规信息和高级信息', path: '/articles/publish' },
  { title: '网站栏目管理', desc: '维护栏目树和下级栏目', path: '/columns' },
  { title: '招生管理', desc: '维护招生计划并查看报名', path: '/admissions' },
  { title: '公共查询', desc: '上传查询模板和结果文件', path: '/public-query' }
]
</script>

<template>
  <div>
    <div class="stat-grid">
      <div class="stat-card">
        <strong>{{ articles.length }}</strong>
        <span>文章总数</span>
      </div>
      <div class="stat-card">
        <strong>{{ banners.length }}</strong>
        <span>横幅数量</span>
      </div>
      <div class="stat-card">
        <strong>{{ admissions.length }}</strong>
        <span>招生计划</span>
      </div>
      <div class="stat-card">
        <strong>{{ recruitments.length }}</strong>
        <span>招聘计划</span>
      </div>
    </div>

    <el-alert
      title="第四阶段说明"
      type="success"
      description="本阶段是后台管理系统前端静态原型，数据暂存在浏览器 localStorage。下一阶段接入 school-api 和 MySQL 后，才会变成真实数据库管理。"
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
