<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createId, readStorage, writeStorage } from '../../utils/storage'
import { initialLeaders } from '../../data/mockData'

const rows = ref(readStorage('school_admin_leaders', initialLeaders))
const keyword = ref('')
const dialogVisible = ref(false)
const dialogMode = ref('add')
const form = reactive({ id: '', name: '', title: '', sort: 1, photo: '/images/logo.svg', intro: '', status: '启用' })
function list() { return rows.value.filter((item) => !keyword.value || item.name.includes(keyword.value) || item.title.includes(keyword.value)) }
function saveAll() { writeStorage('school_admin_leaders', rows.value) }
function openAdd() { dialogMode.value = 'add'; Object.assign(form, { id: '', name: '', title: '', sort: rows.value.length + 1, photo: '/images/logo.svg', intro: '', status: '启用' }); dialogVisible.value = true }
function openEdit(row) { dialogMode.value = 'edit'; Object.assign(form, row); dialogVisible.value = true }
function openView(row) { dialogMode.value = 'view'; Object.assign(form, row); dialogVisible.value = true }
function save() { if (!form.name || !form.title) { ElMessage.warning('请填写领导姓名和职务'); return } if (dialogMode.value === 'add') rows.value.unshift({ ...form, id: createId('leader') }); else Object.assign(rows.value.find((item) => item.id === form.id), form); saveAll(); dialogVisible.value = false; ElMessage.success('保存成功') }
function remove(row) { ElMessageBox.confirm(`确定删除领导“${row.name}”吗？`, '删除确认', { type: 'warning' }).then(() => { rows.value = rows.value.filter((item) => item.id !== row.id); saveAll(); ElMessage.success('删除成功') }) }
function refresh() { rows.value = readStorage('school_admin_leaders', initialLeaders); ElMessage.success('已刷新') }
</script>

<template>
  <div class="page-card">
    <el-alert title="学校领导对应官网“集团动态 - 集团简介 - 领导班子”栏目。" type="info" show-icon :closable="false" style="margin-bottom: 16px" />
    <div class="toolbar"><div class="toolbar-left"><el-input v-model="keyword" placeholder="姓名/职务" clearable style="width:260px" /><el-button type="primary">查询</el-button><el-button @click="keyword=''">重置</el-button></div><div class="toolbar-right"><el-button type="primary" @click="openAdd">新增</el-button><el-button @click="refresh">刷新</el-button></div></div>
    <el-table :data="list()" border stripe>
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="照片" width="120"><template #default="{ row }"><img :src="row.photo" class="table-image" /></template></el-table-column>
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="title" label="职务" width="160" />
      <el-table-column prop="intro" label="简介" min-width="260" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="180" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openView(row)">查看</el-button><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link type="danger" @click="remove(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增领导' : dialogMode === 'edit' ? '编辑领导' : '查看领导'" width="680px">
      <el-form label-width="100px" :disabled="dialogMode === 'view'">
        <el-form-item label="姓名" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="职务" required><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="照片路径"><el-input v-model="form.photo" placeholder="例如 /images/logo.svg" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="1" /></el-form-item>
        <el-form-item label="简介"><el-input v-model="form.intro" type="textarea" :rows="6" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio-button label="启用" /><el-radio-button label="停用" /></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">关闭</el-button><el-button v-if="dialogMode !== 'view'" type="primary" @click="save">保存</el-button></template>
    </el-dialog>
  </div>
</template>
