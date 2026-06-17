import request from './request'

export function getUploads(params = {}) {
  return request.get('/uploads', { params })
}

export function uploadFile(file, module = 'common') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('module', module)
  return request.post('/uploads', formData)
}

export function deleteUpload(id) {
  return request.delete(`/uploads/${id}`)
}
