<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createId, readStorage, writeStorage } from '../../utils/storage'
import { initialFiles } from '../../data/mockData'

const rows = ref(readStorage('school_admin_files', initialFiles))
const keyword = ref('')
const dialogVisible = ref(false)
const dialogMode = ref('add')
const form = reactive({ id: '', name: '', url: '', category: '公共查询结果文件', size: '', uploadTime: '' })
function list() { return rows.value.filter((item) => !keyword.value || item.name.includes(keyword.value) || item.url.includes(keyword.value)) }
function saveAll() { writeStorage('school_admin_files', rows.value) }
function openAdd() { dialogMode.value = 'add'; Object.assign(form, { id: '', name: '', url: '', category: '公共查询结果文件', size: '', uploadTime: '' }); dialogVisible.value = true }
function openView(row) { dialogMode.value = 'view'; Object.assign(form, row); dialogVisible.value = true }
function save() { if (!form.name || !form.url) { ElMessage.warning('请填写文件名称和下载路径'); return } form.uploadTime = form.uploadTime || new Date().toLocaleString('zh-CN', { hour12: false }); form.size = form.size || '未知'; rows.value.unshift({ ...form, id: createId('file') }); saveAll(); dialogVisible.value = false; ElMessage.success('保存成功，已生成文件下载路径') }
function remove(row) { ElMessageBox.confirm(`确定删除文件“${row.name}”吗？`, '删除确认', { type: 'warning' }).then(() => { rows.value = rows.value.filter((item) => item.id !== row.id); saveAll(); ElMessage.success('删除成功') }) }
function copyUrl(row) { navigator.clipboard?.writeText(row.url); ElMessage.success('已复制下载路径，可粘贴到公共查询结果文件中') }
</script>

<template>
  <div class="page-card">
    <el-alert title="文件管理用于上传文件并生成下载路径；旧系统会把下载路径粘贴到公共查询结果中，供用户在前台查询下载。" type="info" show-icon :closable="false" style="margin-bottom: 16px" />
    <div class="toolbar"><div class="toolbar-left"><el-input v-model="keyword" placeholder="文件名/下载路径" clearable style="width:280px" /><el-button type="primary">查询</el-button><el-button @click="keyword=''">重置</el-button></div><div class="toolbar-right"><el-button type="primary" @click="openAdd">新增</el-button></div></div>
    <el-table :data="list()" border stripe>
      <el-table-column prop="name" label="文件名称" min-width="220" />
      <el-table-column prop="url" label="下载路径" min-width="280" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" width="150" />
      <el-table-column prop="size" label="文件大小" width="100" />
      <el-table-column prop="uploadTime" label="上传时间" width="170" />
      <el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openView(row)">查看</el-button><el-button link type="success" @click="copyUrl(row)">复制路径</el-button><el-button link type="danger" @click="remove(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增文件' : '查看文件'" width="680px">
      <el-form label-width="120px" :disabled="dialogMode === 'view'">
        <el-form-item label="文件名称" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="文件下载路径" required><el-input v-model="form.url" placeholder="例如 /uploads/result.xlsx。后续接入真实上传" /></el-form-item>
        <el-form-item label="文件分类"><el-select v-model="form.category" style="width:100%"><el-option label="公共查询结果文件" value="公共查询结果文件" /><el-option label="文章附件" value="文章附件" /><el-option label="招聘附件" value="招聘附件" /></el-select></el-form-item>
        <el-form-item label="文件大小"><el-input v-model="form.size" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">关闭</el-button><el-button v-if="dialogMode !== 'view'" type="primary" @click="save">保存</el-button></template>
    </el-dialog>
  </div>
</template>
