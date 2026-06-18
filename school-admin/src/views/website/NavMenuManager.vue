<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createCategoryApi, deleteCategoryApi, getCategoryTreeApi, updateCategoryApi } from '../../api/categories'
import { apiCategoryToTreeNode, flattenCategoryTree } from '../../api/adapters'

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const dialogMode = ref('add')
const parentForAdd = ref(null)
const currentRow = ref(null)
const treeData = ref([])

const form = reactive({
  id: '',
  name: '',
  slug: '',
  parentId: null,
  type: 'ARTICLE',
  path: '',
  sort: 0,
  status: 'ENABLED'
})

const parentOptions = computed(() => {
  const options = flattenCategoryTree(treeData.value)
    .filter((item) => item.value !== form.id)
    .map((item) => ({
      label: `${item.parentId ? '　└ ' : ''}${item.label}`,
      value: item.value
    }))

  return [{ label: '无，上级为一级导航', value: null }, ...options]
})

function makeSlug(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '') || `menu-${Date.now()}`
}

function defaultPath(type, slug) {
  if (type === 'LINK') return ''
  if (!slug) return ''
  return `/news?category=${slug}`
}

function resetForm() {
  Object.assign(form, {
    id: '',
    name: '',
    slug: '',
    parentId: null,
    type: 'ARTICLE',
    path: '',
    sort: 0,
    status: 'ENABLED'
  })
}

function toPayload() {
  const slug = form.slug || makeSlug(form.name)

  return {
    name: form.name.trim(),
    slug,
    parentId: form.parentId || null,
    sort: Number(form.sort || 0),
    status: form.status,
    type: form.type,
    path: form.path || defaultPath(form.type, slug)
  }
}

async function loadTree() {
  loading.value = true
  try {
    const data = await getCategoryTreeApi()
    treeData.value = data.map(apiCategoryToTreeNode)
  } finally {
    loading.value = false
  }
}

function openAddRoot() {
  dialogMode.value = 'add'
  parentForAdd.value = null
  currentRow.value = null
  resetForm()
  form.sort = treeData.value.length + 1
  dialogVisible.value = true
}

function openAddChild(row) {
  dialogMode.value = 'add'
  parentForAdd.value = row
  currentRow.value = null
  resetForm()
  form.parentId = row.id
  form.sort = (row.children?.length || 0) + 1
  dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'
  currentRow.value = row
  parentForAdd.value = null
  Object.assign(form, {
    id: row.id,
    name: row.label,
    slug: row.slug || '',
    parentId: row.parentId || null,
    type: row.rawType || (row.type === '自定义链接' ? 'LINK' : 'ARTICLE'),
    path: row.path || '',
    sort: row.sort || 0,
    status: row.rawStatus || (row.status === '停用' ? 'DISABLED' : 'ENABLED')
  })
  dialogVisible.value = true
}

async function saveMenu() {
  if (!form.name.trim()) {
    ElMessage.warning('请输入菜单名称')
    return
  }

  if (!form.slug.trim()) {
    form.slug = makeSlug(form.name)
  }

  saving.value = true
  try {
    if (dialogMode.value === 'add') {
      await createCategoryApi(toPayload())
      ElMessage.success('新增导航菜单成功')
    } else {
      await updateCategoryApi(form.id, toPayload())
      ElMessage.success('编辑导航菜单成功')
    }

    dialogVisible.value = false
    await loadTree()
  } finally {
    saving.value = false
  }
}

function toggleStatus(row) {
  const nextStatus = row.rawStatus === 'DISABLED' || row.status === '停用' ? 'ENABLED' : 'DISABLED'

  ElMessageBox.confirm(`确定${nextStatus === 'ENABLED' ? '启用' : '停用'}“${row.label}”吗？`, '状态确认', {
    type: 'warning'
  }).then(async () => {
    await updateCategoryApi(row.id, { status: nextStatus })
    ElMessage.success('状态已更新')
    await loadTree()
  })
}

function removeMenu(row) {
  ElMessageBox.confirm(`确定删除导航菜单“${row.label}”吗？如果存在下级菜单或文章，后端会阻止删除。`, '删除确认', {
    type: 'warning'
  }).then(async () => {
    await deleteCategoryApi(row.id)
    ElMessage.success('删除成功')
    await loadTree()
  })
}

function refresh() {
  loadTree()
  ElMessage.success('已刷新导航菜单')
}

onMounted(loadTree)
</script>

<template>
  <div class="page-card" v-loading="loading">
    <div class="toolbar">
      <div>
        <h2>导航菜单管理</h2>
        <p class="form-hint">超管可维护前台顶部一级菜单和二级下拉菜单。菜单数据来自栏目树，保存后前台刷新即可生效。</p>
      </div>
      <div class="toolbar-left">
        <el-button type="primary" @click="openAddRoot">新增一级菜单</el-button>
        <el-button @click="refresh">刷新</el-button>
      </div>
    </div>

    <el-alert
      title="说明：普通栏目默认跳转到 /news?category=栏目标识；自定义链接可跳转到 /admissions、/recruitment、/public-query、/leaders 或外部地址。"
      type="info"
      show-icon
      :closable="false"
      style="margin-bottom: 14px"
    />

    <el-table
      :data="treeData"
      row-key="id"
      border
      stripe
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="label" label="菜单名称" min-width="190" />
      <el-table-column prop="slug" label="栏目标识" min-width="160" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="path" label="跳转地址" min-width="220" show-overflow-tooltip />
      <el-table-column prop="sort" label="排序" width="90" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === '停用' ? 'info' : 'success'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="310" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openAddChild(row)">新增子菜单</el-button>
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link :type="row.status === '停用' ? 'success' : 'warning'" @click="toggleStatus(row)">
            {{ row.status === '停用' ? '启用' : '停用' }}
          </el-button>
          <el-button link type="danger" @click="removeMenu(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增导航菜单' : '编辑导航菜单'" width="640px">
      <el-form label-width="120px">
        <el-form-item label="菜单名称" required>
          <el-input v-model="form.name" placeholder="例如：集团动态、集团新闻" />
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" clearable filterable style="width: 100%">
            <el-option v-for="item in parentOptions" :key="String(item.value)" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="栏目标识" required>
          <el-input v-model="form.slug" placeholder="例如 group-news，不填可按名称自动生成" />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.type">
            <el-radio-button label="ARTICLE">普通栏目</el-radio-button>
            <el-radio-button label="LINK">自定义链接</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="跳转地址">
          <el-input v-model="form.path" placeholder="普通栏目可留空；自定义链接填写 /admissions 或 https://..." />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio-button label="ENABLED">启用</el-radio-button>
            <el-radio-button label="DISABLED">停用</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveMenu">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
