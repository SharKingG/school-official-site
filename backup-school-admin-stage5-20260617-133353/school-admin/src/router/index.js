import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminLayout from '../layout/AdminLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import ColumnManager from '../views/columns/ColumnManager.vue'
import ArticlePublish from '../views/articles/ArticlePublish.vue'
import MyArticles from '../views/articles/MyArticles.vue'
import AllArticles from '../views/articles/AllArticles.vue'
import BannerManager from '../views/banners/BannerManager.vue'
import LinkManager from '../views/links/LinkManager.vue'
import LeaderManager from '../views/leaders/LeaderManager.vue'
import AdmissionManager from '../views/admissions/AdmissionManager.vue'
import RecruitmentManager from '../views/recruitment/RecruitmentManager.vue'
import PublicQueryManager from '../views/public-query/PublicQueryManager.vue'
import FileManager from '../views/files/FileManager.vue'

const routes = [
  { path: '/login', name: 'login', component: Login },
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'dashboard', component: Dashboard, meta: { title: '工作台' } },
      { path: 'columns', name: 'columns', component: ColumnManager, meta: { title: '网站栏目管理' } },
      { path: 'articles/publish', name: 'articlePublish', component: ArticlePublish, meta: { title: '发布文章' } },
      { path: 'articles/my', name: 'myArticles', component: MyArticles, meta: { title: '管理我的文章' } },
      { path: 'articles/all', name: 'allArticles', component: AllArticles, meta: { title: '管理所有文章' } },
      { path: 'banners', name: 'banners', component: BannerManager, meta: { title: '横幅管理' } },
      { path: 'links', name: 'links', component: LinkManager, meta: { title: '链接管理' } },
      { path: 'leaders', name: 'leaders', component: LeaderManager, meta: { title: '学校领导' } },
      { path: 'admissions', name: 'admissions', component: AdmissionManager, meta: { title: '招生管理' } },
      { path: 'recruitments', name: 'recruitments', component: RecruitmentManager, meta: { title: '招聘管理' } },
      { path: 'public-query', name: 'publicQuery', component: PublicQueryManager, meta: { title: '公共查询' } },
      { path: 'files', name: 'files', component: FileManager, meta: { title: '文件管理' } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const token = localStorage.getItem('school_admin_token')

  if (to.path !== '/login' && !token) {
    return '/login'
  }

  if (to.path === '/login' && token) {
    return '/dashboard'
  }
})

export default router
