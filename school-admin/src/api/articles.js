import request from './request'

export function getArticlesApi(params = {}) {
  return request.get('/articles', { params })
}

export function getArticleDetailApi(id) {
  return request.get(`/articles/${id}`)
}

export function createArticleApi(data) {
  return request.post('/articles', data)
}

export function updateArticleApi(id, data) {
  return request.patch(`/articles/${id}`, data)
}

export function deleteArticleApi(id) {
  return request.delete(`/articles/${id}`)
}

export function updateArticleTopApi(id, isTop) {
  return request.patch(`/articles/${id}/top`, { isTop })
}
