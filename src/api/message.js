import request from '@/utils/request'

export function submitMessage(obj) {
  return request.post('/sys/messageMuch', obj)
}

// 接收信息

export function receiveInfo() {
  return request.get('/sys/message')
}
