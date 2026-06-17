<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createCategoryApi, deleteCategoryApi, getCategoryTreeApi, updateCategoryApi } from '../../api/categories'
import { apiCategoryToTreeNode } from '../../api/adapters'

const treeData = ref([])
const selectedNode = ref(null)
const dialogVisible = ref(false)
const dialogMode = ref('add')
const loading = ref(false)
const saving = ref(false)

const form = reactive({
  id: '',
  label: '',
  slug: '',
  type: '普通栏目',
  path: '',
  sort: 1,
  status: '启用'
})

const childColumns = computed(() => selectedNode.value?.children || [])

function makeSlug(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '') || `category-${Date.now()}`
}

function toApiPayload() {
  return {
    name: form.label,
    slug: form.slug || makeSlug(form.label),
    parentId: dialogMode.value === 'add' ? selectedNode.value?.id || null : selectedNode.value?.id || null,
    sort: Number(form.sort || 0),
    status: form.status === '停用' ? 'DISABLED' : 'ENABLED',
    type: form.type === '自定义链接' ? 'LINK' : 'ARTICLE',
    path: form.path || ''
  }
}

async function loadTree() {
  loading.value = true

  try {
    const data = await getCategoryTreeApi()
    treeData.value = data.map(apiCategoryToTreeNode)
    selectedNode.value = selectedNode.value
      ? findNode(treeData.value, selectedNode.value.id) || treeData.value[0]
      : treeData.value[0]
  } finally {
    loading.value = false
  }
}

function findNode(list, id) {
  for (const item of list) {
    if (item.id === id) return item
    const child = findNode(item.children || [], id)
    if (child) return child
  }
  return null
}

function handleNodeClick(node) {
  selectedNode.value = node
}

function openAdd() {
  if (!selectedNode.value) {
    ElMessage.warning('请先选择一个父栏目')
    return
  }

  dialogMode.value = 'add'
  Object.assign(form, {
    id: '',
    label: '',
    slug: '',
    type: '普通栏目',
    path: '',
    sort: childColumns.value.length + 1,
    status: '启用'
  })
  dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'
  Object.assign(form, {
    id: row.id,
    label: row.label,
    slug: row.slug || '',
    type: row.type || '普通栏目',
    path: row.path || '',
    sort: row.sort || 1,
    status: row.status || '启用'
  })
  dialogVisible.value = true
}

function openView(row) {
  dialogMode.value = 'view'
  Object.assign(form, {
    id: row.id,
    label: row.label,
    slug: row.slug || '',
    type: row.type || '普通栏目',
    path: row.path || '',
    sort: row.sort || 1,
    status: row.status || '启用'
  })
  dialogVisible.value = true
}

async function saveColumn() {
  if (!form.label.trim()) {
    ElMessage.warning('请填写栏目名称')
    return
  }

  saving.value = true

  try {
    if (dialogMode.value === 'add') {
      await createCategoryApi(toApiPayload())
      ElMessage.success('新增栏目成功')
    } else {
      await updateCategoryApi(form.id, {
        ...toApiPayload(),
        parentId: undefined
      })
      ElMessage.success('编辑栏目成功')
    }

    dialogVisible.value = false
    await loadTree()
  } finally {
    saving.value = false
  }
}

function removeColumn(row) {
  if (row.type === '自定义链接') {
    ElMessage.warning('自定义链接栏目属于特殊栏目，不建议自行删除')
    return
  }

  ElMessageBox.confirm(`确定删除栏目“${row.label}”吗？如果该栏目存在文章或下级栏目，后端会阻止删除。`, '删除确认', {
    type: 'warning'
  }).then(async () => {
    await deleteCategoryApi(row.id)
    ElMessage.success('删除成功')
    await loadTree()
  })
}

function refresh() {
  loadTree()
  ElMessage.success('已刷新栏目列表')
}

onMounted(loadTree)
</script>

<template>
  <div class="two-column-page" v-loading="loading">
    <div class="page-card tree-card">
      <h3>栏目结构</h3>
      <p class="form-hint">选择左侧栏目后，右侧展示它的下级栏目列表。当前数据来自 MySQL。</p>
      <el-tree
        :data="treeData"
        node-key="id"
        default-expand-all
        highlight-current
        :props="{ label: 'label', children: 'children' }"
        @node-click="handleNodeClick"
      />
    </div>

    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="openAdd">新增</el-button>
          <el-button @click="refresh">刷新</el-button>
        </div>
        <div class="toolbar-right">
          当前栏目：<el-tag>{{ selectedNode?.label || '未选择' }}</el-tag>
        </div>
      </div>

      <el-alert
        title="注意：栏目类型为“自定义链接”的菜单属于特殊栏目，不建议自行编辑改动。"
        type="warning"
        show-icon
        :closable="false"
        style="margin-bottom: 14px"
      />

      <el-table :data="childColumns" border stripe>
        <el-table-column prop="label" label="栏目名称" min-width="180" />
        <el-table-column prop="slug" label="栏目标识" min-width="160" />
        <el-table-column prop="type" label="栏目类型" width="130" />
        <el-table-column prop="path" label="链接地址" min-width="180" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === '停用' ? 'info' : 'success'">{{ row.status || '启用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openView(row)">查看</el-button>
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="removeColumn(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增栏目' : dialogMode === 'edit' ? '编辑栏目' : '查看栏目'" width="560px">
      <el-form label-width="100px" :disabled="dialogMode === 'view'">
        <el-form-item label="栏目名称" required><el-input v-model="form.label" /></el-form-item>
        <el-form-item label="栏目标识" required><el-input v-model="form.slug" placeholder="例如 campus-news，不填则自动生成" /></el-form-item>
        <el-form-item label="栏目类型">
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="普通栏目" value="普通栏目" />
            <el-option label="自定义链接" value="自定义链接" />
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址"><el-input v-model="form.path" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status"><el-radio-button label="启用" /><el-radio-button label="停用" /></el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button v-if="dialogMode !== 'view'" type="primary" :loading="saving" @click="saveColumn">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
