<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createId, readStorage, writeStorage } from '../../utils/storage'
import { initialBanners } from '../../data/mockData'

const banners = ref(readStorage('school_admin_banners', initialBanners))
const keyword = ref('')
const dialogVisible = ref(false)
const dialogMode = ref('add')
const form = reactive({ id: '', name: '', category: '首页顶部轮播', image: '', size: '1920*620', status: '启用', sort: 1 })

function filtered() {
  return banners.value.filter((item) => !keyword.value || item.name.includes(keyword.value) || item.category.includes(keyword.value))
}
function saveAll() { writeStorage('school_admin_banners', banners.value) }
function openAdd() { dialogMode.value = 'add'; Object.assign(form, { id: '', name: '', category: '首页顶部轮播', image: '', size: '1920*620', status: '启用', sort: banners.value.length + 1 }); dialogVisible.value = true }
function openEdit(row) { dialogMode.value = 'edit'; Object.assign(form, row); dialogVisible.value = true }
function openView(row) { dialogMode.value = 'view'; Object.assign(form, row); dialogVisible.value = true }
function save() {
  if (!form.name || !form.image) { ElMessage.warning('请填写横幅名称和图片路径'); return }
  if (dialogMode.value === 'add') banners.value.unshift({ ...form, id: createId('banner') })
  else Object.assign(banners.value.find((item) => item.id === form.id), form)
  saveAll(); dialogVisible.value = false; ElMessage.success('保存成功')
}
function remove(row) { ElMessageBox.confirm(`确定删除横幅“${row.name}”吗？`, '删除确认', { type: 'warning' }).then(() => { banners.value = banners.value.filter((item) => item.id !== row.id); saveAll(); ElMessage.success('删除成功') }) }
function refresh() { banners.value = readStorage('school_admin_banners', initialBanners); ElMessage.success('已刷新') }
</script>

<template>
  <div class="page-card">
    <el-alert title="横幅管理对应网站首页轮播海报设置；旧系统还提到网站中部广告位图片建议尺寸为 285*80px。" type="info" show-icon :closable="false" style="margin-bottom: 16px" />
    <div class="toolbar">
      <div class="toolbar-left"><el-input v-model="keyword" placeholder="横幅名称/分类" clearable style="width: 260px" /><el-button type="primary">查询</el-button><el-button @click="keyword = ''">重置</el-button></div>
      <div class="toolbar-right"><el-button type="primary" @click="openAdd">新增</el-button><el-button @click="refresh">刷新</el-button></div>
    </div>
    <el-table :data="filtered()" border stripe>
      <el-table-column prop="name" label="横幅名称" min-width="180" />
      <el-table-column prop="category" label="所属分类" width="160" />
      <el-table-column label="图片" width="130"><template #default="{ row }"><img :src="row.image" class="table-image" /></template></el-table-column>
      <el-table-column prop="size" label="建议尺寸" width="120" />
      <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag></template></el-table-column>
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="操作" width="180" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="openView(row)">查看</el-button><el-button link type="primary" @click="openEdit(row)">编辑</el-button><el-button link type="danger" @click="remove(row)">删除</el-button></template></el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="dialogMode === 'add' ? '新增横幅' : dialogMode === 'edit' ? '编辑横幅' : '查看横幅'" width="620px">
      <el-form label-width="110px" :disabled="dialogMode === 'view'">
        <el-form-item label="横幅名称" required><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="所属分类"><el-select v-model="form.category" style="width:100%"><el-option label="首页顶部轮播" value="首页顶部轮播" /><el-option label="网站中部广告" value="网站中部广告" /><el-option label="右侧应用图标" value="右侧应用图标" /></el-select></el-form-item>
        <el-form-item label="图片路径" required><el-input v-model="form.image" placeholder="例如 /images/campus-banner.svg" /></el-form-item>
        <el-form-item label="建议尺寸"><el-input v-model="form.size" /></el-form-item>
        <el-form-item label="状态"><el-radio-group v-model="form.status"><el-radio-button label="启用" /><el-radio-button label="停用" /></el-radio-group></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="1" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">关闭</el-button><el-button v-if="dialogMode !== 'view'" type="primary" @click="save">保存</el-button></template>
    </el-dialog>
  </div>
</template>
