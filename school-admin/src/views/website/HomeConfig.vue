<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategoriesApi } from '../../api/categories'
import { createHomeSectionApi, deleteHomeSectionApi, getHomeSectionsApi, updateHomeSectionApi } from '../../api/site'

const loading = ref(false)
const dialogVisible = ref(false)
const editingId = ref(null)
const sections = ref([])
const categories = ref([])

const form = reactive({
  title: '',
  icon: '📰',
  categorySlug: '',
  categoryId: null,
  articleLimit: 5,
  moreLink: '',
  layout: 'CARD',
  sort: 0,
  visible: true
})

async function loadData() {
  loading.value = true
  try {
    const [sectionData, categoryData] = await Promise.all([getHomeSectionsApi(), getCategoriesApi()])
    sections.value = sectionData || []
    categories.value = Array.isArray(categoryData) ? categoryData : []
  } finally {
    loading.value = false
  }
}

function resetForm() {
  editingId.value = null
  Object.assign(form, {
    title: '', icon: '📰', categorySlug: '', categoryId: null, articleLimit: 5, moreLink: '', layout: 'CARD', sort: 0, visible: true
  })
}

function openCreate() {
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  editingId.value = row.id
  Object.assign(form, {
    title: row.title || '',
    icon: row.icon || '📰',
    categorySlug: row.categorySlug || '',
    categoryId: row.categoryId || null,
    articleLimit: row.articleLimit || 5,
    moreLink: row.moreLink || '',
    layout: row.layout || 'CARD',
    sort: row.sort || 0,
    visible: Boolean(row.visible)
  })
  dialogVisible.value = true
}

function handleCategoryChange(slug) {
  const category = categories.value.find((item) => item.slug === slug)
  form.categoryId = category?.id || null
  form.moreLink = slug ? `/news?category=${slug}` : ''
  if (!form.title && category?.name) form.title = category.name
}

async function saveSection() {
  if (!form.title.trim()) {
    ElMessage.error('请输入首页栏目标题')
    return
  }

  const payload = {
    ...form,
    categoryId: form.categoryId || null,
    articleLimit: Number(form.articleLimit || 5),
    sort: Number(form.sort || 0)
  }

  if (editingId.value) await updateHomeSectionApi(editingId.value, payload)
  else await createHomeSectionApi(payload)

  ElMessage.success('保存成功')
  dialogVisible.value = false
  await loadData()
}

async function removeSection(row) {
  await ElMessageBox.confirm(`确定删除首页栏目「${row.title}」吗？`, '删除确认', { type: 'warning' })
  await deleteHomeSectionApi(row.id)
  ElMessage.success('删除成功')
  await loadData()
}

onMounted(loadData)
</script>

<template>
  <div class="page-card" v-loading="loading">
    <div class="page-card-header">
      <div>
        <h2>首页配置</h2>
        <p>配置前台首页新闻栏目、排序、显示数量和更多链接，前台首页会自动读取这些配置。</p>
      </div>
      <el-button type="primary" @click="openCreate">新增首页栏目</el-button>
    </div>

    <el-table :data="sections" border>
      <el-table-column prop="title" label="栏目标题" min-width="140" />
      <el-table-column prop="icon" label="图标" width="80" />
      <el-table-column prop="categorySlug" label="绑定栏目 slug" width="140" />
      <el-table-column prop="articleLimit" label="显示条数" width="100" />
      <el-table-column prop="moreLink" label="更多链接" min-width="180" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }"><el-tag :type="row.visible ? 'success' : 'info'">{{ row.visible ? '显示' : '隐藏' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="removeSection(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑首页栏目' : '新增首页栏目'" width="640px">
      <el-form label-width="120px">
        <el-form-item label="栏目标题" required><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="图标"><el-input v-model="form.icon" placeholder="例如 📰 🚩 🌱" /></el-form-item>
        <el-form-item label="绑定文章栏目">
          <el-select v-model="form.categorySlug" clearable filterable placeholder="选择文章栏目" @change="handleCategoryChange">
            <el-option v-for="item in categories" :key="item.id" :label="`${item.name}（${item.slug}）`" :value="item.slug" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示条数"><el-input-number v-model="form.articleLimit" :min="1" :max="20" /></el-form-item>
        <el-form-item label="更多链接"><el-input v-model="form.moreLink" /></el-form-item>
        <el-form-item label="布局"><el-select v-model="form.layout"><el-option label="卡片" value="CARD" /><el-option label="列表" value="LIST" /></el-select></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
        <el-form-item label="是否显示"><el-switch v-model="form.visible" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSection">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-card { background: #fff; border-radius: 12px; padding: 18px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06); }
.page-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
.page-card-header h2 { margin: 0 0 6px; }
.page-card-header p { margin: 0; color: #667085; }
</style>
