import request from './request'

export function getUsersApi(params = {}) {
  return request.get('/system/users', { params })
}

export function createUserApi(data) {
  return request.post('/system/users', data)
}

export function updateUserApi(id, data) {
  return request.patch(`/system/users/${id}`, data)
}

export function resetUserPasswordApi(id, password) {
  return request.patch(`/system/users/${id}/password`, { password })
}

export function deleteUserApi(id) {
  return request.delete(`/system/users/${id}`)
}

export function getRolesApi() {
  return request.get('/system/roles')
}

export function createRoleApi(data) {
  return request.post('/system/roles', data)
}

export function updateRoleApi(id, data) {
  return request.patch(`/system/roles/${id}`, data)
}

export function deleteRoleApi(id) {
  return request.delete(`/system/roles/${id}`)
}

export function getPermissionsApi() {
  return request.get('/system/permissions')
}

export function getOperationLogsApi(params = {}) {
  return request.get('/system/logs', { params })
}
