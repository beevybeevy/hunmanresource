import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/sys/profile'
  })
}

// 更新密码
export function updatePassword(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}

// 更新用户头像接口   staffPhoto base64格式的头像
export function uploadImg(staffPhoto = '') {
  return request.put('/sys/updateStaffPhoto', {
    staffPhoto
  })
}

// 二维码登录接口

export function getQRCode() {
  return request.get('/sys/qrcodeKey')
}
