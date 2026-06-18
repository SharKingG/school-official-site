<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { approveArticleApi, deleteArticleApi, getArticlesApi, offlineArticleApi, rejectArticleApi, submitArticleReviewApi, updateArticleApi, updateArticleTopApi } from '../api/articles'
import { getCategoryTreeApi } from '../api/categories'
import { adminArticleToApi, apiArticleToAdmin, flattenCategoryTree } from '../api/adapters'

const props = defineProps({
  scope: {
    type: String,
    default: 'all'
  }
})

const keyword = ref('')
const category = ref('')
const status = ref(props.scope === 'review' ? '待审核' : '')
const articles = ref([])
const categoryOptions = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const dialogMode = ref('edit')

const form = reactive({
  id: '',
  title: '',
  category: '',
  categoryId: '',
  categoryName: '',
  type: '普通文章',
  status: '草稿',
  author: '管理员',
  department: '',
  source: '学校官网',
  publishTime: '',
  isTop: false,
  linkUrl: '',
  listImage: '',
  headerImage: '',
  carouselImage: '',
  attachmentName: '',
  summary: '',
  content: ''
})

const filteredArticles = computed(() => articles.value)

function apiStatusValue() {
  const map = {
    草稿: 'DRAFT',
    待审核: 'PENDING',
    已发布: 'PUBLISHED',
    已下架: 'OFFLINE'
  }
  return status.value ? map[status.value] : ''
}

async function loadCategories() {
  const tree = await getCategoryTreeApi()
  categoryOptions.value = flattenCategoryTree(tree)
}

