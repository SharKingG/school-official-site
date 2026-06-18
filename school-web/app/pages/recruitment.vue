<script setup lang="ts">
import { recruitmentApi, formatDate } from '~/api/business'

useHead({ title: '招聘投递 - 学校官网' })

const plans = ref<any[]>([])
const loading = ref(true)
const selectedPlan = ref<any>(null)
const submitLoading = ref(false)
const message = ref('')

const form = reactive({
  applicantName: '',
  gender: '',
  phone: '',
  email: '',
  education: '',
  major: '',
  attachmentUrl: '',
  remark: ''
})

async function loadPlans() {
  loading.value = true
  try {
    plans.value = await recruitmentApi.listPlans({ status: 'ENABLED' })
    selectedPlan.value = plans.value[0] || null
  } catch (error: any) {
    message.value = error.message || '招聘岗位读取失败，请确认后端服务是否启动。'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(form, {
    applicantName: '',
    gender: '',
    phone: '',
    email: '',
    education: '',
    major: '',
    attachmentUrl: '',
    remark: ''
  })
}

async function submit() {
  message.value = ''
  if (!selectedPlan.value) {
    message.value = '请选择招聘岗位。'
    return
  }
  if (!form.applicantName || !form.phone) {
    message.value = '请填写姓名和联系电话。'
    return
  }

  submitLoading.value = true
  try {
    await recruitmentApi.submit(selectedPlan.value.id, { ...form })
    message.value = '投递提交成功，请等待学校后续联系。'
    resetForm()
  } catch (error: any) {
    message.value = error.message || '提交失败，请稍后再试。'
  } finally {
    submitLoading.value = false
  }
}

onMounted(loadPlans)
</script>

<template>
  <main class="page-main">
    <section class="container">
      <div class="page-header">
        <h2>招聘投递</h2>
        <p>查看学校招聘岗位并提交个人投递信息。</p>
      </div>

      <div v-if="loading" class="empty-card">正在加载招聘岗位...</div>
      <div v-else-if="plans.length === 0" class="empty-card">暂无启用中的招聘岗位。</div>

      <div v-else class="business-layout">
        <aside class="business-side">
          <button
            v-for="plan in plans"
            :key="plan.id"
            :class="['business-plan-btn', { active: selectedPlan?.id === plan.id }]"
            @click="selectedPlan = plan"
          >
            <strong>{{ plan.title }}</strong>
            <span>{{ plan.department || '招聘岗位' }} / {{ plan.positionCount || 1 }}人</span>
          </button>
        </aside>

        <section class="business-card">
          <h3>{{ selectedPlan?.title }}</h3>
          <p class="muted">招聘部门：{{ selectedPlan?.department || '以学校公告为准' }}</p>
          <p class="muted">报名时间：{{ formatDate(selectedPlan?.startTime) }} 至 {{ formatDate(selectedPlan?.endTime) }}</p>
          <p class="business-desc">{{ selectedPlan?.description || '请按要求填写投递信息。' }}</p>
          <p class="business-desc">{{ selectedPlan?.requirements || '' }}</p>

          <div class="form-grid">
            <label>姓名<input v-model="form.applicantName" placeholder="请输入姓名" /></label>
            <label>性别<select v-model="form.gender"><option value="">请选择</option><option value="男">男</option><option value="女">女</option></select></label>
            <label>联系电话<input v-model="form.phone" placeholder="请输入联系电话" /></label>
            <label>邮箱<input v-model="form.email" placeholder="请输入邮箱" /></label>
            <label>学历<input v-model="form.education" placeholder="例如：本科" /></label>
            <label>专业<input v-model="form.major" placeholder="请输入专业" /></label>
            <label class="full">附件路径<input v-model="form.attachmentUrl" placeholder="可先在后台文件管理上传简历，再填写 /uploads/... 路径" /></label>
            <label class="full">备注<textarea v-model="form.remark" rows="4" placeholder="可填写工作经历、获奖情况等"></textarea></label>
          </div>

          <p v-if="message" class="form-message">{{ message }}</p>
          <button class="submit-btn" :disabled="submitLoading" @click="submit">
            {{ submitLoading ? '提交中...' : '提交投递' }}
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
