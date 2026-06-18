<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { admissionsApi } from '../../api/admissions'

const loading = ref(false)
const plans = ref([])
const keyword = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('新增招生计划')
const currentPlanId = ref(null)

const form = reactive({
  title: '',
  description: '',
  target: '',
  startTime: '',
  endTime: '',
  contact: '',
  attachment: '',
  sort: 0,
  status: 'ENABLED'
})

const rules = {
  title: [{ required: true, message: '请输入招生计划名称', trigger: 'blur' }]
}

const formRef = ref(null)

const recordsDialogVisible = ref(false)
const recordsLoading = ref(false)
const currentPlan = ref(null)
const recordsKeyword = ref('')
const records = ref([])

const recordDialogVisible = ref(false)
const recordFormRef = ref(null)
const recordForm = reactive({
  studentName: '',
  gender: '',
  idCard: '',
  phone: '',
  school: '',
  grade: '',
  score: '',
  remark: ''
})

const recordRules = {
  studentName: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

const statusText = computed(() => ({ ENABLED: '启用', DISABLED: '停用' }))

function resetForm() {
  currentPlanId.value = null
  Object.assign(form, {
    title: '',
    description: '',
    target: '',
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
    studentName: '',
    gender: '',
    idCard: '',
    phone: '',
    school: '',
    grade: '',
    score: '',
    remark: ''
  })
}

async function loadPlans() {
  loading.value = true
  try {
    plans.value = await admissionsApi.listPlans({ keyword: keyword.value })
  } finally {
    loading.value = false
  }
}

function openCreate() {
  resetForm()
  dialogTitle.value = '新增招生计划'
  dialogVisible.value = true
}

function openEdit(row) {
  resetForm()
  currentPlanId.value = row.id
  dialogTitle.value = '编辑招生计划'
  Object.assign(form, {
    title: row.title || '',
    description: row.description || '',
    target: row.target || '',
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
    await admissionsApi.updatePlan(currentPlanId.value, payload)
    ElMessage.success('更新成功')
  } else {
    await admissionsApi.createPlan(payload)
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  loadPlans()
}

async function removePlan(row) {
  await ElMessageBox.confirm(`确定删除招生计划“${row.title}”吗？`, '删除确认', { type: 'warning' })
  await admissionsApi.removePlan(row.id)
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
    records.value = await admissionsApi.listRecords(currentPlan.value.id, {
      keyword: recordsKeyword.value
    })
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
  await admissionsApi.createRecord(currentPlan.value.id, { ...recordForm })
  ElMessage.success('报名记录创建成功')
  recordDialogVisible.value = false
  loadRecords()
  loadPlans()
}

async function removeRecord(row) {
  await ElMessageBox.confirm(`确定删除“${row.studentName}”的报名记录吗？`, '删除确认', { type: 'warning' })
  await admissionsApi.removeRecord(row.id)
  ElMessage.success('删除成功')
  loadRecords()
  loadPlans()
}

function exportCsv() {
  const header = ['学生姓名', '性别', '身份证号', '电话', '毕业学校', '年级', '成绩', '备注', '提交时间']
  const rows = records.value.map((item) => [
    item.studentName,
    item.gender || '',
    item.idCard,
    item.phone,
    item.school || '',
    item.grade || '',
    item.score || '',
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
  link.download = `${currentPlan.value?.title || '招生报名名单'}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(loadPlans)
</script>

<template>
  <div class="page-card">
    <div class="toolbar">
      <div>
        <h2>招生管理</h2>
        <p>管理招生计划、查看报名名单，并支持导出报名数据。</p>
      </div>
      <div class="toolbar-actions">
        <el-input v-model="keyword" placeholder="搜索招生计划" clearable style="width: 220px" @keyup.enter="loadPlans" />
        <el-button @click="loadPlans">搜索</el-button>
        <el-button type="primary" @click="openCreate">新增招生计划</el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="plans" border stripe>
      <el-table-column prop="title" label="招生计划" min-width="220" />
      <el-table-column prop="target" label="招生对象" min-width="140" />
      <el-table-column label="报名时间" min-width="220">
        <template #default="{ row }">
          {{ row.startTime ? row.startTime.slice(0, 10) : '不限' }} 至 {{ row.endTime ? row.endTime.slice(0, 10) : '不限' }}
        </template>
      </el-table-column>
      <el-table-column label="报名数" width="100">
        <template #default="{ row }">{{ row._count?.records || 0 }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ENABLED' ? 'success' : 'info'">{{ statusText[row.status] || row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="90" />
      <el-table-column label="操作" width="330" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openRecords(row)">查看报名</el-button>
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="removePlan(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="720px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="计划名称" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="招生对象"><el-input v-model="form.target" /></el-form-item>
        <el-form-item label="开始日期"><el-date-picker v-model="form.startTime" type="date" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="结束日期"><el-date-picker v-model="form.endTime" type="date" value-format="YYYY-MM-DD" /></el-form-item>
        <el-form-item label="咨询方式"><el-input v-model="form.contact" /></el-form-item>
        <el-form-item label="附件路径"><el-input v-model="form.attachment" placeholder="可填写 /uploads/... 文件路径" /></el-form-item>
        <el-form-item label="计划说明"><el-input v-model="form.description" type="textarea" :rows="5" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio label="ENABLED">启用</el-radio><el-radio label="DISABLED">停用</el-radio></el-radio-group></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="recordsDialogVisible" :title="`报名名单：${currentPlan?.title || ''}`" width="1100px">
      <div class="toolbar small">
        <el-input v-model="recordsKeyword" placeholder="搜索姓名、身份证、电话、学校" clearable style="width: 280px" @keyup.enter="loadRecords" />
        <el-button @click="loadRecords">搜索</el-button>
        <el-button type="primary" @click="openRecordCreate">手动新增</el-button>
        <el-button type="success" @click="exportCsv">导出 CSV</el-button>
      </div>
      <el-table v-loading="recordsLoading" :data="records" border stripe height="420">
        <el-table-column prop="studentName" label="学生姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="idCard" label="身份证号" min-width="180" />
        <el-table-column prop="phone" label="电话" width="140" />
        <el-table-column prop="school" label="毕业学校" min-width="160" />
        <el-table-column prop="grade" label="年级" width="100" />
        <el-table-column prop="score" label="成绩" width="100" />
        <el-table-column prop="createdAt" label="提交时间" min-width="180" />
        <el-table-column label="操作" width="90" fixed="right"><template #default="{ row }"><el-button link type="danger" @click="removeRecord(row)">删除</el-button></template></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="recordDialogVisible" title="新增报名记录" width="640px">
      <el-form ref="recordFormRef" :model="recordForm" :rules="recordRules" label-width="100px">
        <el-form-item label="学生姓名" prop="studentName"><el-input v-model="recordForm.studentName" /></el-form-item>
        <el-form-item label="性别"><el-select v-model="recordForm.gender" clearable><el-option label="男" value="男" /><el-option label="女" value="女" /></el-select></el-form-item>
        <el-form-item label="身份证号" prop="idCard"><el-input v-model="recordForm.idCard" /></el-form-item>
        <el-form-item label="联系电话" prop="phone"><el-input v-model="recordForm.phone" /></el-form-item>
        <el-form-item label="毕业学校"><el-input v-model="recordForm.school" /></el-form-item>
        <el-form-item label="年级"><el-input v-model="recordForm.grade" /></el-form-item>
        <el-form-item label="成绩"><el-input v-model="recordForm.score" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="recordForm.remark" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="recordDialogVisible = false">取消</el-button><el-button type="primary" @click="submitRecordForm">保存</el-button></template>
    </el-dialog>
  </div>
</template>
