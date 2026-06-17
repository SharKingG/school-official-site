import request from './request'

export function loginApi(data) {
  return request.post('/auth/login', data)
}

export function getProfileApi() {
  return request.get('/auth/profile')
}
