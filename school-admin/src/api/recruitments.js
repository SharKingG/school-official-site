import service from './request'

export const recruitmentsApi = {
  listPlans(params = {}) {
    return service.get('/recruitments/plans', { params })
  },

  getPlan(id) {
    return service.get(`/recruitments/plans/${id}`)
  },

  createPlan(data) {
    return service.post('/recruitments/plans', data)
  },

  updatePlan(id, data) {
    return service.patch(`/recruitments/plans/${id}`, data)
  },

  removePlan(id) {
    return service.delete(`/recruitments/plans/${id}`)
  },

  listRecords(planId, params = {}) {
    return service.get(`/recruitments/plans/${planId}/records`, { params })
  },

  createRecord(planId, data) {
    return service.post(`/recruitments/plans/${planId}/records`, data)
  },

  removeRecord(id) {
    return service.delete(`/recruitments/records/${id}`)
  }
}
