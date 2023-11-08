import request from '@/utils/request'

export function submitMessage(obj) {
  return request.post('/sys/messageMuch', obj)
}

// 接收信息

export function receiveInfo() {
  return request.get('/sys/message')
}

// 删除信息
export function deletMessage(id) {
  return request.delete(`/sys/message/${id}`)
}

// 更新状态为已读

export function read(id) {
  return request.put(`/sys/message/${id}`)
}
