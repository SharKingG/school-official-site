const TOKEN_KEY = 'school_admin_token'
const USER_KEY = 'school_admin_user'
const NAME_KEY = 'school_admin_name'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(NAME_KEY)
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}))
  localStorage.setItem(NAME_KEY, user?.nickname || user?.username || '管理员')
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  } catch (error) {
    return {}
  }
}

export function getAdminName() {
  const user = getUser()
  return user.nickname || user.username || localStorage.getItem(NAME_KEY) || '管理员'
}

export function getRoleName() {
  const user = getUser()
  return user.roleName || user.role || '管理员'
}

export function getPermissions() {
  const user = getUser()
  return Array.isArray(user.permissions) ? user.permissions : []
}

export function hasPermission(permission) {
  const user = getUser()
  if (user.role === 'SUPER_ADMIN') return true
  return getPermissions().includes(permission)
}

export function hasAnyPermission(permissions = []) {
  const user = getUser()
  if (user.role === 'SUPER_ADMIN') return true
  return permissions.some((item) => getPermissions().includes(item))
}

export function clearAuth() {
  removeToken()
}
