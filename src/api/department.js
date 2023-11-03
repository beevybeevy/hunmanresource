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
      const children = transListToTreeData(list, item.id) // 找到的节点的子节点
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

// 获取新增员工列表
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}
