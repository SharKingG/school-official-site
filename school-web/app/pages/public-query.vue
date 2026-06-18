<script setup lang="ts">
import { publicQueryApi, resolveFileUrl } from '~/api/business'

useHead({ title: '公共查询 - 学校官网' })

const projects = ref<any[]>([])
const loading = ref(true)
const selectedProject = ref<any>(null)
const queryLoading = ref(false)
const message = ref('')
const results = ref<any[]>([])

const form = reactive({
  name: '',
  idCard: '',
  ticketNo: ''
})

async function loadProjects() {
  loading.value = true
  try {
    projects.value = await publicQueryApi.listProjects({ status: 'ENABLED' })
    selectedProject.value = projects.value[0] || null
  } catch (error: any) {
    message.value = error.message || '查询项目读取失败，请确认后端服务是否启动。'
  } finally {
    loading.value = false
  }
}

function fieldEnabled(field: string) {
  const fields = String(selectedProject.value?.queryFields || 'name,idCard').split(',').map((item) => item.trim())
  return fields.includes(field)
}

async function search() {
  message.value = ''
  results.value = []

  if (!selectedProject.value) {
    message.value = '请选择查询项目。'
    return
  }
  if (!form.name) {
    message.value = '请输入姓名。'
    return
  }
  if (fieldEnabled('idCard') && !form.idCard) {
    message.value = '请输入身份证号。'
    return
  }
  if (fieldEnabled('ticketNo') && !form.ticketNo) {
    message.value = '请输入准考证号。'
    return
  }

  queryLoading.value = true
  try {
    results.value = await publicQueryApi.search(selectedProject.value.id, { ...form })
    if (results.value.length === 0) {
      message.value = '未查询到结果，请核对输入信息。'
    }
  } catch (error: any) {
    message.value = error.message || '查询失败，请稍后再试。'
  } finally {
    queryLoading.value = false
  }
}

onMounted(loadProjects)
</script>

<template>
  <main class="page-main">
    <section class="container">
      <div class="page-header">
        <h2>公共查询</h2>
        <p>提供录取查询、成绩查询、分班查询等公共信息查询服务。</p>
      </div>

      <div v-if="loading" class="empty-card">正在加载查询项目...</div>
      <div v-else-if="projects.length === 0" class="empty-card">暂无启用中的查询项目。</div>

      <div v-else class="business-layout">
        <aside class="business-side">
          <button
            v-for="project in projects"
            :key="project.id"
            :class="['business-plan-btn', { active: selectedProject?.id === project.id }]"
            @click="selectedProject = project; results = []; message = ''"
          >
            <strong>{{ project.title }}</strong>
            <span>{{ project.description || '点击进入查询' }}</span>
          </button>
        </aside>

        <section class="business-card">
          <h3>{{ selectedProject?.title }}</h3>
          <p class="business-desc">{{ selectedProject?.description || '请输入信息进行查询。' }}</p>

          <div class="form-grid">
            <label>姓名<input v-model="form.name" placeholder="请输入姓名" /></label>
            <label v-if="fieldEnabled('idCard')">身份证号<input v-model="form.idCard" placeholder="请输入身份证号" /></label>
            <label v-if="fieldEnabled('ticketNo')">准考证号<input v-model="form.ticketNo" placeholder="请输入准考证号" /></label>
          </div>

          <p v-if="message" class="form-message">{{ message }}</p>
          <button class="submit-btn" :disabled="queryLoading" @click="search">
            {{ queryLoading ? '查询中...' : '开始查询' }}
          </button>

          <div v-if="results.length > 0" class="query-results">
            <h3>查询结果</h3>
            <div v-for="item in results" :key="item.id" class="query-result-card">
              <strong>{{ item.resultTitle }}</strong>
              <p>{{ item.resultContent || '暂无详细说明' }}</p>
              <a v-if="item.fileUrl" :href="resolveFileUrl(item.fileUrl)" target="_blank">下载相关文件</a>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>
