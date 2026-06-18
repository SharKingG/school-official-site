<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { publicQueryApi } from '../../api/publicQuery'

const loading = ref(false)
const projects = ref([])
const keyword = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('新增查询项目')
const currentProjectId = ref(null)
const formRef = ref(null)

const form = reactive({
  title: '',
  description: '',
  queryFields: 'name,idCard',
  sort: 0,
  status: 'ENABLED'
})

const rules = { title: [{ required: true, message: '请输入查询项目名称', trigger: 'blur' }] }

const recordsDialogVisible = ref(false)
const recordsLoading = ref(false)
const currentProject = ref(null)
const recordsKeyword = ref('')
const records = ref([])

const recordDialogVisible = ref(false)
const recordFormRef = ref(null)
const editingRecordId = ref(null)
const recordForm = reactive({
  name: '',
  idCard: '',
  ticketNo: '',
  resultTitle: '',
  resultContent: '',
  fileUrl: ''
})

const recordRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  resultTitle: [{ required: true, message: '请输入查询结果标题', trigger: 'blur' }]
}

function resetProjectForm() {
  currentProjectId.value = null
  Object.assign(form, {
    title: '',
    description: '',
    queryFields: 'name,idCard',
    sort: 0,
    status: 'ENABLED'
  })
}

function resetRecordForm() {
  editingRecordId.value = null
  Object.assign(recordForm, {
    name: '',
    idCard: '',
    ticketNo: '',
    resultTitle: '',
    resultContent: '',
    fileUrl: ''
  })
}

async function loadProjects() {
  loading.value = true
  try {
    projects.value = await publicQueryApi.listProjects({ keyword: keyword.value })
  } finally {
    loading.value = false
  }
}

function openCreate() {
  resetProjectForm()
  dialogTitle.value = '新增查询项目'
  dialogVisible.value = true
}

function openEdit(row) {
  resetProjectForm()
  currentProjectId.value = row.id
  dialogTitle.value = '编辑查询项目'
  Object.assign(form, {
    title: row.title || '',
    description: row.description || '',
    queryFields: row.queryFields || 'name,idCard',
    sort: row.sort || 0,
    status: row.status || 'ENABLED'
  })
  dialogVisible.value = true
}

