import request from '@/utils/request'

export function getRoleList(page, pagesize) {
  return request.get('/sys/role', {
    params: {
      page,
      pagesize
    }
  })
}