async function loadArticles() {
  loading.value = true

  try {
    const data = await getArticlesApi({
      page: 1,
      pageSize: 100,
      keyword: keyword.value,
      categoryId: category.value || undefined,
      status: apiStatusValue() || undefined
    })

    articles.value = (data.list || []).map(apiArticleToAdmin)
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  keyword.value = ''
  category.value = ''
  status.value = ''
  loadArticles()
}

function openDialog(row, mode) {
  dialogMode.value = mode
  Object.assign(form, row, {
    category: row.categoryId || row.category
  })
  dialogVisible.value = true
}

async function saveDialog() {
  if (!form.title.trim()) {
    ElMessage.warning('请填写文章标题')
    return
  }

  if (!form.category) {
    ElMessage.warning('请选择发布栏目')
    return
  }

  saving.value = true

  try {
    await updateArticleApi(form.id, adminArticleToApi(form, form.status))
    ElMessage.success('保存成功')
    dialogVisible.value = false
    await loadArticles()
  } finally {
    saving.value = false
  }
}

function removeArticle(row) {
  ElMessageBox.confirm(`确定删除文章“${row.title}”吗？`, '删除确认', {
    type: 'warning'
  }).then(async () => {
    await deleteArticleApi(row.id)
    ElMessage.success('删除成功')
    await loadArticles()
  })
}

async function toggleTop(row) {
  await updateArticleTopApi(row.id, !row.isTop)
  ElMessage.success(row.isTop ? '已取消置顶' : '已置顶')
  await loadArticles()
}

async function submitReview(row) {
  await submitArticleReviewApi(row.id, '管理员提交审核')
  ElMessage.success('已提交审核')
  await loadArticles()
}

function approveArticle(row) {
  ElMessageBox.prompt(`请输入文章“${row.title}”的审核意见`, '审核通过', {
    inputValue: '审核通过，同意发布',
    inputType: 'textarea'
  }).then(async ({ value }) => {
    await approveArticleApi(row.id, value)
    ElMessage.success('审核通过，文章已发布')
    await loadArticles()
  })
}

function rejectArticle(row) {
  ElMessageBox.prompt(`请输入文章“${row.title}”的驳回原因`, '审核驳回', {
    inputValue: '请修改后重新提交',
    inputType: 'textarea'
  }).then(async ({ value }) => {
    await rejectArticleApi(row.id, value)
    ElMessage.success('已驳回，文章退回草稿')
    await loadArticles()
  })
}

function offlineArticle(row) {
  ElMessageBox.prompt(`请输入文章“${row.title}”的下线原因`, '文章下线', {
    inputValue: '内容调整，暂时下线',
    inputType: 'textarea'
  }).then(async ({ value }) => {
    await offlineArticleApi(row.id, value)
    ElMessage.success('文章已下线')
    await loadArticles()
  })
}

function refresh() {
  loadArticles()
  ElMessage.success('已刷新')
}

function tableRowClassName({ row }) {
  if (row.status === '待审核') return 'warning-row'
  if (row.status === '已发布') return 'success-row'
  return ''
}

onMounted(async () => {
  await loadCategories()
  await loadArticles()
})
</script>

<template>
  <div>
    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input v-model="keyword" placeholder="请输入文章标题或作者" clearable style="width: 240px" @keyup.enter="loadArticles" />
          <el-select v-model="category" placeholder="发布栏目" clearable filterable style="width: 180px">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="status" placeholder="文章状态" clearable style="width: 150px">
            <el-option label="草稿" value="草稿" />
            <el-option label="待审核" value="待审核" />
            <el-option label="已发布" value="已发布" />
            <el-option label="已下架" value="已下架" />
          </el-select>
          <el-button type="primary" @click="loadArticles">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
        <div class="toolbar-right">
          <el-button @click="refresh">刷新</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="filteredArticles" border stripe :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="45" />
        <el-table-column prop="title" label="文章标题" min-width="260" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="栏目" width="110" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="author" label="作者" width="90" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已发布' ? 'success' : row.status === '待审核' ? 'warning' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="170" />
        <el-table-column label="置顶" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.isTop" type="danger">置顶</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="360">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDialog(row, 'view')">查看</el-button>
            <el-button link type="primary" @click="openDialog(row, 'edit')">编辑</el-button>
            <el-button v-if="row.status === '草稿' || row.status === '已下架'" link type="warning" @click="submitReview(row)">提交审核</el-button>
            <el-button v-if="row.status === '待审核'" link type="success" @click="approveArticle(row)">通过</el-button>
            <el-button v-if="row.status === '待审核'" link type="danger" @click="rejectArticle(row)">驳回</el-button>
            <el-button v-if="row.status === '已发布'" link type="warning" @click="offlineArticle(row)">下线</el-button>
            <el-button v-if="scope === 'all'" link type="warning" @click="toggleTop(row)">{{ row.isTop ? '取消置顶' : '置顶' }}</el-button>
            <el-button link type="danger" @click="removeArticle(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogMode === 'view' ? '查看文章' : '编辑文章'" width="860px">
      <el-form label-width="110px" :disabled="dialogMode === 'view'">
        <el-form-item label="文章标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="发布栏目">
          <el-select v-model="form.category" filterable style="width: 100%">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="草稿" value="草稿" />
            <el-option label="待审核" value="待审核" />
            <el-option label="已发布" value="已发布" />
            <el-option label="已下架" value="已下架" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章摘要">
          <el-input v-model="form.summary" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="文章来源">
          <el-input v-model="form.source" />
        </el-form-item>
        <el-form-item label="所属部门">
          <el-input v-model="form.department" />
        </el-form-item>
        <el-form-item label="文章作者">
          <el-input v-model="form.author" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="form.linkUrl" placeholder="外链文章可填写链接地址" />
        </el-form-item>
        <el-form-item label="文章列表图">
          <el-input v-model="form.listImage" placeholder="例如 /images/feature-news.svg" />
        </el-form-item>
        <el-form-item label="正文头图">
          <el-input v-model="form.headerImage" />
        </el-form-item>
        <el-form-item label="文章内容">
          <el-input v-model="form.content" type="textarea" :rows="8" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button v-if="dialogMode !== 'view'" type="primary" :loading="saving" @click="saveDialog">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
