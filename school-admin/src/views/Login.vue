<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const captcha = ref(makeCaptcha())
const form = reactive({
  username: 'admin',
  password: '123456',
  captcha: ''
})

function makeCaptcha() {
  return String(Math.floor(1000 + Math.random() * 9000))
}

function refreshCaptcha() {
  captcha.value = makeCaptcha()
  form.captcha = ''
}

function login() {
  if (!form.username || !form.password || !form.captcha) {
    ElMessage.warning('请填写账号、密码和验证码')
    return
  }

  if (form.captcha !== captcha.value) {
    ElMessage.error('验证码错误')
    refreshCaptcha()
    return
  }

  if (form.username !== 'admin' || form.password !== '123456') {
    ElMessage.error('账号或密码错误。测试账号：admin，密码：123456')
    return
  }

  localStorage.setItem('school_admin_token', 'mock-token')
  localStorage.setItem('school_admin_name', '管理员')
  ElMessage.success('登录成功')
  router.push('/dashboard')
}
</script>

<template>
  <div class="login-page">
    <section class="login-hero">
      <div>
        <h1>学校官网管理平台</h1>
        <p>
          根据旧版校园网操作手册反推后台功能，覆盖网站栏目、文章、横幅、链接、学校领导、招生、招聘、公共查询和文件管理。
        </p>
      </div>
    </section>

    <section class="login-card-wrap">
      <el-form class="login-card" label-position="top" @submit.prevent="login">
        <h2>用户登录</h2>

        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>

        <el-form-item label="验证码">
          <div class="captcha-row">
            <el-input v-model="form.captcha" placeholder="请输入验证码" />
            <div class="captcha-code" title="点击刷新" @click="refreshCaptcha">{{ captcha }}</div>
          </div>
        </el-form-item>

        <el-button type="primary" style="width: 100%" @click="login">登录</el-button>

        <p class="form-hint" style="margin-top: 16px; text-align: center">
          测试账号：admin　密码：123456
        </p>
      </el-form>
    </section>
  </div>
</template>
