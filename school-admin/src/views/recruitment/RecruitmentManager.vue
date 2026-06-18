<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { recruitmentsApi } from '../../api/recruitments'

const loading = ref(false)
const plans = ref([])
const keyword = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('新增招聘岗位')
const currentPlanId = ref(null)

const form = reactive({
  title: '',
  department: '',
  positionCount: 1,
  description: '',
  requirements: '',
  startTime: '',
  endTime: '',
  contact: '',
  attachment: '',
  sort: 0,
  status: 'ENABLED'
})

const rules = { title: [{ required: true, message: '请输入招聘岗位名称', trigger: 'blur' }] }
const formRef = ref(null)
const statusText = computed(() => ({ ENABLED: '启用', DISABLED: '停用' }))

const recordsDialogVisible = ref(false)
const recordsLoading = ref(false)
const currentPlan = ref(null)
const recordsKeyword = ref('')
const records = ref([])

const recordDialogVisible = ref(false)
const recordFormRef = ref(null)
const recordForm = reactive({
  applicantName: '',
  gender: '',
  phone: '',
  email: '',
  education: '',
  major: '',
  attachmentUrl: '',
  remark: ''
})

const recordRules = {
  applicantName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

function resetForm() {
  currentPlanId.value = null
  Object.assign(form, {
    title: '',
    department: '',
    positionCount: 1,
    description: '',
    requirements: '',
    startTime: '',
    endTime: '',
    contact: '',
    attachment: '',
    sort: 0,
    status: 'ENABLED'
  })
}

function resetRecordForm() {
  Object.assign(recordForm, {
    applicantName: '',
    gender: '',
    phone: '',
    email: '',
    education: '',
    major: '',
    attachmentUrl: '',
    remark: ''
  })
}

async function loadPlans() {
  loading.value = true
  try {
    plans.value = await recruitmentsApi.listPlans({ keyword: keyword.value })
  } finally {
    loading.value = false
  }
}

function openCreate() {
  resetForm()
  dialogTitle.value = '新增招聘岗位'
  dialogVisible.value = true
}

function openEdit(row) {
  resetForm()
  currentPlanId.value = row.id
  dialogTitle.value = '编辑招聘岗位'
  Object.assign(form, {
    title: row.title || '',
    department: row.department || '',
    positionCount: row.positionCount || 1,
    description: row.description || '',
    requirements: row.requirements || '',
    startTime: row.startTime ? row.startTime.slice(0, 10) : '',
    endTime: row.endTime ? row.endTime.slice(0, 10) : '',
    contact: row.contact || '',
    attachment: row.attachment || '',
    sort: row.sort || 0,
    status: row.status || 'ENABLED'
  })
  dialogVisible.value = true
}

async function submitForm() {
  await formRef.value?.validate()
  const payload = { ...form }
  if (currentPlanId.value) {
    await recruitmentsApi.updatePlan(currentPlanId.value, payload)
    ElMessage.success('更新成功')
  } else {
    await recruitmentsApi.createPlan(payload)
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  loadPlans()
}

async function removePlan(row) {
  await ElMessageBox.confirm(`确定删除招聘岗位“${row.title}”吗？`, '删除确认', { type: 'warning' })
  await recruitmentsApi.removePlan(row.id)
  ElMessage.success('删除成功')
  loadPlans()
}

async function openRecords(row) {
  currentPlan.value = row
  recordsKeyword.value = ''
  recordsDialogVisible.value = true
  await loadRecords()
}

async function loadRecords() {
  if (!currentPlan.value) return
  recordsLoading.value = true
  try {
    records.value = await recruitmentsApi.listRecords(currentPlan.value.id, { keyword: recordsKeyword.value })
  } finally {
    recordsLoading.value = false
  }
}

function openRecordCreate() {
  resetRecordForm()
  recordDialogVisible.value = true
}

async function submitRecordForm() {
  await recordFormRef.value?.validate()
  await recruitmentsApi.createRecord(currentPlan.value.id, { ...recordForm })
  ElMessage.success('投递记录创建成功')
  recordDialogVisible.value = false
  loadRecords()
  loadPlans()
}

async function removeRecord(row) {
  await ElMessageBox.confirm(`确定删除“${row.applicantName}”的投递记录吗？`, '删除确认', { type: 'warning' })
  await recruitmentsApi.removeRecord(row.id)
  ElMessage.success('删除成功')
  loadRecords()
  loadPlans()
}

function exportCsv() {
  const header = ['姓名', '性别', '电话', '邮箱', '学历', '专业', '附件', '备注', '提交时间']
  const rows = records.value.map((item) => [
    item.applicantName,
    item.gender || '',
    item.phone,
    item.email || '',
    item.education || '',
    item.major || '',
    item.attachmentUrl || '',
    item.remark || '',
    item.createdAt || ''
  ])
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${currentPlan.value?.title || '招聘投递名单'}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(loadPlans)
</script>

<template>
  <div class="page-card">
    <div class="toolbar">
      <div>
        <h2>招聘管理</h2>
        <p>管理招聘岗位、查看投递名单，并支持导出投递数据。</p>
      </div>
      <div class="toolbar-actions">
        <el-input v-model="keyword" placeholder="搜索招聘岗位" clearable style="width: 220px" @keyup.enter="loadPlans" />
        <el-button @click="loadPlans">搜索</el-button>
        <el-button type="primary" @click="openCreate">新增招聘岗位</el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="plans" border stripe>
      <el-table-column prop="title" label="招聘岗位" min-width="220" />
      <el-table-column prop="department" label="部门" min-width="130" />
      <el-table-column prop="positionCount" label="人数" width="90" />
      <el-table-column label="报名时间" min-width="220">
        <template #default="{ row }">{{ row.startTime ? row.startTime.slice(0, 10) : '不限' }} 至 {{ row.endTime ? row.endTime.slice(0, 10) : '不限' }}</template>
      </el-table-column>
      <el-table-column label="投递数" width="100"><template #default="{ row }">{{ row._count?.records || 0 }}</template></el-table-column>
      <el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="row.status === 'ENABLED' ? 'success' : 'info'">{{ statusText[row.status] || row.status }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="330" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openRecords(row)">查看投递</el-button><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link type="danger" @click="removePlan(row)">删除</el-button></template></el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="760px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="岗位名称" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="招聘部门"><el-input v-model="form.department" /></el-form-item>
        <el-form-item label="招聘人数"><el-input-number v-model="form.positionCount" :min="1" /></el-form-item>
        <el-form-item label="开始日期"><el-date-picker v-model="form.startTime" type="date" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="结束日期"><el-date-picker v-model="form.endTime" type="date" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="联系方式"><el-input v-model="form.contact" /></el-form-item>
        <el-form-item label="附件路径"><el-input v-model="form.attachment" placeholder="可填写 /uploads/... 文件路径" /></el-form-item>
        <el-form-item label="岗位说明"><el-input v-model="form.description" type="textarea" :rows="4" /></el-form-item>
        <el-form-item label="任职要求"><el-input v-model="form.requirements" type="textarea" :rows="4" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio label="ENABLED">启用</el-radio><el-radio label="DISABLED">停用</el-radio></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submitForm">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="recordsDialogVisible" :title="`投递名单：${currentPlan?.title || ''}`" width="1120px">
      <div class="toolbar small"><el-input v-model="recordsKeyword" placeholder="搜索姓名、电话、邮箱、专业" clearable style="width: 280px" @keyup.enter="loadRecords" /><el-button @click="loadRecords">搜索</el-button><el-button type="primary" @click="openRecordCreate">手动新增</el-button><el-button type="success" @click="exportCsv">导出 CSV</el-button></div>
      <el-table v-loading="recordsLoading" :data="records" border stripe height="420">
        <el-table-column prop="applicantName" label="姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="phone" label="电话" width="140" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="education" label="学历" width="100" />
        <el-table-column prop="major" label="专业" min-width="150" />
        <el-table-column label="附件" min-width="160"><template #default="{ row }"><a v-if="row.attachmentUrl" :href="row.attachmentUrl" target="_blank">查看附件</a><span v-else>-</span></template></el-table-column>
        <el-table-column prop="createdAt" label="提交时间" min-width="180" />
        <el-table-column label="操作" width="90" fixed="right"><template #default="{ row }"><el-button link type="danger" @click="removeRecord(row)">删除</el-button></template></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="recordDialogVisible" title="新增投递记录" width="640px">
      <el-form ref="recordFormRef" :model="recordForm" :rules="recordRules" label-width="100px">
        <el-form-item label="姓名" prop="applicantName"><el-input v-model="recordForm.applicantName" /></el-form-item>
        <el-form-item label="性别"><el-select v-model="recordForm.gender" clearable><el-option label="男" value="男" /><el-option label="女" value="女" /></el-select></el-form-item>
        <el-form-item label="联系电话" prop="phone"><el-input v-model="recordForm.phone" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="recordForm.email" /></el-form-item>
        <el-form-item label="学历"><el-input v-model="recordForm.education" /></el-form-item>
        <el-form-item label="专业"><el-input v-model="recordForm.major" /></el-form-item>
        <el-form-item label="附件路径"><el-input v-model="recordForm.attachmentUrl" placeholder="可填写 /uploads/... 文件路径" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="recordForm.remark" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="recordDialogVisible = false">取消</el-button><el-button type="primary" @click="submitRecordForm">保存</el-button></template>
    </el-dialog>
  </div>
</template>
