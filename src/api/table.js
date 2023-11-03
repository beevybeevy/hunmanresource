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

// 新增权限
export function addPermissions() {
  return request.post('/sys/permission', {
    Headers: {
      'Content-Type': 'application/json'
    },
    dada: {
      name: '',
      code: '',
      description: '',
      type: '',
      pid: '',
      enVisible: ''
    }
  })
}

// 编辑权限
export function redactPermissions(data) {
  return request.put(`/sys/permission/${data.id}`, data)
}

// 页面回显
export function echoPermissions(id) {
  return request.get(`/sys/permission/${id}`)
}
