<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createId, readStorage, writeStorage } from '../../utils/storage'
import { initialPublicQueries } from '../../data/mockData'

const rows = ref(readStorage('school_admin_public_queries', initialPublicQueries))
const keyword = ref('')
const dialogVisible = ref(false)
const dialogMode = ref('add')
const form = reactive({ id: '', name: '', templateName: '', status: '启用', uploadTime: '', resultFile: '' })
function list() { return rows.value.filter((item) => !keyword.value || item.name.includes(keyword.value) || item.templateName.includes(keyword.value)) }
function saveAll() { writeStorage('school_admin_public_queries', rows.value) }
function openAdd() { dialogMode.value = 'add'; Object.assign(form, { id: '', name: '', templateName: '', status: '启用', uploadTime: '', resultFile: '' }); dialogVisible.value = true }
function openEdit(row) { dialogMode.value = 'edit'; Object.assign(form, row); dialogVisible.value = true }
function openView(row) { dialogMode.value = 'view'; Object.assign(form, row); dialogVisible.value = true }
function save() { if (!form.name || !form.templateName) { ElMessage.warning('请填写项目名称和查询模板'); return } form.uploadTime = form.uploadTime || new Date().toLocaleString('zh-CN', { hour12: false }); if (dialogMode.value === 'add') rows.value.unshift({ ...form, id: createId('query') }); else Object.assign(rows.value.find((item) => item.id === form.id), form); saveAll(); dialogVisible.value = false; ElMessage.success('保存成功') }
function remove(row) { ElMessageBox.confirm(`确定删除公共查询项目“${row.name}”吗？`, '删除确认', { type: 'warning' }).then(() => { rows.value = rows.value.filter((item) => item.id !== row.id); saveAll(); ElMessage.success('删除成功') }) }
function downloadTemplate() { ElMessage.success('已模拟下载模板。后续接入后端后会下载 Excel 模板') }
</script>

<template>
  <div class="page-card">
    <el-alert title="公共查询对应官网首页右侧“公共查询”。管理员新增查询项目、下载模板、填写模板后上传；用户在前台输入身份证号、姓名和验证码查询。" type="info" show-icon :closable="false" style="margin-bottom: 16px" />
    <div class="toolbar"><div class="toolbar-left"><el-input v-model="keyword" placeholder="项目名称/模板" clearable style="width:260px" /><el-button type="primary">查询</el-button><el-button @click="keyword=''">重置</el-button></div><div class="toolbar-right"><el-button @click="downloadTemplate">下载模板</el-button><el-button type="primary" @click="openAdd">新增</el-button></div></div>
    <el-table :data="list()" border stripe>
      <el-table-column prop="name" label="项目名称" min-width="180" />
      <el-table-column prop="templateName" label="查询模板" min-width="180" />
      <el-table-column prop="resultFile" label="查询结果文件" min-width="180" />
      <el-table-column prop="uploadTime" label="上传时间" width="170" />
      <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="180" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openView(row)">查看</el-button><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link type="danger" @click="remove(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增公共查询' : dialogMode === 'edit' ? '编辑公共查询' : '查看公共查询'" width="680px">
      <el-form label-width="120px" :disabled="dialogMode === 'view'">
        <el-form-item label="项目名称" required><el-input v-model="form.name" placeholder="例如：录取结果查询" /></el-form-item>
        <el-form-item label="查询模板" required><el-input v-model="form.templateName" placeholder="例如：录取结果模板.xlsx" /></el-form-item>
        <el-form-item label="上传结果文件"><el-input v-model="form.resultFile" placeholder="例如：录取结果名单.xlsx" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio-button label="启用" /><el-radio-button label="停用" /></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">关闭</el-button><el-button v-if="dialogMode !== 'view'" type="primary" @click="save">保存</el-button></template>
    </el-dialog>
  </div>
</template>
