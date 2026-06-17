<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createLeader, deleteLeader, getLeaders, updateLeader } from '../../api/leaders'
import { uploadFile } from '../../api/uploads'

const rows = ref([])
const loading = ref(false)
const keyword = ref('')
const dialogVisible = ref(false)
const dialogMode = ref('add')
const uploading = ref(false)
const form = reactive({ id: '', name: '', title: '', sort: 1, photo: '/images/logo.svg', intro: '', status: 'ENABLED' })
const statusText = { ENABLED: '启用', DISABLED: '停用' }

async function loadData() { loading.value = true; try { rows.value = await getLeaders() } finally { loading.value = false } }
function list() { return rows.value.filter((item) => !keyword.value || item.name?.includes(keyword.value) || item.title?.includes(keyword.value)) }
function openAdd() { dialogMode.value = 'add'; Object.assign(form, { id: '', name: '', title: '', sort: rows.value.length + 1, photo: '/images/logo.svg', intro: '', status: 'ENABLED' }); dialogVisible.value = true }
function openEdit(row) { dialogMode.value = 'edit'; Object.assign(form, row); dialogVisible.value = true }
function openView(row) { dialogMode.value = 'view'; Object.assign(form, row); dialogVisible.value = true }
async function handleUpload(option) { uploading.value = true; try { const data = await uploadFile(option.file, 'leader'); form.photo = data.fileUrl; ElMessage.success('上传成功，已填入照片路径') } finally { uploading.value = false } }
async function save() { if (!form.name || !form.title) { ElMessage.warning('请填写姓名和职务'); return } const payload = { ...form, sort: Number(form.sort || 0) }; if (dialogMode.value === 'add') await createLeader(payload); else await updateLeader(form.id, payload); dialogVisible.value = false; ElMessage.success('保存成功'); await loadData() }
function remove(row) { ElMessageBox.confirm(`确定删除领导“${row.name}”吗？`, '删除确认', { type: 'warning' }).then(async () => { await deleteLeader(row.id); ElMessage.success('删除成功'); await loadData() }) }
onMounted(loadData)
</script>

<template>
  <div class="page-card">
    <el-alert title="学校领导模块用于维护领导班子信息，后续可在前台学校概况页面展示。" type="info" show-icon :closable="false" style="margin-bottom: 16px" />
    <div class="toolbar"><div class="toolbar-left"><el-input v-model="keyword" placeholder="姓名/职务" clearable style="width:260px" /><el-button type="primary">查询</el-button><el-button @click="keyword=''">重置</el-button></div><div class="toolbar-right"><el-button type="primary" @click="openAdd">新增</el-button><el-button @click="loadData">刷新</el-button></div></div>
    <el-table :data="list()" border stripe v-loading="loading">
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="照片" width="120"><template #default="{ row }"><img :src="row.photo || '/images/logo.svg'" class="table-image" /></template></el-table-column>
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="title" label="职务" width="160" />
      <el-table-column prop="intro" label="简介" min-width="260" show-overflow-tooltip />
      <el-table-column label="状态" width="90"><template #default="{ row }"><el-tag :type="row.status === 'ENABLED' ? 'success' : 'info'">{{ statusText[row.status] || row.status }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="180" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openView(row)">查看</el-button><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link type="danger" @click="remove(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增领导' : dialogMode === 'edit' ? '编辑领导' : '查看领导'" width="680px">
      <el-form label-width="100px" :disabled="dialogMode === 'view'">
        <el-form-item label="姓名" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="职务" required><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="照片路径"><el-input v-model="form.photo" /></el-form-item>
        <el-form-item label="上传照片"><el-upload :http-request="handleUpload" :show-file-list="false"><el-button :loading="uploading">选择并上传</el-button></el-upload></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
        <el-form-item label="简介"><el-input v-model="form.intro" type="textarea" :rows="6" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio-button label="ENABLED">启用</el-radio-button><el-radio-button label="DISABLED">停用</el-radio-button></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">关闭</el-button><el-button v-if="dialogMode !== 'view'" type="primary" @click="save">保存</el-button></template>
    </el-dialog>
  </div>
</template>
