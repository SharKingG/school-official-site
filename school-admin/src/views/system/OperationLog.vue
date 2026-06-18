<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getOperationLogsApi } from '../../api/system'
const loading = ref(false); const logs = ref([]); const pagination = reactive({ page: 1, pageSize: 20, total: 0 }); const query = reactive({ keyword: '', module: '' })
async function loadLogs(page = pagination.page) { loading.value = true; try { const data = await getOperationLogsApi({ page, pageSize: pagination.pageSize, keyword: query.keyword, module: query.module }); logs.value = data.list || []; pagination.page = data.pagination?.page || page; pagination.pageSize = data.pagination?.pageSize || pagination.pageSize; pagination.total = data.pagination?.total || 0 } finally { loading.value = false } }
function reset() { query.keyword = ''; query.module = ''; loadLogs(1) }
onMounted(() => loadLogs(1))
</script>
<template>
  <div class="page-card">
    <div class="toolbar"><div class="toolbar-left"><el-input v-model="query.keyword" placeholder="搜索用户、动作或描述" clearable style="width: 240px" @keyup.enter="loadLogs(1)" /><el-select v-model="query.module" placeholder="模块" clearable style="width: 160px"><el-option label="系统管理" value="系统管理" /><el-option label="文章管理" value="文章管理" /><el-option label="文章审核" value="文章审核" /><el-option label="系统初始化" value="系统初始化" /></el-select><el-button type="primary" @click="loadLogs(1)">查询</el-button><el-button @click="reset">重置</el-button></div><div class="toolbar-right"><el-button @click="loadLogs()">刷新</el-button></div></div>
    <el-table v-loading="loading" :data="logs" border stripe>
      <el-table-column prop="createdAt" label="时间" width="210" />
      <el-table-column label="操作人" width="150"><template #default="{ row }">{{ row.user?.nickname || row.username || '-' }}</template></el-table-column>
      <el-table-column prop="module" label="模块" width="120" />
      <el-table-column prop="action" label="动作" width="140" />
      <el-table-column prop="targetType" label="对象类型" width="120" />
      <el-table-column prop="targetId" label="对象ID" width="90" />
      <el-table-column prop="description" label="说明" min-width="260" show-overflow-tooltip />
      <el-table-column prop="result" label="结果" width="90"><template #default="{ row }"><el-tag :type="row.result === 'SUCCESS' ? 'success' : 'danger'">{{ row.result }}</el-tag></template></el-table-column>
    </el-table>
    <div style="display: flex; justify-content: flex-end; margin-top: 16px"><el-pagination background layout="prev, pager, next, total" :current-page="pagination.page" :page-size="pagination.pageSize" :total="pagination.total" @current-change="loadLogs" /></div>
  </div>
</template>
