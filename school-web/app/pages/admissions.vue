<script setup lang="ts">
import { admissionsApi, formatDate } from '~/api/business'

useHead({ title: '招生报名 - 学校官网' })

const plans = ref<any[]>([])
const loading = ref(true)
const selectedPlan = ref<any>(null)
const submitLoading = ref(false)
const message = ref('')

const form = reactive({
  studentName: '',
  gender: '',
  idCard: '',
  phone: '',
  school: '',
  grade: '',
  score: '',
  remark: ''
})

async function loadPlans() {
  loading.value = true
  try {
    plans.value = await admissionsApi.listPlans({ status: 'ENABLED' })
    selectedPlan.value = plans.value[0] || null
  } catch (error: any) {
    message.value = error.message || '招生计划读取失败，请确认后端服务是否启动。'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(form, {
    studentName: '',
    gender: '',
    idCard: '',
    phone: '',
    school: '',
    grade: '',
    score: '',
    remark: ''
  })
}

async function submit() {
  message.value = ''
  if (!selectedPlan.value) {
    message.value = '请选择招生计划。'
    return
  }
  if (!form.studentName || !form.idCard || !form.phone) {
    message.value = '请填写学生姓名、身份证号和联系电话。'
    return
  }

  submitLoading.value = true
  try {
    await admissionsApi.submit(selectedPlan.value.id, { ...form })
    message.value = '报名提交成功，请等待学校后续通知。'
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
        <h2>招生报名</h2>
        <p>请选择招生项目并填写报名信息，提交后由学校后台统一管理。</p>
      </div>

      <div v-if="loading" class="empty-card">正在加载招生计划...</div>
      <div v-else-if="plans.length === 0" class="empty-card">暂无启用中的招生计划。</div>

      <div v-else class="business-layout">
        <aside class="business-side">
          <button
            v-for="plan in plans"
            :key="plan.id"
            :class="['business-plan-btn', { active: selectedPlan?.id === plan.id }]"
            @click="selectedPlan = plan"
          >
            <strong>{{ plan.title }}</strong>
            <span>{{ formatDate(plan.startTime) }} 至 {{ formatDate(plan.endTime) }}</span>
          </button>
        </aside>

        <section class="business-card">
          <h3>{{ selectedPlan?.title }}</h3>
          <p class="muted">招生对象：{{ selectedPlan?.target || '以学校公告为准' }}</p>
          <p class="business-desc">{{ selectedPlan?.description || '请按要求填写报名信息。' }}</p>
          <p class="muted">咨询方式：{{ selectedPlan?.contact || '请关注学校通知' }}</p>

          <div class="form-grid">
            <label>学生姓名<input v-model="form.studentName" placeholder="请输入学生姓名" /></label>
            <label>性别<select v-model="form.gender"><option value="">请选择</option><option value="男">男</option><option value="女">女</option></select></label>
            <label>身份证号<input v-model="form.idCard" placeholder="请输入身份证号" /></label>
            <label>联系电话<input v-model="form.phone" placeholder="请输入联系电话" /></label>
            <label>毕业学校<input v-model="form.school" placeholder="请输入毕业学校" /></label>
            <label>年级<input v-model="form.grade" placeholder="例如：六年级" /></label>
            <label>成绩/特长<input v-model="form.score" placeholder="可选" /></label>
            <label class="full">备注<textarea v-model="form.remark" rows="4" placeholder="可填写补充说明"></textarea></label>
          </div>

          <p v-if="message" class="form-message">{{ message }}</p>
          <button class="submit-btn" :disabled="submitLoading" @click="submit">
            {{ submitLoading ? '提交中...' : '提交报名' }}
          </button>
        </section>
      </div>
    </section>
  </main>
</template>
