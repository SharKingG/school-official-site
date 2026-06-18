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
