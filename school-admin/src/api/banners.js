import request from './request'

export function getBanners(params = {}) {
  return request.get('/banners', { params })
}

export function createBanner(data) {
  return request.post('/banners', data)
}

export function updateBanner(id, data) {
  return request.patch(`/banners/${id}`, data)
}

export function deleteBanner(id) {
  return request.delete(`/banners/${id}`)
}
