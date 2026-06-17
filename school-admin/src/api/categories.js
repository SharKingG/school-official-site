import request from './request'

export function getCategoriesApi() {
  return request.get('/categories')
}

export function getCategoryTreeApi() {
  return request.get('/categories/tree')
}

export function createCategoryApi(data) {
  return request.post('/categories', data)
}

export function updateCategoryApi(id, data) {
  return request.patch(`/categories/${id}`, data)
}

export function deleteCategoryApi(id) {
  return request.delete(`/categories/${id}`)
}
