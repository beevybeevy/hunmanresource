import request from '@/utils/request'

export function getLocationListAPI() {
  return request.get('/company/list')
}