async function submitProjectForm() {
  await formRef.value?.validate()
  if (currentProjectId.value) {
    await publicQueryApi.updateProject(currentProjectId.value, { ...form })
    ElMessage.success('更新成功')
  } else {
    await publicQueryApi.createProject({ ...form })
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  loadProjects()
}

async function removeProject(row) {
  await ElMessageBox.confirm(`确定删除查询项目“${row.title}”吗？`, '删除确认', { type: 'warning' })
  await publicQueryApi.removeProject(row.id)
  ElMessage.success('删除成功')
  loadProjects()
}

async function openRecords(row) {
  currentProject.value = row
  recordsKeyword.value = ''
  recordsDialogVisible.value = true
  await loadRecords()
}

async function loadRecords() {
  if (!currentProject.value) return
  recordsLoading.value = true
  try {
    records.value = await publicQueryApi.listRecords(currentProject.value.id, { keyword: recordsKeyword.value })
  } finally {
    recordsLoading.value = false
  }
}

function openRecordCreate() {
  resetRecordForm()
  recordDialogVisible.value = true
}

function openRecordEdit(row) {
  resetRecordForm()
  editingRecordId.value = row.id
  Object.assign(recordForm, {
    name: row.name || '',
    idCard: row.idCard || '',
    ticketNo: row.ticketNo || '',
    resultTitle: row.resultTitle || '',
    resultContent: row.resultContent || '',
    fileUrl: row.fileUrl || ''
  })
  recordDialogVisible.value = true
}

async function submitRecordForm() {
  await recordFormRef.value?.validate()
  if (editingRecordId.value) {
    await publicQueryApi.updateRecord(editingRecordId.value, { ...recordForm })
    ElMessage.success('更新成功')
  } else {
    await publicQueryApi.createRecord(currentProject.value.id, { ...recordForm })
    ElMessage.success('创建成功')
  }
  recordDialogVisible.value = false
  loadRecords()
  loadProjects()
}

async function removeRecord(row) {
  await ElMessageBox.confirm(`确定删除“${row.name}”的查询数据吗？`, '删除确认', { type: 'warning' })
  await publicQueryApi.removeRecord(row.id)
  ElMessage.success('删除成功')
  loadRecords()
  loadProjects()
}

function exportCsv() {
  const header = ['姓名', '身份证号', '准考证号', '结果标题', '结果内容', '文件路径', '创建时间']
  const rows = records.value.map((item) => [item.name, item.idCard || '', item.ticketNo || '', item.resultTitle, item.resultContent || '', item.fileUrl || '', item.createdAt || ''])
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${currentProject.value?.title || '公共查询数据'}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(loadProjects)
</script>

<template>
  <div class="page-card">
    <div class="toolbar">
      <div>
        <h2>公共查询</h2>
        <p>管理录取查询、成绩查询、分班查询等项目和查询结果数据。</p>
      </div>
      <div class="toolbar-actions">
        <el-input v-model="keyword" placeholder="搜索查询项目" clearable style="width: 220px" @keyup.enter="loadProjects" />
        <el-button @click="loadProjects">搜索</el-button>
        <el-button type="primary" @click="openCreate">新增查询项目</el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="projects" border stripe>
      <el-table-column prop="title" label="查询项目" min-width="220" />
      <el-table-column prop="description" label="说明" min-width="240" show-overflow-tooltip />
      <el-table-column prop="queryFields" label="查询字段" width="150" />
      <el-table-column label="数据量" width="100"><template #default="{ row }">{{ row._count?.records || 0 }}</template></el-table-column>
      <el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="row.status === 'ENABLED' ? 'success' : 'info'">{{ row.status === 'ENABLED' ? '启用' : '停用' }}</el-tag></template></el-table-column>
      <el-table-column prop="sort" label="排序" width="90" />
      <el-table-column label="操作" width="340" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openRecords(row)">查询数据</el-button><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link type="danger" @click="removeProject(row)">删除</el-button></template></el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="项目名称" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="项目说明"><el-input v-model="form.description" type="textarea" :rows="4" /></el-form-item>
        <el-form-item label="查询字段"><el-input v-model="form.queryFields" placeholder="例如：name,idCard 或 name,ticketNo" /></el-form-item>
        <el-form-item label="提示"><span style="color:#888">可填 name、idCard、ticketNo，用英文逗号分隔。</span></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio label="ENABLED">启用</el-radio><el-radio label="DISABLED">停用</el-radio></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submitProjectForm">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="recordsDialogVisible" :title="`查询数据：${currentProject?.title || ''}`" width="1120px">
      <div class="toolbar small"><el-input v-model="recordsKeyword" placeholder="搜索姓名、身份证、准考证号、结果" clearable style="width: 300px" @keyup.enter="loadRecords" /><el-button @click="loadRecords">搜索</el-button><el-button type="primary" @click="openRecordCreate">新增数据</el-button><el-button type="success" @click="exportCsv">导出 CSV</el-button></div>
      <el-table v-loading="recordsLoading" :data="records" border stripe height="420">
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="idCard" label="身份证号" min-width="180" />
        <el-table-column prop="ticketNo" label="准考证号" width="140" />
        <el-table-column prop="resultTitle" label="结果标题" min-width="160" />
        <el-table-column prop="resultContent" label="结果内容" min-width="220" show-overflow-tooltip />
        <el-table-column label="文件" min-width="140"><template #default="{ row }"><a v-if="row.fileUrl" :href="row.fileUrl" target="_blank">下载</a><span v-else>-</span></template></el-table-column>
        <el-table-column label="操作" width="140" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openRecordEdit(row)">编辑</el-button><el-button link type="danger" @click="removeRecord(row)">删除</el-button></template></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="recordDialogVisible" :title="editingRecordId ? '编辑查询数据' : '新增查询数据'" width="680px">
      <el-form ref="recordFormRef" :model="recordForm" :rules="recordRules" label-width="110px">
        <el-form-item label="姓名" prop="name"><el-input v-model="recordForm.name" /></el-form-item>
        <el-form-item label="身份证号"><el-input v-model="recordForm.idCard" /></el-form-item>
        <el-form-item label="准考证号"><el-input v-model="recordForm.ticketNo" /></el-form-item>
        <el-form-item label="结果标题" prop="resultTitle"><el-input v-model="recordForm.resultTitle" /></el-form-item>
        <el-form-item label="结果内容"><el-input v-model="recordForm.resultContent" type="textarea" :rows="4" /></el-form-item>
        <el-form-item label="文件路径"><el-input v-model="recordForm.fileUrl" placeholder="可填写 /uploads/... 文件路径" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="recordDialogVisible = false">取消</el-button><el-button type="primary" @click="submitRecordForm">保存</el-button></template>
    </el-dialog>
  </div>
</template>
