<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createId, readStorage, writeStorage } from '../../utils/storage'
import { flatCategories, initialArticles } from '../../data/mockData'

const activeTab = ref('normal')

const form = reactive({
  title: '',
  category: '',
  type: '普通文章',
  content: '',
  publishTime: '',
  source: '学校官网',
  department: '',
  author: '管理员',
  linkUrl: '',
  carouselImage: '',
  listImage: '',
  headerImage: '',
  attachmentName: '',
  galleryName: '',
  videoUrl: ''
})

function validateBase() {
  if (!form.title.trim()) {
    ElMessage.warning('请填写文章标题')
    activeTab.value = 'normal'
    return false
  }

  if (!form.category) {
    ElMessage.warning('请选择发布栏目。注意：正式系统中应选择最小子栏目')
    activeTab.value = 'normal'
    return false
  }

  if (!form.content.trim() && !form.linkUrl.trim()) {
    ElMessage.warning('请填写文章内容，或者在高级信息中填写外链地址')
    activeTab.value = 'normal'
    return false
  }

  return true
}

function saveArticle(status) {
  if (!validateBase()) return

  const articles = readStorage('school_admin_articles', initialArticles)
  const categoryOption = flatCategories.find((item) => item.value === form.category)

  articles.unshift({
    id: createId('article'),
    title: form.title,
    category: form.category,
    categoryName: categoryOption?.label || '',
    type: form.type,
    status,
    author: form.author || '管理员',
    department: form.department,
    source: form.source,
    publishTime: form.publishTime || new Date().toLocaleString('zh-CN', { hour12: false }),
    isTop: false,
    linkUrl: form.linkUrl,
    carouselImage: form.carouselImage,
    listImage: form.listImage,
    headerImage: form.headerImage,
    attachmentName: form.attachmentName,
    galleryName: form.galleryName,
    videoUrl: form.videoUrl,
    content: form.content
  })

  writeStorage('school_admin_articles', articles)
  ElMessage.success(status === '草稿' ? '已保存为草稿' : '已提交发布')

  Object.assign(form, {
    title: '',
    category: '',
    type: '普通文章',
    content: '',
    publishTime: '',
    source: '学校官网',
    department: '',
    author: '管理员',
    linkUrl: '',
    carouselImage: '',
    listImage: '',
    headerImage: '',
    attachmentName: '',
    galleryName: '',
    videoUrl: ''
  })
  activeTab.value = 'normal'
}
</script>

<template>
  <div class="page-card">
    <el-alert
      title="发布文章规则"
      type="warning"
      description="旧系统要求文章标题、发布栏目、文章内容、文章类型为常用必填项；发布栏目需要勾选到最小子栏目，否则前台可能无法显示。"
      show-icon
      :closable="false"
      style="margin-bottom: 18px"
    />

    <el-tabs v-model="activeTab">
      <el-tab-pane label="常规信息" name="normal">
        <el-form label-width="110px" style="max-width: 960px">
          <el-form-item label="文章标题" required>
            <el-input v-model="form.title" placeholder="请输入文章标题" />
          </el-form-item>

          <el-form-item label="发布栏目" required>
            <el-select v-model="form.category" placeholder="请选择最小子栏目" style="width: 100%">
              <el-option v-for="item in flatCategories" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="文章类型" required>
            <el-radio-group v-model="form.type">
              <el-radio-button label="普通文章" />
              <el-radio-button label="图片文章" />
              <el-radio-button label="外链文章" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="文章内容" required>
            <el-input v-model="form.content" type="textarea" :rows="14" placeholder="这里先用普通文本框模拟富文本编辑器，后续可替换为 wangEditor 或 TinyMCE" />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="高级信息" name="advanced">
        <el-form label-width="120px" style="max-width: 960px">
          <el-form-item label="自定义发布时间">
            <el-date-picker v-model="form.publishTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择发布时间" style="width: 100%" />
          </el-form-item>

          <el-form-item label="文章来源">
            <el-input v-model="form.source" />
          </el-form-item>

          <el-form-item label="所属部门">
            <el-input v-model="form.department" placeholder="例如：教务处、学生处、招生办" />
          </el-form-item>

          <el-form-item label="文章作者">
            <el-input v-model="form.author" />
          </el-form-item>

          <el-form-item label="链接地址">
            <el-input v-model="form.linkUrl" placeholder="外链文章填写此项，前台点击文章时跳转到此链接" />
          </el-form-item>

          <el-form-item label="轮播图片">
            <el-input v-model="form.carouselImage" placeholder="例如 /images/campus-banner.svg。后续接入上传组件" />
          </el-form-item>

          <el-form-item label="文章列表图">
            <el-input v-model="form.listImage" placeholder="用于前台文章列表中的缩略图" />
          </el-form-item>

          <el-form-item label="正文头图">
            <el-input v-model="form.headerImage" placeholder="用于文章详情页顶部图片" />
          </el-form-item>

          <el-form-item label="附件信息">
            <el-input v-model="form.attachmentName" placeholder="例如：招生简章.pdf。后续接入文件上传" />
          </el-form-item>

          <el-form-item label="正文展示图册">
            <el-input v-model="form.galleryName" placeholder="选择或填写图册名称" />
          </el-form-item>

          <el-form-item label="正文播放视频">
            <el-input v-model="form.videoUrl" placeholder="填写视频地址或上传后的视频路径" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div style="margin-left: 110px; margin-top: 18px">
      <el-button @click="saveArticle('草稿')">保存草稿</el-button>
      <el-button type="primary" @click="saveArticle('待审核')">提交发布</el-button>
    </div>
  </div>
</template>
