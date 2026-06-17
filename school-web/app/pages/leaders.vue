<script setup lang="ts">
import { siteConfig } from '~/data/site'
import { fetchLeaders } from '~/api/cms'

const { data: leaders, pending, error } = await useAsyncData('leaders-page', () => fetchLeaders())

useHead({ title: `学校领导 - ${siteConfig.schoolName}` })
</script>

<template>
  <main class="page-main">
    <section class="container">
      <div class="page-header">
        <h2>学校领导</h2>
        <p>展示学校领导班子信息和职责分工</p>
      </div>

      <div v-if="error" class="api-alert">
        <strong>接口连接提示：</strong>
        <span>{{ error.message }}</span>
      </div>

      <div v-if="pending" class="loading-card">正在加载学校领导信息...</div>

      <div v-else-if="!leaders || leaders.length === 0" class="empty-card">
        暂无学校领导信息，可在后台“学校领导”模块维护。
      </div>

      <div v-else class="leader-grid">
        <article v-for="leader in leaders" :key="leader.id" class="leader-card">
          <img :src="leader.photo || '/images/logo.svg'" :alt="leader.name" />
          <div>
            <h3>{{ leader.name }}</h3>
            <strong>{{ leader.title }}</strong>
            <p>{{ leader.intro || '暂无简介' }}</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>
