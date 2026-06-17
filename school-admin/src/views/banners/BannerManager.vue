<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createBanner, deleteBanner, getBanners, updateBanner } from '../../api/banners'
import { uploadFile } from '../../api/uploads'

const rows = ref([])
const loading = ref(false)
const keyword = ref('')
const dialogVisible = ref(false)
const dialogMode = ref('add')
const uploading = ref(false)
const form = reactive({
  id: '',
  title: '',
  subtitle: '',
  position: 'HOME_TOP',
  imageUrl: '',
  linkUrl: '',
  size: '1920*620',
  status: 'ENABLED',
  sort: 1
})

const positionText = { HOME_TOP: '首页顶部轮播', MIDDLE_AD: '网站中部广告', RIGHT_APP: '右侧应用图标' }
const statusText = { ENABLED: '启用', DISABLED: '停用' }

function normalize(item) {
  return { ...item, imageUrl: item.imageUrl || item.image || '' }
}

async function loadData() {
  loading.value = true
  try {
    const data = await getBanners()
    rows.value = Array.isArray(data) ? data.map(normalize) : []
  } finally {
    loading.value = false
  }
}

function list() {
  return rows.value.filter((item) => {
    return !keyword.value || item.title?.includes(keyword.value) || positionText[item.position]?.includes(keyword.value)
  })
}

function resetForm() {
  Object.assign(form, {
    id: '', title: '', subtitle: '', position: 'HOME_TOP', imageUrl: '', linkUrl: '', size: '1920*620', status: 'ENABLED', sort: rows.value.length + 1
  })
}

function openAdd() { dialogMode.value = 'add'; resetForm(); dialogVisible.value = true }
function openEdit(row) { dialogMode.value = 'edit'; Object.assign(form, row); dialogVisible.value = true }
function openView(row) { dialogMode.value = 'view'; Object.assign(form, row); dialogVisible.value = true }

async function handleUpload(option) {
  uploading.value = true
  try {
    const data = await uploadFile(option.file, 'banner')
    form.imageUrl = data.fileUrl
    ElMessage.success('上传成功，已填入图片地址')
  } finally {
    uploading.value = false
  }
}

async function save() {
  if (!form.title || !form.imageUrl) { ElMessage.warning('请填写横幅名称和图片地址'); return }
  const payload = { ...form, sort: Number(form.sort || 0) }
  if (dialogMode.value === 'add') await createBanner(payload)
  else await updateBanner(form.id, payload)
  dialogVisible.value = false
  ElMessage.success('保存成功')
  await loadData()
}

function remove(row) {
  ElMessageBox.confirm(`确定删除横幅“${row.title}”吗？`, '删除确认', { type: 'warning' }).then(async () => {
    await deleteBanner(row.id)
    ElMessage.success('删除成功')
    await loadData()
  })
}

onMounted(loadData)
</script>

<template>
  <div class="page-card">
    <el-alert title="横幅管理对应网站首页轮播海报设置；可上传图片并在前台首页自动读取。" type="info" show-icon :closable="false" style="margin-bottom: 16px" />

    <div class="toolbar">
      <div class="toolbar-left">
        <el-input v-model="keyword" placeholder="横幅名称/分类" clearable style="width: 260px" />
        <el-button type="primary">查询</el-button>
        <el-button @click="keyword = ''">重置</el-button>
      </div>
      <div class="toolbar-right">
        <el-button type="primary" @click="openAdd">新增</el-button>
        <el-button @click="loadData">刷新</el-button>
      </div>
    </div>

    <el-table :data="list()" border stripe v-loading="loading">
      <el-table-column prop="title" label="横幅名称" min-width="180" />
      <el-table-column label="所属分类" width="150"><template #default="{ row }">{{ positionText[row.position] || row.position }}</template></el-table-column>
      <el-table-column label="图片" width="150"><template #default="{ row }"><img :src="row.imageUrl" class="table-image" /></template></el-table-column>
      <el-table-column prop="size" label="建议尺寸" width="120" />
      <el-table-column label="状态" width="90"><template #default="{ row }"><el-tag :type="row.status === 'ENABLED' ? 'success' : 'info'">{{ statusText[row.status] || row.status }}</el-tag></template></el-table-column>
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="操作" width="190" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openView(row)">查看</el-button><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link type="danger" @click="remove(row)">删除</el-button></template></el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增横幅' : dialogMode === 'edit' ? '编辑横幅' : '查看横幅'" width="720px">
      <el-form label-width="110px" :disabled="dialogMode === 'view'">
        <el-form-item label="横幅名称" required><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="副标题"><el-input v-model="form.subtitle" /></el-form-item>
        <el-form-item label="所属分类"><el-select v-model="form.position" style="width:100%"><el-option label="首页顶部轮播" value="HOME_TOP" /><el-option label="网站中部广告" value="MIDDLE_AD" /><el-option label="右侧应用图标" value="RIGHT_APP" /></el-select></el-form-item>
        <el-form-item label="图片地址" required><el-input v-model="form.imageUrl" placeholder="例如 /uploads/xxx.jpg 或 /images/campus-banner.svg" /></el-form-item>
        <el-form-item label="上传图片"><el-upload :http-request="handleUpload" :show-file-list="false"><el-button :loading="uploading">选择并上传</el-button></el-upload></el-form-item>
        <el-form-item label="跳转链接"><el-input v-model="form.linkUrl" /></el-form-item>
        <el-form-item label="建议尺寸"><el-input v-model="form.size" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio-button label="ENABLED">启用</el-radio-button><el-radio-button label="DISABLED">停用</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">关闭</el-button><el-button v-if="dialogMode !== 'view'" type="primary" @click="save">保存</el-button></template>
    </el-dialog>
  </div>
</template>
