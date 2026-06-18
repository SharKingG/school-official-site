import service from './request'

export const publicQueryApi = {
  listProjects(params = {}) {
    return service.get('/public-query/projects', { params })
  },

  getProject(id) {
    return service.get(`/public-query/projects/${id}`)
  },

  createProject(data) {
    return service.post('/public-query/projects', data)
  },

  updateProject(id, data) {
    return service.patch(`/public-query/projects/${id}`, data)
  },

  removeProject(id) {
    return service.delete(`/public-query/projects/${id}`)
  },

  listRecords(projectId, params = {}) {
    return service.get(`/public-query/projects/${projectId}/records`, { params })
  },

  createRecord(projectId, data) {
    return service.post(`/public-query/projects/${projectId}/records`, data)
  },

  updateRecord(id, data) {
    return service.patch(`/public-query/records/${id}`, data)
  },

  removeRecord(id) {
    return service.delete(`/public-query/records/${id}`)
  },

  search(projectId, data) {
    return service.post(`/public-query/projects/${projectId}/search`, data)
  }
}
