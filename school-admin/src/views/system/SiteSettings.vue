<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getSiteSettingsApi, updateSiteSettingsApi } from '../../api/site'

const loading = ref(false)
const saving = ref(false)
const settings = ref([])

const form = reactive({
  schoolName: '',
  schoolEnglishName: '',
  logo: '',
  banner: '',
  slogan: '',
  subSlogan: '',
  address: '',
  phone: '',
  email: '',
  postcode: '',
  icp: '',
  copyrightYear: '',
  browserTitle: '',
  searchPlaceholder: '',
  enableArticleReview: 'true',
  enableAdmission: 'true',
  enableRecruitment: 'true',
  enablePublicQueryCaptcha: 'false',
  uploadMaxSizeMb: '20',
  allowedUploadTypes: 'jpg,png,gif,pdf,doc,docx,xls,xlsx'
})

const groups = computed(() => {
  const result = {}
  settings.value.forEach((item) => {
    if (!result[item.settingGroup]) result[item.settingGroup] = []
    result[item.settingGroup].push(item)
  })
  return result
})

const groupNames = {
  BASIC: '基础信息',
  CONTACT: '联系方式',
  FOOTER: '页脚版权',
  SEO: '浏览器与搜索',
  PARAM: '系统参数'
}

function applySettings(list) {
  list.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(form, item.settingKey)) {
      form[item.settingKey] = item.settingValue || ''
    }
  })
}

async function loadData() {
  loading.value = true
  try {
    const data = await getSiteSettingsApi()
    settings.value = data || []
    applySettings(settings.value)
  } finally {
    loading.value = false
  }
}

function buildItems() {
  return Object.entries(form).map(([key, value]) => ({ key, value: String(value ?? '') }))
}

async function saveSettings() {
  saving.value = true
  try {
    const data = await updateSiteSettingsApi(buildItems())
    settings.value = data || []
    applySettings(settings.value)
    ElMessage.success('站点设置已保存')
  } finally {
    saving.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <div class="page-card" v-loading="loading">
    <div class="page-card-header">
      <div>
        <h2>站点设置</h2>
        <p>集中维护学校名称、Logo、联系方式、备案信息和系统参数，前台官网会自动读取这些配置。</p>
      </div>
      <el-button type="primary" :loading="saving" @click="saveSettings">保存设置</el-button>
    </div>

    <el-tabs>
      <el-tab-pane label="基础信息">
        <el-form label-width="130px" class="wide-form">
          <el-form-item label="学校名称"><el-input v-model="form.schoolName" /></el-form-item>
          <el-form-item label="英文名称"><el-input v-model="form.schoolEnglishName" /></el-form-item>
          <el-form-item label="学校 Logo"><el-input v-model="form.logo" placeholder="例如 /images/logo.svg 或 /uploads/xxx.png" /></el-form-item>
          <el-form-item label="默认首页横幅"><el-input v-model="form.banner" placeholder="例如 /images/campus-banner.svg" /></el-form-item>
          <el-form-item label="校训/口号"><el-input v-model="form.slogan" /></el-form-item>
          <el-form-item label="首页副标题"><el-input v-model="form.subSlogan" /></el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="联系方式与页脚">
        <el-form label-width="130px" class="wide-form">
          <el-form-item label="学校地址"><el-input v-model="form.address" /></el-form-item>
          <el-form-item label="联系电话"><el-input v-model="form.phone" /></el-form-item>
          <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
          <el-form-item label="邮政编码"><el-input v-model="form.postcode" /></el-form-item>
          <el-form-item label="备案号"><el-input v-model="form.icp" /></el-form-item>
          <el-form-item label="版权年份"><el-input v-model="form.copyrightYear" /></el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="SEO 与系统参数">
        <el-form label-width="170px" class="wide-form">
          <el-form-item label="浏览器标题"><el-input v-model="form.browserTitle" /></el-form-item>
          <el-form-item label="搜索框提示语"><el-input v-model="form.searchPlaceholder" /></el-form-item>
          <el-form-item label="开启文章审核"><el-switch v-model="form.enableArticleReview" active-value="true" inactive-value="false" /></el-form-item>
          <el-form-item label="开启招生报名"><el-switch v-model="form.enableAdmission" active-value="true" inactive-value="false" /></el-form-item>
          <el-form-item label="开启招聘投递"><el-switch v-model="form.enableRecruitment" active-value="true" inactive-value="false" /></el-form-item>
          <el-form-item label="公共查询验证码"><el-switch v-model="form.enablePublicQueryCaptcha" active-value="true" inactive-value="false" /></el-form-item>
          <el-form-item label="上传大小限制 MB"><el-input-number v-model="form.uploadMaxSizeMb" :min="1" :max="200" /></el-form-item>
          <el-form-item label="允许上传类型"><el-input v-model="form.allowedUploadTypes" /></el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="原始配置">
        <el-collapse>
          <el-collapse-item v-for="(items, group) in groups" :key="group" :title="groupNames[group] || group">
            <el-table :data="items" border>
              <el-table-column prop="label" label="配置名称" width="180" />
              <el-table-column prop="settingKey" label="配置键" width="220" />
              <el-table-column prop="settingValue" label="配置值" />
              <el-table-column prop="valueType" label="类型" width="100" />
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.page-card { background: #fff; border-radius: 12px; padding: 18px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06); }
.page-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
.page-card-header h2 { margin: 0 0 6px; }
.page-card-header p { margin: 0; color: #667085; }
.wide-form { max-width: 860px; }
</style>
