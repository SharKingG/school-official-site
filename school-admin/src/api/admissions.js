import service from './request'

export const admissionsApi = {
  listPlans(params = {}) {
    return service.get('/admissions/plans', { params })
  },

  getPlan(id) {
    return service.get(`/admissions/plans/${id}`)
  },

  createPlan(data) {
    return service.post('/admissions/plans', data)
  },

  updatePlan(id, data) {
    return service.patch(`/admissions/plans/${id}`, data)
  },

  removePlan(id) {
    return service.delete(`/admissions/plans/${id}`)
  },

  listRecords(planId, params = {}) {
    return service.get(`/admissions/plans/${planId}/records`, { params })
  },

  createRecord(planId, data) {
    return service.post(`/admissions/plans/${planId}/records`, data)
  },

  removeRecord(id) {
    return service.delete(`/admissions/records/${id}`)
  }
}
