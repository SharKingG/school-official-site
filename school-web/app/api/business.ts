const API_BASE_URL = 'http://127.0.0.1:3001/api'

function buildUrl(path: string, query: Record<string, any> = {}) {
  const url = new URL(`${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`)
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })
  return url.toString()
}

async function request(path: string, options: RequestInit = {}, query: Record<string, any> = {}) {
  const response = await fetch(buildUrl(path, query), {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {})
    }
  })

  if (!response.ok) {
    throw new Error(`接口请求失败：${response.status}`)
  }

  const result = await response.json()
  if (result && typeof result === 'object' && 'code' in result) {
    if (result.code === 0) return result.data
    throw new Error(result.message || '请求失败')
  }
  return result
}

export function formatDate(value?: string | null) {
  if (!value) return '不限'
  const text = String(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10)
  const date = new Date(text)
  if (Number.isNaN(date.getTime())) return text
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function resolveFileUrl(url?: string | null) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/uploads/')) return `http://127.0.0.1:3001${url}`
  return url
}

export const admissionsApi = {
  listPlans(params: Record<string, any> = {}) {
    return request('/admissions/plans', {}, params)
  },
  getPlan(id: string | number) {
    return request(`/admissions/plans/${id}`)
  },
  submit(planId: string | number, data: Record<string, any>) {
    return request(`/admissions/plans/${planId}/records`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

export const recruitmentApi = {
  listPlans(params: Record<string, any> = {}) {
    return request('/recruitments/plans', {}, params)
  },
  getPlan(id: string | number) {
    return request(`/recruitments/plans/${id}`)
  },
  submit(planId: string | number, data: Record<string, any>) {
    return request(`/recruitments/plans/${planId}/records`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}

export const publicQueryApi = {
  listProjects(params: Record<string, any> = {}) {
    return request('/public-query/projects', {}, params)
  },
  search(projectId: string | number, data: Record<string, any>) {
    return request(`/public-query/projects/${projectId}/search`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}
