<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeFilled,
  Menu,
  DocumentAdd,
  Document,
  Picture,
  Link,
  UserFilled,
  Search,
  FolderOpened,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)
const pageTitle = computed(() => route.meta.title || '学校官网后台')
const adminName = computed(() => localStorage.getItem('school_admin_name') || '管理员')

function logout() {
  localStorage.removeItem('school_admin_token')
  localStorage.removeItem('school_admin_name')
  router.push('/login')
}
</script>

<template>
  <el-container class="admin-shell">
    <el-aside width="248px" class="admin-aside">
      <div class="admin-logo">
        <div class="admin-logo-mark">校</div>
        <div>
          <strong>学校官网管理平台</strong>
          <span>School CMS</span>
        </div>
      </div>

      <el-scrollbar class="aside-scrollbar">
        <el-menu :default-active="activeMenu" router class="admin-menu" background-color="#0b7a3a" text-color="#e9fff3" active-text-color="#ffffff">
          <el-menu-item index="/dashboard">
            <el-icon><HomeFilled /></el-icon>
            <span>工作台</span>
          </el-menu-item>

          <el-sub-menu index="website">
            <template #title>
              <el-icon><Menu /></el-icon>
              <span>网站管理</span>
            </template>
            <el-menu-item index="/columns">网站栏目管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="articles">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>文章管理</span>
            </template>
            <el-menu-item index="/articles/publish">
              <el-icon><DocumentAdd /></el-icon>
              <span>发布文章</span>
            </el-menu-item>
            <el-menu-item index="/articles/my">管理我的文章</el-menu-item>
            <el-menu-item index="/articles/all">管理所有文章</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/banners">
            <el-icon><Picture /></el-icon>
            <span>横幅管理</span>
          </el-menu-item>

          <el-menu-item index="/links">
            <el-icon><Link /></el-icon>
            <span>链接管理</span>
          </el-menu-item>

          <el-menu-item index="/leaders">
            <el-icon><UserFilled /></el-icon>
            <span>学校领导</span>
          </el-menu-item>

          <el-menu-item index="/admissions">
            <el-icon><UserFilled /></el-icon>
            <span>招生管理</span>
          </el-menu-item>

          <el-menu-item index="/recruitments">
            <el-icon><Document /></el-icon>
            <span>招聘管理</span>
          </el-menu-item>

          <el-menu-item index="/public-query">
            <el-icon><Search /></el-icon>
            <span>公共查询</span>
          </el-menu-item>

          <el-menu-item index="/files">
            <el-icon><FolderOpened /></el-icon>
            <span>文件管理</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div>
          <h1>{{ pageTitle }}</h1>
          <p>根据旧版校园网操作手册反推的后台管理原型</p>
        </div>

        <div class="header-actions">
          <el-tag type="success">{{ adminName }}</el-tag>
          <el-button :icon="SwitchButton" @click="logout">退出登录</el-button>
        </div>
      </el-header>

      <el-main class="admin-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>
