import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

// 获取权限
export function getPermissions() {
  return request.get('/sys/permission')
}

// 删除权限
export function deletePermissions(id) {
  return request.delete(`/sys/permission/${id}`)
}
