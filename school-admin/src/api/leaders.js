import request from './request'

export function getLeaders(params = {}) {
  return request.get('/leaders', { params })
}

export function createLeader(data) {
  return request.post('/leaders', data)
}

export function updateLeader(id, data) {
  return request.patch(`/leaders/${id}`, data)
}

export function deleteLeader(id) {
  return request.delete(`/leaders/${id}`)
}
