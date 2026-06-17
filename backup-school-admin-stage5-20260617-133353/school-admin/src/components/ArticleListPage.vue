<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { readStorage, writeStorage } from '../utils/storage'
import { initialArticles, flatCategories } from '../data/mockData'

const props = defineProps({
  scope: {
    type: String,
    default: 'all'
  }
})

const keyword = ref('')
const category = ref('')
const status = ref('')
const articles = ref(readStorage('school_admin_articles', initialArticles))
const dialogVisible = ref(false)
const dialogMode = ref('edit')

const form = reactive({
  id: '',
  title: '',
  category: '',
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
  content: ''
})

const filteredArticles = computed(() => {
  return articles.value.filter((item) => {
    const keywordMatched = !keyword.value || item.title.includes(keyword.value) || item.author.includes(keyword.value)
    const categoryMatched = !category.value || item.category === category.value
    const statusMatched = !status.value || item.status === status.value
    const scopeMatched = props.scope === 'all' || item.author === '管理员'
    return keywordMatched && categoryMatched && statusMatched && scopeMatched
  })
})

function saveAll() {
  writeStorage('school_admin_articles', articles.value)
}

function resetFilters() {
  keyword.value = ''
  category.value = ''
  status.value = ''
}

function openDialog(row, mode) {
  dialogMode.value = mode
  Object.assign(form, row)
  dialogVisible.value = true
}

function saveDialog() {
  const option = flatCategories.find((item) => item.value === form.category)
  form.categoryName = option?.label || form.categoryName
  const index = articles.value.findIndex((item) => item.id === form.id)

  if (index >= 0) {
    articles.value[index] = { ...form }
    saveAll()
    ElMessage.success('保存成功')
    dialogVisible.value = false
  }
}

function removeArticle(row) {
  ElMessageBox.confirm(`确定删除文章“${row.title}”吗？`, '删除确认', {
    type: 'warning'
  }).then(() => {
    articles.value = articles.value.filter((item) => item.id !== row.id)
    saveAll()
    ElMessage.success('删除成功')
  })
}

function toggleTop(row) {
  row.isTop = !row.isTop
  saveAll()
  ElMessage.success(row.isTop ? '已置顶' : '已取消置顶')
}

function refresh() {
  articles.value = readStorage('school_admin_articles', initialArticles)
  ElMessage.success('已刷新')
}

function tableRowClassName({ row }) {
  if (row.status === '待审核') return 'warning-row'
  if (row.status === '已发布') return 'success-row'
  return ''
}
</script>

<template>
  <div>
    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input v-model="keyword" placeholder="请输入文章标题或作者" clearable style="width: 240px" />
          <el-select v-model="category" placeholder="发布栏目" clearable style="width: 180px">
            <el-option v-for="item in flatCategories" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="status" placeholder="文章状态" clearable style="width: 150px">
            <el-option label="草稿" value="草稿" />
            <el-option label="待审核" value="待审核" />
            <el-option label="已发布" value="已发布" />
            <el-option label="已下架" value="已下架" />
          </el-select>
          <el-button type="primary">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
        <div class="toolbar-right">
          <el-button @click="refresh">刷新</el-button>
        </div>
      </div>

      <el-table :data="filteredArticles" border stripe :row-class-name="tableRowClassName">
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
        <el-table-column label="操作" fixed="right" width="260">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDialog(row, 'view')">查看</el-button>
            <el-button link type="primary" @click="openDialog(row, 'edit')">编辑</el-button>
            <el-button v-if="scope === 'all'" link type="warning" @click="toggleTop(row)">
              {{ row.isTop ? '取消置顶' : '置顶' }}
            </el-button>
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
          <el-select v-model="form.category" style="width: 100%">
            <el-option v-for="item in flatCategories" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-form-item label="附件名称">
          <el-input v-model="form.attachmentName" />
        </el-form-item>
        <el-form-item label="文章内容">
          <el-input v-model="form.content" type="textarea" :rows="8" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button v-if="dialogMode !== 'view'" type="primary" @click="saveDialog">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
