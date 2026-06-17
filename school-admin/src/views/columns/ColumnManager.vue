<script setup>
import { reactive, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { categoryTree } from '../../data/mockData'
import { createId } from '../../utils/storage'

const treeData = ref(JSON.parse(JSON.stringify(categoryTree)))
const selectedNode = ref(treeData.value[0])
const dialogVisible = ref(false)
const dialogMode = ref('add')
const form = reactive({ id: '', label: '', type: '普通栏目', path: '', sort: 1, status: '启用' })

const childColumns = computed(() => selectedNode.value?.children || [])

function handleNodeClick(node) {
  selectedNode.value = node
}

function openAdd() {
  dialogMode.value = 'add'
  Object.assign(form, { id: '', label: '', type: '普通栏目', path: '', sort: childColumns.value.length + 1, status: '启用' })
  dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'
  Object.assign(form, { id: row.id, label: row.label, type: row.type || '普通栏目', path: row.path || '', sort: row.sort || 1, status: row.status || '启用' })
  dialogVisible.value = true
}

function openView(row) {
  dialogMode.value = 'view'
  Object.assign(form, { id: row.id, label: row.label, type: row.type || '普通栏目', path: row.path || '', sort: row.sort || 1, status: row.status || '启用' })
  dialogVisible.value = true
}

function saveColumn() {
  if (!form.label.trim()) {
    ElMessage.warning('请填写栏目名称')
    return
  }

  if (dialogMode.value === 'add') {
    if (!selectedNode.value.children) selectedNode.value.children = []
    selectedNode.value.children.push({ ...form, id: createId('column') })
    ElMessage.success('新增栏目成功')
  } else {
    const target = childColumns.value.find((item) => item.id === form.id)
    if (target) Object.assign(target, form)
    ElMessage.success('编辑栏目成功')
  }

  dialogVisible.value = false
}

function removeColumn(row) {
  if (row.type === '自定义链接') {
    ElMessage.warning('自定义链接栏目属于特殊栏目，不建议自行删除')
    return
  }

  ElMessageBox.confirm(`确定删除栏目“${row.label}”吗？`, '删除确认', { type: 'warning' }).then(() => {
    selectedNode.value.children = childColumns.value.filter((item) => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}

function refresh() {
  ElMessage.success('已刷新栏目列表')
}
</script>

<template>
  <div class="two-column-page">
    <div class="page-card tree-card">
      <h3>栏目结构</h3>
      <p class="form-hint">选择左侧栏目后，右侧展示它的下级栏目列表。</p>
      <el-tree :data="treeData" node-key="id" default-expand-all highlight-current :props="{ label: 'label', children: 'children' }" @node-click="handleNodeClick" />
    </div>

    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="openAdd">新增</el-button>
          <el-button @click="refresh">刷新</el-button>
        </div>
        <div class="toolbar-right">
          当前栏目：<el-tag>{{ selectedNode?.label }}</el-tag>
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
        <el-form-item label="栏目类型">
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="普通栏目" value="普通栏目" />
            <el-option label="自定义链接" value="自定义链接" />
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址"><el-input v-model="form.path" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="1" /></el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status"><el-radio-button label="启用" /><el-radio-button label="停用" /></el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button v-if="dialogMode !== 'view'" type="primary" @click="saveColumn">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
