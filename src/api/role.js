import request from '@/utils/request'

export function getRoleList(page, pagesize) {
  return request.get('/sys/role', {
    params: {
      page,
      pagesize
    }
  })
}

// 新增角色

export function addRole(name, description, state) {
  return request.post('/sys/role', {
    // headers: {
    //   'Content-Type': 'application/json'
    // },

    name,
    description,
    state

    // name,
    // description,
    // state
  })
}

// 删除角色

export function deleteRole(id) {
  return request.delete(`/sys/role/${id}`)
}

// 获取编辑角色的信息

// export function editRole(id) {
//   return request.get(`/sys/role/${id}`)
// }

// 更新角色信息

export function editRole(obj) {
  return request.put(`/sys/role/${obj.id}`, {

    ...obj
  }
  )
}
