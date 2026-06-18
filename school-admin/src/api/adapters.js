export const STATUS_TO_CN = {
  DRAFT: '草稿',
  PENDING: '待审核',
  PUBLISHED: '已发布',
  OFFLINE: '已下架'
}

export const STATUS_TO_API = {
  草稿: 'DRAFT',
  待审核: 'PENDING',
  已发布: 'PUBLISHED',
  已下架: 'OFFLINE'
}

export const TYPE_TO_CN = {
  NORMAL: '普通文章',
  EXTERNAL_LINK: '外链文章'
}

export const TYPE_TO_API = {
  普通文章: 'NORMAL',
  图片文章: 'NORMAL',
  外链文章: 'EXTERNAL_LINK'
}

export function formatDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  const pad = (num) => String(num).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function apiCategoryToTreeNode(item) {
  return {
    id: item.id,
    label: item.name,
    name: item.name,
    slug: item.slug,
    parentId: item.parentId,
    type: item.type === 'LINK' ? '自定义链接' : '普通栏目',
    rawType: item.type || 'ARTICLE',
    path: item.path || '',
    sort: item.sort || 0,
    status: item.status === 'DISABLED' ? '停用' : '启用',
    rawStatus: item.status || 'ENABLED',
    children: (item.children || []).map(apiCategoryToTreeNode)
  }
}

export function apiCategoryToOption(item) {
  return {
    label: item.name,
    value: item.id,
    id: item.id,
    slug: item.slug,
    parentId: item.parentId
  }
}

export function flattenCategoryTree(tree, result = []) {
  for (const item of tree) {
    result.push(apiCategoryToOption(item))
    if (item.children?.length) flattenCategoryTree(item.children, result)
  }
  return result
}

export function apiArticleToAdmin(item) {
  return {
    id: item.id,
    title: item.title,
    category: item.categoryId,
    categoryId: item.categoryId,
    categoryName: item.category?.name || '',
    type: TYPE_TO_CN[item.type] || '普通文章',
    status: STATUS_TO_CN[item.status] || item.status || '草稿',
    author: item.author || item.creator?.nickname || '管理员',
    department: item.department || '',
    source: item.source || '学校官网',
    publishTime: formatDateTime(item.publishedAt || item.createdAt),
    isTop: Boolean(item.isTop),
    linkUrl: item.linkUrl || '',
    listImage: item.listImage || '',
    headerImage: item.headImage || '',
    carouselImage: item.coverImage || '',
    attachmentName: item.files?.[0]?.fileName || '',
    content: item.content || '',
    summary: item.summary || '',
    raw: item
  }
}

export function adminArticleToApi(form, status) {
  const payload = {
    title: form.title?.trim(),
    summary: form.summary || (form.content || '').slice(0, 120),
    content: form.content || '',
    categoryId: Number(form.category || form.categoryId),
    author: form.author || '管理员',
    source: form.source || '学校官网',
    department: form.department || '',
    type: TYPE_TO_API[form.type] || 'NORMAL',
    status: STATUS_TO_API[status || form.status] || status || 'DRAFT',
    linkUrl: form.linkUrl || '',
    coverImage: form.carouselImage || '',
    listImage: form.listImage || '',
    headImage: form.headerImage || '',
    isTop: Boolean(form.isTop),
    sort: Number(form.sort || 0)
  }

  if (form.publishTime) {
    payload.publishedAt = new Date(form.publishTime).toISOString()
  }

  return payload
}
