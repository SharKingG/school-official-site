import request from './request'

export function getLinks(params = {}) {
  return request.get('/links', { params })
}

export function createLink(data) {
  return request.post('/links', data)
}

export function updateLink(id, data) {
  return request.patch(`/links/${id}`, data)
}

export function deleteLink(id) {
  return request.delete(`/links/${id}`)
}
