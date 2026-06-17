<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteUpload, getUploads, uploadFile } from '../../api/uploads'

const rows = ref([])
const loading = ref(false)
const uploading = ref(false)
const keyword = ref('')
const moduleName = ref('common')
const dialogVisible = ref(false)
const current = ref(null)

function fileSizeText(size) {
  const value = Number(size || 0)
  if (value > 1024 * 1024) return `${(value / 1024 / 1024).toFixed(2)} MB`
  if (value > 1024) return `${(value / 1024).toFixed(2)} KB`
  return `${value} B`
}

async function loadData() { loading.value = true; try { rows.value = await getUploads({ module: moduleName.value || undefined }) } finally { loading.value = false } }
function list() { return rows.value.filter((item) => !keyword.value || item.originalName?.includes(keyword.value) || item.fileUrl?.includes(keyword.value)) }
async function handleUpload(option) { uploading.value = true; try { await uploadFile(option.file, moduleName.value || 'common'); ElMessage.success('上传成功'); await loadData() } finally { uploading.value = false } }
function openView(row) { current.value = row; dialogVisible.value = true }
function copyUrl(row) { navigator.clipboard?.writeText(row.fileUrl); ElMessage.success('已复制下载路径') }
function remove(row) { ElMessageBox.confirm(`确定删除文件“${row.originalName}”吗？`, '删除确认', { type: 'warning' }).then(async () => { await deleteUpload(row.id); ElMessage.success('删除成功'); await loadData() }) }
onMounted(loadData)
</script>

<template>
  <div class="page-card">
    <el-alert title="文件管理用于上传图片、附件和公共查询结果文件。上传后会生成 /uploads/... 路径，可用于横幅图、领导头像、文章附件等。" type="info" show-icon :closable="false" style="margin-bottom: 16px" />
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input v-model="keyword" placeholder="文件名/下载路径" clearable style="width:260px" />
        <el-select v-model="moduleName" style="width:160px" @change="loadData"><el-option label="全部/通用" value="common" /><el-option label="横幅图片" value="banner" /><el-option label="领导头像" value="leader" /><el-option label="文章附件" value="article" /><el-option label="公共查询" value="query" /></el-select>
        <el-button type="primary">查询</el-button><el-button @click="keyword=''">重置</el-button>
      </div>
      <div class="toolbar-right"><el-upload :http-request="handleUpload" :show-file-list="false"><el-button type="primary" :loading="uploading">上传文件</el-button></el-upload><el-button @click="loadData">刷新</el-button></div>
    </div>
    <el-table :data="list()" border stripe v-loading="loading">
      <el-table-column prop="originalName" label="文件名称" min-width="220" />
      <el-table-column prop="fileUrl" label="下载路径" min-width="260" show-overflow-tooltip />
      <el-table-column prop="module" label="模块" width="110" />
      <el-table-column label="大小" width="110"><template #default="{ row }">{{ fileSizeText(row.fileSize) }}</template></el-table-column>
      <el-table-column prop="createdAt" label="上传时间" width="180" />
      <el-table-column label="操作" width="230" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openView(row)">查看</el-button><el-button link type="success" @click="copyUrl(row)">复制路径</el-button><el-button link type="danger" @click="remove(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="查看文件" width="680px">
      <el-descriptions v-if="current" :column="1" border>
        <el-descriptions-item label="文件名称">{{ current.originalName }}</el-descriptions-item>
        <el-descriptions-item label="访问路径">{{ current.fileUrl }}</el-descriptions-item>
        <el-descriptions-item label="文件大小">{{ fileSizeText(current.fileSize) }}</el-descriptions-item>
        <el-descriptions-item label="MIME 类型">{{ current.mimeType }}</el-descriptions-item>
      </el-descriptions>
      <template #footer><el-button @click="dialogVisible = false">关闭</el-button><el-button v-if="current" type="success" @click="copyUrl(current)">复制路径</el-button></template>
    </el-dialog>
  </div>
</template>
