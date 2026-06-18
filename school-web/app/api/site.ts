import { siteConfig } from '~/data/site'

const API_BASE_URL = 'http://127.0.0.1:3001/api'
const API_ORIGIN = 'http://127.0.0.1:3001'

export interface WebSiteSettings {
  schoolName: string
  schoolEnglishName: string
  slogan: string
  subSlogan: string
  logo: string
  banner: string
  address: string
  phone: string
  email: string
  postcode: string
  icp: string
  copyrightYear: string
  browserTitle: string
  searchPlaceholder: string
  [key: string]: any
}

export interface WebHomeSection {
  id: number
  title: string
  icon?: string
  categorySlug?: string
  categoryId?: number
  articleLimit?: number
  moreLink?: string
  layout?: string
  sort?: number
  visible?: boolean
}

function resolveAssetUrl(url?: string | null) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/uploads/')) return `${API_ORIGIN}${url}`
  return url
}

async function apiGet(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) throw new Error(`接口请求失败：${response.status}`)
  const result = await response.json()
  if (result && typeof result === 'object' && 'code' in result) {
    if (result.code === 0) return result.data
    throw new Error(result.message || '请求失败')
  }
  return result
}

export function normalizeSiteSettings(data: Record<string, any> = {}): WebSiteSettings {
  const merged: any = {
    ...siteConfig,
    browserTitle: `${siteConfig.schoolName}官网`,
    searchPlaceholder: '文章搜索',
    ...data
  }

  merged.logo = resolveAssetUrl(merged.logo) || siteConfig.logo
  merged.banner = resolveAssetUrl(merged.banner) || siteConfig.banner
  return merged as WebSiteSettings
}

export async function fetchSiteSettings() {
  try {
    const data = await apiGet('/site/settings')
    return normalizeSiteSettings(data || {})
  } catch (error) {
    return normalizeSiteSettings()
  }
}

export async function fetchHomeSections() {
  try {
    const data = await apiGet('/site/home-sections')
    return (Array.isArray(data) ? data : []) as WebHomeSection[]
  } catch (error) {
    return [] as WebHomeSection[]
  }
}

export interface WebNavMenu {
  id: number
  name: string
  label: string
  slug: string
  path: string
  type?: string
  sort?: number
  children: WebNavMenu[]
}

function normalizeNavMenu(item: any): WebNavMenu {
  const slug = String(item?.slug || item?.id || '')
  const path = item?.path || (slug === 'home' ? '/' : `/news?category=${slug}`)

  return {
    id: Number(item?.id || 0),
    name: String(item?.name || item?.label || '未命名菜单'),
    label: String(item?.name || item?.label || '未命名菜单'),
    slug,
    path,
    type: item?.type || 'ARTICLE',
    sort: Number(item?.sort || 0),
    children: Array.isArray(item?.children) ? item.children.map(normalizeNavMenu) : []
  }
}

export function fallbackNavMenus(): WebNavMenu[] {
  return [
    { id: 0, name: '首页', label: '首页', slug: 'home', path: '/', type: 'LINK', sort: 0, children: [] },
    { id: 1, name: '集团动态', label: '集团动态', slug: 'campus', path: '/news?category=campus', type: 'ARTICLE', sort: 1, children: [] },
    { id: 2, name: '党建引领', label: '党建引领', slug: 'party', path: '/news?category=party', type: 'ARTICLE', sort: 2, children: [] },
    { id: 3, name: '学生成长', label: '学生成长', slug: 'student', path: '/news?category=student', type: 'ARTICLE', sort: 3, children: [] },
    { id: 4, name: '教师发展', label: '教师发展', slug: 'teacher', path: '/news?category=teacher', type: 'ARTICLE', sort: 4, children: [] },
    { id: 5, name: '后勤服务', label: '后勤服务', slug: 'service', path: '/news?category=service', type: 'ARTICLE', sort: 5, children: [] },
    { id: 6, name: '教工之家', label: '教工之家', slug: 'staff-home', path: '/news?category=staff-home', type: 'ARTICLE', sort: 6, children: [] },
    { id: 7, name: '招生招聘', label: '招生招聘', slug: 'recruit', path: '/news?category=recruit', type: 'ARTICLE', sort: 7, children: [] },
    { id: 8, name: '校庆专栏', label: '校庆专栏', slug: 'anniversary', path: '/news?category=anniversary', type: 'ARTICLE', sort: 8, children: [] }
  ]
}

export async function fetchNavMenus() {
  try {
    const data = await apiGet('/categories/nav')
    const list = Array.isArray(data) ? data : []
    const normalized = list.map(normalizeNavMenu)
    return normalized.length ? normalized : fallbackNavMenus()
  } catch (error) {
    return fallbackNavMenus()
  }
}
