<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createLink, deleteLink, getLinks, updateLink } from '../../api/links'

const rows = ref([])
const loading = ref(false)
const keyword = ref('')
const dialogVisible = ref(false)
const dialogMode = ref('add')
const form = reactive({ id: '', name: '', url: '', category: 'QUICK_LINK', type: 'INTERNAL', openTarget: 'SELF', icon: '🔗', status: 'ENABLED', sort: 1 })
const categoryText = { QUICK_LINK: '首页右侧应用', FOOTER_LINK: '底部友情链接', SPECIAL: '专题入口' }
const typeText = { INTERNAL: '内部链接', EXTERNAL: '外部链接' }
const targetText = { SELF: '当前窗口', BLANK: '新窗口' }
const statusText = { ENABLED: '启用', DISABLED: '停用' }

async function loadData() { loading.value = true; try { rows.value = await getLinks() } finally { loading.value = false } }
function list() { return rows.value.filter((item) => !keyword.value || item.name?.includes(keyword.value) || item.url?.includes(keyword.value)) }
function openAdd() { dialogMode.value = 'add'; Object.assign(form, { id: '', name: '', url: '', category: 'QUICK_LINK', type: 'INTERNAL', openTarget: 'SELF', icon: '🔗', status: 'ENABLED', sort: rows.value.length + 1 }); dialogVisible.value = true }
function openEdit(row) { dialogMode.value = 'edit'; Object.assign(form, row); dialogVisible.value = true }
function openView(row) { dialogMode.value = 'view'; Object.assign(form, row); dialogVisible.value = true }
async function save() { if (!form.name || !form.url) { ElMessage.warning('请填写链接名称和链接地址'); return } const payload = { ...form, sort: Number(form.sort || 0) }; if (dialogMode.value === 'add') await createLink(payload); else await updateLink(form.id, payload); dialogVisible.value = false; ElMessage.success('保存成功'); await loadData() }
function remove(row) { ElMessageBox.confirm(`确定删除链接“${row.name}”吗？`, '删除确认', { type: 'warning' }).then(async () => { await deleteLink(row.id); ElMessage.success('删除成功'); await loadData() }) }
onMounted(loadData)
</script>

<template>
  <div class="page-card">
    <el-alert title="链接管理对应首页右侧应用链接和网站底部友情链接设置。" type="info" show-icon :closable="false" style="margin-bottom: 16px" />
    <div class="toolbar"><div class="toolbar-left"><el-input v-model="keyword" placeholder="链接名称/地址" clearable style="width:260px" /><el-button type="primary">查询</el-button><el-button @click="keyword=''">重置</el-button></div><div class="toolbar-right"><el-button type="primary" @click="openAdd">新增</el-button><el-button @click="loadData">刷新</el-button></div></div>
    <el-table :data="list()" border stripe v-loading="loading">
      <el-table-column prop="name" label="链接名称" min-width="150" />
      <el-table-column prop="url" label="链接地址" min-width="220" show-overflow-tooltip />
      <el-table-column label="分类" width="130"><template #default="{ row }">{{ categoryText[row.category] || row.category }}</template></el-table-column>
      <el-table-column label="类型" width="100"><template #default="{ row }">{{ typeText[row.type] || row.type }}</template></el-table-column>
      <el-table-column label="打开方式" width="110"><template #default="{ row }">{{ targetText[row.openTarget] || row.openTarget }}</template></el-table-column>
      <el-table-column label="状态" width="90"><template #default="{ row }"><el-tag :type="row.status === 'ENABLED' ? 'success' : 'info'">{{ statusText[row.status] || row.status }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="180" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openView(row)">查看</el-button><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link type="danger" @click="remove(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增链接' : dialogMode === 'edit' ? '编辑链接' : '查看链接'" width="620px">
      <el-form label-width="100px" :disabled="dialogMode === 'view'">
        <el-form-item label="链接名称" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="链接地址" required><el-input v-model="form.url" /></el-form-item>
        <el-form-item label="图标"><el-input v-model="form.icon" placeholder="例如 📣" /></el-form-item>
        <el-form-item label="链接分类"><el-select v-model="form.category" style="width:100%"><el-option label="首页右侧应用" value="QUICK_LINK" /><el-option label="底部友情链接" value="FOOTER_LINK" /><el-option label="专题入口" value="SPECIAL" /></el-select></el-form-item>
        <el-form-item label="链接类型"><el-radio-group v-model="form.type"><el-radio-button label="INTERNAL">内部链接</el-radio-button><el-radio-button label="EXTERNAL">外部链接</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="打开方式"><el-radio-group v-model="form.openTarget"><el-radio-button label="SELF">当前窗口</el-radio-button><el-radio-button label="BLANK">新窗口</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio-button label="ENABLED">启用</el-radio-button><el-radio-button label="DISABLED">停用</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">关闭</el-button><el-button v-if="dialogMode !== 'view'" type="primary" @click="save">保存</el-button></template>
    </el-dialog>
  </div>
</template>
