import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminLayout from '../layout/AdminLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import ColumnManager from '../views/columns/ColumnManager.vue'
import ArticlePublish from '../views/articles/ArticlePublish.vue'
import MyArticles from '../views/articles/MyArticles.vue'
import AllArticles from '../views/articles/AllArticles.vue'
import ArticleReview from '../views/articles/ArticleReview.vue'
import BannerManager from '../views/banners/BannerManager.vue'
import LinkManager from '../views/links/LinkManager.vue'
import LeaderManager from '../views/leaders/LeaderManager.vue'
import AdmissionManager from '../views/admissions/AdmissionManager.vue'
import RecruitmentManager from '../views/recruitment/RecruitmentManager.vue'
import PublicQueryManager from '../views/public-query/PublicQueryManager.vue'
import FileManager from '../views/files/FileManager.vue'
import UserManager from '../views/system/UserManager.vue'
import RoleManager from '../views/system/RoleManager.vue'
import OperationLog from '../views/system/OperationLog.vue'
import { getToken, hasPermission } from '../utils/auth'

const routes = [
  { path: '/login', name: 'login', component: Login },
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'dashboard', component: Dashboard, meta: { title: '工作台' } },
      { path: 'columns', name: 'columns', component: ColumnManager, meta: { title: '网站栏目管理', permission: 'category:manage' } },
      { path: 'articles/publish', name: 'articlePublish', component: ArticlePublish, meta: { title: '发布文章', permission: 'article:create' } },
      { path: 'articles/my', name: 'myArticles', component: MyArticles, meta: { title: '管理我的文章', permission: 'article:manage' } },
      { path: 'articles/all', name: 'allArticles', component: AllArticles, meta: { title: '管理所有文章', permission: 'article:manage' } },
      { path: 'articles/review', name: 'articleReview', component: ArticleReview, meta: { title: '文章审核', permission: 'article:review' } },
      { path: 'banners', name: 'banners', component: BannerManager, meta: { title: '横幅管理', permission: 'banner:manage' } },
      { path: 'links', name: 'links', component: LinkManager, meta: { title: '链接管理', permission: 'link:manage' } },
      { path: 'leaders', name: 'leaders', component: LeaderManager, meta: { title: '学校领导', permission: 'leader:manage' } },
      { path: 'admissions', name: 'admissions', component: AdmissionManager, meta: { title: '招生管理', permission: 'admission:manage' } },
      { path: 'recruitments', name: 'recruitments', component: RecruitmentManager, meta: { title: '招聘管理', permission: 'recruitment:manage' } },
      { path: 'public-query', name: 'publicQuery', component: PublicQueryManager, meta: { title: '公共查询', permission: 'query:manage' } },
      { path: 'files', name: 'files', component: FileManager, meta: { title: '文件管理', permission: 'file:manage' } },
      { path: 'system/users', name: 'systemUsers', component: UserManager, meta: { title: '用户管理', permission: 'system:manage' } },
      { path: 'system/roles', name: 'systemRoles', component: RoleManager, meta: { title: '角色权限', permission: 'system:manage' } },
      { path: 'system/logs', name: 'systemLogs', component: OperationLog, meta: { title: '操作日志', permission: 'log:view' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = getToken()

  if (to.path !== '/login' && !token) return '/login'
  if (to.path === '/login' && token) return '/dashboard'

  if (to.meta?.permission && !hasPermission(to.meta.permission)) {
    return '/dashboard'
  }
})

export default router
