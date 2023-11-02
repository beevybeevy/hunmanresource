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
