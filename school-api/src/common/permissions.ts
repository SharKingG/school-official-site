export const ALL_PERMISSIONS = [
  'dashboard:view',
  'category:manage',
  'article:create',
  'article:manage',
  'article:review',
  'banner:manage',
  'link:manage',
  'leader:manage',
  'admission:manage',
  'recruitment:manage',
  'query:manage',
  'file:manage',
  'site:manage',
  'system:manage',
  'log:view'
]

export const PERMISSION_LABELS: Record<string, string> = {
  'dashboard:view': '查看工作台',
  'category:manage': '栏目管理',
  'article:create': '发布文章',
  'article:manage': '文章管理',
  'article:review': '文章审核',
  'banner:manage': '横幅管理',
  'link:manage': '链接管理',
  'leader:manage': '学校领导',
  'admission:manage': '招生管理',
  'recruitment:manage': '招聘管理',
  'query:manage': '公共查询',
  'file:manage': '文件管理',
  'site:manage': '站点配置',
  'system:manage': '系统管理',
  'log:view': '操作日志'
}

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [...ALL_PERMISSIONS],
  CONTENT_ADMIN: ['dashboard:view', 'article:create', 'article:manage', 'category:manage', 'file:manage', 'site:manage'],
  ADMISSION_ADMIN: ['dashboard:view', 'admission:manage', 'file:manage'],
  RECRUITMENT_ADMIN: ['dashboard:view', 'recruitment:manage', 'file:manage'],
  QUERY_ADMIN: ['dashboard:view', 'query:manage', 'file:manage'],
  REVIEWER: ['dashboard:view', 'article:manage', 'article:review']
}

export function parsePermissions(value?: string | null) {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.map(String)
  } catch (error) {
    // Fallback to comma-separated values.
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function stringifyPermissions(value: string[] = []) {
  return JSON.stringify(Array.from(new Set(value)))
}
