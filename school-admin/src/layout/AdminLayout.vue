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
  SwitchButton,
  Setting
} from '@element-plus/icons-vue'
import { clearAuth, getAdminName, getRoleName, hasAnyPermission, hasPermission } from '../utils/auth'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => route.path)
const pageTitle = computed(() => route.meta.title || '学校官网后台')
const adminName = computed(() => getAdminName())
const roleName = computed(() => getRoleName())

function can(permission) {
  return hasPermission(permission)
}

function canAny(permissions) {
  return hasAnyPermission(permissions)
}

function logout() {
  clearAuth()
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

          <el-sub-menu v-if="canAny(['category:manage'])" index="website">
            <template #title>
              <el-icon><Menu /></el-icon>
              <span>网站管理</span>
            </template>
            <el-menu-item v-if="can('category:manage')" index="/columns">网站栏目管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu v-if="canAny(['article:create', 'article:manage', 'article:review'])" index="articles">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>文章管理</span>
            </template>
            <el-menu-item v-if="can('article:create')" index="/articles/publish">
              <el-icon><DocumentAdd /></el-icon>
              <span>发布文章</span>
            </el-menu-item>
            <el-menu-item v-if="can('article:manage')" index="/articles/my">管理我的文章</el-menu-item>
            <el-menu-item v-if="can('article:manage')" index="/articles/all">管理所有文章</el-menu-item>
            <el-menu-item v-if="can('article:review')" index="/articles/review">文章审核</el-menu-item>
          </el-sub-menu>

          <el-menu-item v-if="can('banner:manage')" index="/banners">
            <el-icon><Picture /></el-icon>
            <span>横幅管理</span>
          </el-menu-item>

          <el-menu-item v-if="can('link:manage')" index="/links">
            <el-icon><Link /></el-icon>
            <span>链接管理</span>
          </el-menu-item>

          <el-menu-item v-if="can('leader:manage')" index="/leaders">
            <el-icon><UserFilled /></el-icon>
            <span>学校领导</span>
          </el-menu-item>

          <el-menu-item v-if="can('admission:manage')" index="/admissions">
            <el-icon><UserFilled /></el-icon>
            <span>招生管理</span>
          </el-menu-item>

          <el-menu-item v-if="can('recruitment:manage')" index="/recruitments">
            <el-icon><Document /></el-icon>
            <span>招聘管理</span>
          </el-menu-item>

          <el-menu-item v-if="can('query:manage')" index="/public-query">
            <el-icon><Search /></el-icon>
            <span>公共查询</span>
          </el-menu-item>

          <el-menu-item v-if="can('file:manage')" index="/files">
            <el-icon><FolderOpened /></el-icon>
            <span>文件管理</span>
          </el-menu-item>

          <el-sub-menu v-if="canAny(['system:manage', 'log:view'])" index="system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item v-if="can('system:manage')" index="/system/users">用户管理</el-menu-item>
            <el-menu-item v-if="can('system:manage')" index="/system/roles">角色权限</el-menu-item>
            <el-menu-item v-if="can('log:view')" index="/system/logs">操作日志</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div>
          <h1>{{ pageTitle }}</h1>
          <p>第十阶段：用户角色、文章审核和操作日志已接入真实 school-api</p>
        </div>

        <div class="header-actions">
          <el-tag type="success">{{ roleName }}</el-tag>
          <el-tag>{{ adminName }}</el-tag>
          <el-button :icon="SwitchButton" @click="logout">退出登录</el-button>
        </div>
      </el-header>

      <el-main class="admin-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>
