import request from '@/utils/request'
// 获取组织架构数据
export function getDepartment() {
  return request({
    url: '/company/department'
  })
}

// 封装转换树型
export function transListToTreeData(list, rootValue) {
  const arr = []
  list.forEach(item => {
    if (item.pid === rootValue) {
      // 找到了匹配的节点
      arr.push(item)
      // 当前节点的id 和 当前节点的子节点的pid是想等的
      const children = transListToTreeData(list, item.id) // 找到的节点的子节点  //递归调用
      // rootValue   item.id  自身调用自身时参数不能重复，参数必须有变化，否则会死循环
      if (children.length) { item.children = children } // 将子节点赋值给当前节点
    }
  })
  return arr
}

// 获取员工列表
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params // 地址参数 查询参数
  })
}

// 获取新增员工
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

//  获取员工详情
export function getEmployeeDetail(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

// 获取编辑员工
export function editEmployee(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

// 删除员工
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 导出excel
export function exportEmployeeExecel() {
  return request({
    url: '/sys/user/export',
    // 改变接收数据的类型
    responseType: 'blob' // 使用blob接收二进制文件流
  })
}

// 封装api 下载导入模板的接口
export function getExportTemplate() {
  return request({
    url: '/sys/user/import/template',
    // 改变接收数据的类型
    responseType: 'blob' // 二进制文件流
  })
}
// 上传execl
export function uploadExcel(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data // form- data类型 因为要上传文件类型
  })
}

// 获取可用的角色
export function getEnableRoleList() {
  return request({
    url: '/sys/role/list/enabled'
  })
}

// 获取角色基本信息
export function getRole(id) {
  return request.get(`/sys/user/${id}`)
}
// 分配员工角色
export function assignRole(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}
