<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createRoleApi, deleteRoleApi, getPermissionsApi, getRolesApi, updateRoleApi } from '../../api/system'
const loading = ref(false); const saving = ref(false); const roles = ref([]); const allPermissions = ref([]); const labels = ref({}); const dialogVisible = ref(false); const dialogMode = ref('create')
const form = reactive({ id: '', code: '', name: '', description: '', permissions: [], sort: 0, status: 'ENABLED' })
async function loadPermissions() { const data = await getPermissionsApi(); allPermissions.value = data.all || []; labels.value = data.labels || {} }
async function loadRoles() { loading.value = true; try { roles.value = await getRolesApi() } finally { loading.value = false } }
function openCreate() { dialogMode.value = 'create'; Object.assign(form, { id: '', code: '', name: '', description: '', permissions: [], sort: 0, status: 'ENABLED' }); dialogVisible.value = true }
function openEdit(row) { dialogMode.value = 'edit'; Object.assign(form, { id: row.id, code: row.code, name: row.name, description: row.description || '', permissions: [...(row.permissions || [])], sort: row.sort || 0, status: row.status }); dialogVisible.value = true }
function selectAll() { form.permissions = [...allPermissions.value] }
function clearAll() { form.permissions = [] }
async function saveRole() { if (!form.code.trim()) return ElMessage.warning('请输入角色编码'); if (!form.name.trim()) return ElMessage.warning('请输入角色名称'); saving.value = true; try { if (dialogMode.value === 'create') { await createRoleApi({ ...form }); ElMessage.success('新增角色成功') } else { await updateRoleApi(form.id, { name: form.name, description: form.description, permissions: form.permissions, sort: form.sort, status: form.status }); ElMessage.success('编辑角色成功') } dialogVisible.value = false; await loadRoles() } finally { saving.value = false } }
function removeRole(row) { ElMessageBox.confirm(`确定删除角色“${row.name}”吗？`, '删除确认', { type: 'warning' }).then(async () => { await deleteRoleApi(row.id); ElMessage.success('删除成功'); await loadRoles() }) }
onMounted(async () => { await loadPermissions(); await loadRoles() })
</script>
<template>
  <div class="page-card">
    <div class="toolbar"><div class="toolbar-left"><el-alert title="角色权限说明" type="info" show-icon :closable="false" description="权限按模块控制。超级管理员默认拥有全部权限。" /></div><div class="toolbar-right"><el-button type="primary" @click="openCreate">新增角色</el-button></div></div>
    <el-table v-loading="loading" :data="roles" border stripe>
      <el-table-column prop="code" label="角色编码" min-width="150" />
      <el-table-column prop="name" label="角色名称" min-width="150" />
      <el-table-column prop="description" label="说明" min-width="220" />
      <el-table-column label="权限数量" width="100"><template #default="{ row }">{{ row.permissions?.length || 0 }}</template></el-table-column>
      <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="row.status === 'ENABLED' ? 'success' : 'info'">{{ row.status === 'ENABLED' ? '启用' : '停用' }}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="180" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link type="danger" :disabled="row.code === 'SUPER_ADMIN'" @click="removeRole(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'create' ? '新增角色' : '编辑角色'" width="760px">
      <el-form label-width="100px">
        <el-form-item label="角色编码" required><el-input v-model="form.code" :disabled="dialogMode === 'edit'" placeholder="例如 CONTENT_ADMIN" /></el-form-item>
        <el-form-item label="角色名称" required><el-input v-model="form.name" placeholder="例如 内容管理员" /></el-form-item>
        <el-form-item label="角色说明"><el-input v-model="form.description" type="textarea" :rows="2" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio label="ENABLED">启用</el-radio><el-radio label="DISABLED">停用</el-radio></el-radio-group></el-form-item>
        <el-form-item label="权限" required><div style="width: 100%"><div style="margin-bottom: 10px"><el-button size="small" @click="selectAll">全选</el-button><el-button size="small" @click="clearAll">清空</el-button></div><el-checkbox-group v-model="form.permissions"><el-row :gutter="12"><el-col v-for="permission in allPermissions" :key="permission" :span="8"><el-checkbox :label="permission">{{ labels[permission] || permission }}</el-checkbox></el-col></el-row></el-checkbox-group></div></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" :loading="saving" @click="saveRole">保存</el-button></template>
    </el-dialog>
  </div>
</template>
