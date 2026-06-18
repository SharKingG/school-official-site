<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createUserApi, deleteUserApi, getRolesApi, getUsersApi, resetUserPasswordApi, updateUserApi } from '../../api/system'

const loading = ref(false)
const saving = ref(false)
const keyword = ref('')
const users = ref([])
const roles = ref([])
const dialogVisible = ref(false)
const dialogMode = ref('create')

const form = reactive({
  id: '',
  username: '',
  password: '123456',
  nickname: '',
  role: 'CONTENT_ADMIN',
  status: 'ENABLED'
})

async function loadRoles() { roles.value = await getRolesApi() }
async function loadUsers() {
  loading.value = true
  try { users.value = await getUsersApi({ keyword: keyword.value }) } finally { loading.value = false }
}
function openCreate() {
  dialogMode.value = 'create'
  Object.assign(form, { id: '', username: '', password: '123456', nickname: '', role: 'CONTENT_ADMIN', status: 'ENABLED' })
  dialogVisible.value = true
}
function openEdit(row) {
  dialogMode.value = 'edit'
  Object.assign(form, { id: row.id, username: row.username, password: '', nickname: row.nickname, role: row.role, status: row.status })
  dialogVisible.value = true
}
async function saveUser() {
  if (!form.username.trim()) return ElMessage.warning('请输入账号')
  if (!form.nickname.trim()) return ElMessage.warning('请输入姓名')
  if (dialogMode.value === 'create' && !form.password.trim()) return ElMessage.warning('请输入初始密码')
  if (!form.role) return ElMessage.warning('请选择角色')
  saving.value = true
  try {
    if (dialogMode.value === 'create') {
      await createUserApi({ username: form.username, password: form.password, nickname: form.nickname, role: form.role, status: form.status })
      ElMessage.success('新增用户成功')
    } else {
      await updateUserApi(form.id, { nickname: form.nickname, role: form.role, status: form.status })
      ElMessage.success('编辑用户成功')
    }
    dialogVisible.value = false
    await loadUsers()
  } finally { saving.value = false }
}
function resetPassword(row) {
  ElMessageBox.prompt(`请输入用户“${row.username}”的新密码`, '重置密码', { inputValue: '123456', inputPattern: /^.{6,}$/, inputErrorMessage: '密码至少 6 位' }).then(async ({ value }) => {
    await resetUserPasswordApi(row.id, value)
    ElMessage.success('密码已重置')
  })
}
function removeUser(row) {
  ElMessageBox.confirm(`确定删除用户“${row.username}”吗？`, '删除确认', { type: 'warning' }).then(async () => {
    await deleteUserApi(row.id)
    ElMessage.success('删除成功')
    await loadUsers()
  })
}
onMounted(async () => { await loadRoles(); await loadUsers() })
</script>

<template>
  <div class="page-card">
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input v-model="keyword" placeholder="搜索账号、姓名或角色" clearable style="width: 260px" @keyup.enter="loadUsers" />
        <el-button type="primary" @click="loadUsers">查询</el-button>
      </div>
      <div class="toolbar-right"><el-button type="primary" @click="openCreate">新增用户</el-button></div>
    </div>
    <el-table v-loading="loading" :data="users" border stripe>
      <el-table-column prop="username" label="账号" min-width="130" />
      <el-table-column prop="nickname" label="姓名" min-width="130" />
      <el-table-column prop="roleName" label="角色" min-width="130" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }"><el-tag :type="row.status === 'ENABLED' ? 'success' : 'info'">{{ row.status === 'ENABLED' ? '启用' : '禁用' }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="180" />
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="warning" @click="resetPassword(row)">重置密码</el-button>
          <el-button link type="danger" :disabled="row.username === 'admin'" @click="removeUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'create' ? '新增用户' : '编辑用户'" width="560px">
      <el-form label-width="100px">
        <el-form-item label="账号" required><el-input v-model="form.username" :disabled="dialogMode === 'edit'" placeholder="例如 content" /></el-form-item>
        <el-form-item v-if="dialogMode === 'create'" label="初始密码" required><el-input v-model="form.password" show-password placeholder="默认 123456" /></el-form-item>
        <el-form-item label="姓名" required><el-input v-model="form.nickname" placeholder="请输入姓名" /></el-form-item>
        <el-form-item label="角色" required>
          <el-select v-model="form.role" style="width: 100%"><el-option v-for="role in roles" :key="role.code" :label="role.name" :value="role.code" /></el-select>
        </el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio label="ENABLED">启用</el-radio><el-radio label="DISABLED">禁用</el-radio></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" :loading="saving" @click="saveUser">保存</el-button></template>
    </el-dialog>
  </div>
</template>
