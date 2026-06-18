<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createBackupRecordApi, exportBackupSnapshotApi, getBackupRecordsApi } from '../../api/site'

const loading = ref(false)
const creating = ref(false)
const exporting = ref(false)
const backups = ref([])

async function loadData() {
  loading.value = true
  try {
    backups.value = await getBackupRecordsApi()
  } finally {
    loading.value = false
  }
}

async function createBackup() {
  creating.value = true
  try {
    await createBackupRecordApi({
      title: `手动备份 ${new Date().toLocaleString()}`,
      backupType: 'MANUAL',
      scope: 'CONFIG_AND_BUSINESS',
      description: '后台手动生成备份记录。正式部署阶段可扩展为 mysqldump 自动备份文件。'
    })
    ElMessage.success('备份记录已生成')
    await loadData()
  } finally {
    creating.value = false
  }
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

async function exportSnapshot() {
  exporting.value = true
  try {
    const data = await exportBackupSnapshotApi()
    downloadJson(`school-backup-${Date.now()}.json`, data)
    ElMessage.success('已导出 JSON 快照')
  } finally {
    exporting.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="page-card" v-loading="loading">
    <div class="page-card-header">
      <div>
        <h2>数据备份</h2>
        <p>当前阶段提供备份记录和 JSON 快照导出。服务器部署阶段再接入 MySQL 自动备份和定时任务。</p>
      </div>
      <div class="actions">
        <el-button :loading="exporting" @click="exportSnapshot">导出 JSON 快照</el-button>
        <el-button type="primary" :loading="creating" @click="createBackup">生成备份记录</el-button>
      </div>
    </div>

    <el-alert type="info" show-icon :closable="false" class="backup-alert">
      <template #title>
        建议上线后每天自动备份 MySQL 数据库，并将备份文件保存到服务器独立目录或对象存储。
      </template>
    </el-alert>

    <el-table :data="backups" border>
      <el-table-column prop="title" label="备份名称" min-width="220" />
      <el-table-column prop="backupType" label="类型" width="110" />
      <el-table-column prop="scope" label="范围" width="160" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }"><el-tag :type="row.status === 'SUCCESS' ? 'success' : 'danger'">{{ row.status }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="createdBy" label="创建人" width="120" />
      <el-table-column prop="createdAt" label="创建时间" width="210" />
      <el-table-column prop="description" label="说明" min-width="260" />
    </el-table>
  </div>
</template>

<style scoped>
.page-card { background: #fff; border-radius: 12px; padding: 18px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06); }
.page-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
.page-card-header h2 { margin: 0 0 6px; }
.page-card-header p { margin: 0; color: #667085; }
.actions { display: flex; gap: 8px; }
.backup-alert { margin-bottom: 16px; }
</style>
