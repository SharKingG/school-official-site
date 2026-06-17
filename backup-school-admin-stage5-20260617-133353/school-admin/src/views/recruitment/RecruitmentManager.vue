<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createId, readStorage, writeStorage } from '../../utils/storage'
import { initialRecruitments } from '../../data/mockData'

const rows = ref(readStorage('school_admin_recruitments', initialRecruitments))
const keyword = ref('')
const planDialogVisible = ref(false)
const applicantsDialogVisible = ref(false)
const dialogMode = ref('add')
const currentApplicants = ref([])
const currentPlanName = ref('')
const form = reactive({ id: '', planName: '', startTime: '', endTime: '', status: '未开始', description: '', image: '/images/teaching.svg', applicants: [] })

function list() { return rows.value.filter((item) => !keyword.value || item.planName.includes(keyword.value) || item.status.includes(keyword.value)) }
function saveAll() { writeStorage('school_admin_recruitments', rows.value) }
function openAdd() { dialogMode.value = 'add'; Object.assign(form, { id: '', planName: '', startTime: '', endTime: '', status: '未开始', description: '', image: '/images/teaching.svg', applicants: [] }); planDialogVisible.value = true }
function openEdit(row) { dialogMode.value = 'edit'; Object.assign(form, JSON.parse(JSON.stringify(row))); planDialogVisible.value = true }
function openView(row) { dialogMode.value = 'view'; Object.assign(form, JSON.parse(JSON.stringify(row))); planDialogVisible.value = true }
function save() { if (!form.planName || !form.startTime || !form.endTime) { ElMessage.warning('请填写计划名称、投递开始时间和投递结束时间'); return } if (dialogMode.value === 'add') rows.value.unshift({ ...JSON.parse(JSON.stringify(form)), id: createId('recruitment'), applicants: [] }); else Object.assign(rows.value.find((item) => item.id === form.id), JSON.parse(JSON.stringify(form))); saveAll(); planDialogVisible.value = false; ElMessage.success('保存成功') }
function remove(row) { ElMessageBox.confirm(`确定删除招聘计划“${row.planName}”吗？`, '删除确认', { type: 'warning' }).then(() => { rows.value = rows.value.filter((item) => item.id !== row.id); saveAll(); ElMessage.success('删除成功') }) }
function viewApplicants(row) { currentPlanName.value = row.planName; currentApplicants.value = row.applicants || []; applicantsDialogVisible.value = true }
function exportApplicants() { ElMessage.success('已模拟导出投递名单。后续接入后端后会导出 Excel 文件') }
</script>

<template>
  <div class="page-card">
    <el-alert title="招聘管理对应官网“招生招聘 - 招聘投递”。求职者在投递时间内填写个人信息，管理员可查看、导出投递名单。" type="info" show-icon :closable="false" style="margin-bottom: 16px" />
    <div class="toolbar"><div class="toolbar-left"><el-input v-model="keyword" placeholder="计划名称/状态" clearable style="width:260px" /><el-button type="primary">查询</el-button><el-button @click="keyword=''">重置</el-button></div><div class="toolbar-right"><el-button type="primary" @click="openAdd">新增</el-button></div></div>
    <el-table :data="list()" border stripe>
      <el-table-column prop="planName" label="招聘计划名称" min-width="220" />
      <el-table-column prop="startTime" label="投递开始时间" width="180" />
      <el-table-column prop="endTime" label="投递结束时间" width="180" />
      <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="row.status === '投递中' ? 'success' : 'info'">{{ row.status }}</el-tag></template></el-table-column>
      <el-table-column label="投递人数" width="100"><template #default="{ row }">{{ row.applicants?.length || 0 }}</template></el-table-column>
      <el-table-column label="操作" width="260" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openView(row)">查看</el-button><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link type="success" @click="viewApplicants(row)">查看报名</el-button><el-button link type="danger" @click="remove(row)">删除</el-button></template></el-table-column>
    </el-table>

    <el-dialog v-model="planDialogVisible" :title="dialogMode === 'add' ? '新增招聘计划' : dialogMode === 'edit' ? '编辑招聘计划' : '查看招聘计划'" width="720px">
      <el-form label-width="120px" :disabled="dialogMode === 'view'">
        <el-form-item label="计划名称" required><el-input v-model="form.planName" /></el-form-item>
        <el-form-item label="投递时间" required>
          <el-date-picker v-model="form.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="投递开始时间" style="width: 48%" />
          <span style="width: 4%; text-align: center">至</span>
          <el-date-picker v-model="form.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="投递结束时间" style="width: 48%" />
        </el-form-item>
        <el-form-item label="状态"><el-select v-model="form.status" style="width:100%"><el-option label="未开始" value="未开始" /><el-option label="投递中" value="投递中" /><el-option label="已结束" value="已结束" /></el-select></el-form-item>
        <el-form-item label="封面图片"><el-input v-model="form.image" /></el-form-item>
        <el-form-item label="招聘说明"><el-input v-model="form.description" type="textarea" :rows="6" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="planDialogVisible = false">关闭</el-button><el-button v-if="dialogMode !== 'view'" type="primary" @click="save">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="applicantsDialogVisible" :title="`查看投递：${currentPlanName}`" width="1040px">
      <div class="toolbar"><div></div><el-button type="primary" @click="exportApplicants">导出投递名单</el-button></div>
      <el-table :data="currentApplicants" border stripe>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="idNumber" label="身份证号" width="190" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="position" label="应聘岗位" width="140" />
        <el-table-column prop="education" label="学历" width="100" />
        <el-table-column prop="submitTime" label="提交时间" width="170" />
      </el-table>
    </el-dialog>
  </div>
</template>
