import request from './request'

export function getSiteSettingsApi(params = {}) {
  return request.get('/site/admin/settings', { params })
}

export function updateSiteSettingsApi(items = []) {
  return request.patch('/site/admin/settings', { items })
}

export function getHomeSectionsApi() {
  return request.get('/site/admin/home-sections')
}

export function createHomeSectionApi(data) {
  return request.post('/site/admin/home-sections', data)
}

export function updateHomeSectionApi(id, data) {
  return request.patch(`/site/admin/home-sections/${id}`, data)
}

export function deleteHomeSectionApi(id) {
  return request.delete(`/site/admin/home-sections/${id}`)
}

export function getBackupRecordsApi() {
  return request.get('/site/admin/backups')
}

export function createBackupRecordApi(data = {}) {
  return request.post('/site/admin/backups', data)
}

export function exportBackupSnapshotApi() {
  return request.get('/site/admin/backups/export')
}
