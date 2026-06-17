<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createId, readStorage, writeStorage } from '../../utils/storage'
import { initialLinks } from '../../data/mockData'

const rows = ref(readStorage('school_admin_links', initialLinks))
const keyword = ref('')
const dialogVisible = ref(false)
const dialogMode = ref('add')
const form = reactive({ id: '', name: '', url: '', category: '首页右侧应用', type: '内部链接', openType: '当前窗口', status: '启用' })
function list() { return rows.value.filter((item) => !keyword.value || item.name.includes(keyword.value) || item.url.includes(keyword.value)) }
function saveAll() { writeStorage('school_admin_links', rows.value) }
function openAdd() { dialogMode.value = 'add'; Object.assign(form, { id: '', name: '', url: '', category: '首页右侧应用', type: '内部链接', openType: '当前窗口', status: '启用' }); dialogVisible.value = true }
function openEdit(row) { dialogMode.value = 'edit'; Object.assign(form, row); dialogVisible.value = true }
function openView(row) { dialogMode.value = 'view'; Object.assign(form, row); dialogVisible.value = true }
function save() { if (!form.name || !form.url) { ElMessage.warning('请填写链接名称和链接地址'); return } if (dialogMode.value === 'add') rows.value.unshift({ ...form, id: createId('link') }); else Object.assign(rows.value.find((item) => item.id === form.id), form); saveAll(); dialogVisible.value = false; ElMessage.success('保存成功') }
function remove(row) { ElMessageBox.confirm(`确定删除链接“${row.name}”吗？`, '删除确认', { type: 'warning' }).then(() => { rows.value = rows.value.filter((item) => item.id !== row.id); saveAll(); ElMessage.success('删除成功') }) }
function refresh() { rows.value = readStorage('school_admin_links', initialLinks); ElMessage.success('已刷新') }
</script>

<template>
  <div class="page-card">
    <el-alert title="链接管理对应首页右侧应用链接和网站底部友情链接设置。" type="info" show-icon :closable="false" style="margin-bottom: 16px" />
    <div class="toolbar"><div class="toolbar-left"><el-input v-model="keyword" placeholder="链接名称/地址" clearable style="width:260px" /><el-button type="primary">查询</el-button><el-button @click="keyword=''">重置</el-button></div><div class="toolbar-right"><el-button type="primary" @click="openAdd">新增</el-button><el-button @click="refresh">刷新</el-button></div></div>
    <el-table :data="list()" border stripe>
      <el-table-column prop="name" label="链接名称" min-width="160" />
      <el-table-column prop="url" label="链接地址" min-width="240" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" width="140" />
      <el-table-column prop="type" label="类型" width="110" />
      <el-table-column prop="openType" label="打开方式" width="110" />
      <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="180" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openView(row)">查看</el-button><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link type="danger" @click="remove(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增链接' : dialogMode === 'edit' ? '编辑链接' : '查看链接'" width="620px">
      <el-form label-width="100px" :disabled="dialogMode === 'view'">
        <el-form-item label="链接名称" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="链接地址" required><el-input v-model="form.url" /></el-form-item>
        <el-form-item label="链接分类"><el-select v-model="form.category" style="width:100%"><el-option label="首页右侧应用" value="首页右侧应用" /><el-option label="底部友情链接" value="底部友情链接" /><el-option label="专题入口" value="专题入口" /></el-select></el-form-item>
        <el-form-item label="链接类型"><el-radio-group v-model="form.type"><el-radio-button label="内部链接" /><el-radio-button label="外部链接" /></el-radio-group></el-form-item>
        <el-form-item label="打开方式"><el-radio-group v-model="form.openType"><el-radio-button label="当前窗口" /><el-radio-button label="新窗口" /></el-radio-group></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio-button label="启用" /><el-radio-button label="停用" /></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">关闭</el-button><el-button v-if="dialogMode !== 'view'" type="primary" @click="save">保存</el-button></template>
    </el-dialog>
  </div>
</template>
