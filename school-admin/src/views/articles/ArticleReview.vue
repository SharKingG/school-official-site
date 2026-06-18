<script setup>
import ArticleListPage from '../../components/ArticleListPage.vue'
</script>

<template>
  <div>
    <el-alert
      title="文章审核流程"
      type="warning"
      description="这里集中处理待审核文章。审核通过后文章变为已发布，驳回后退回草稿。"
      show-icon
      :closable="false"
      style="margin-bottom: 16px"
    />
    <ArticleListPage scope="review" />
  </div>
</template>
