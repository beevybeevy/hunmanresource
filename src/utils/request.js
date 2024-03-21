import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import i18n from '@/lang'

const service = axios.create({
  baseURL: '/api',
  timeout: 10000
})

service.interceptors.request.use((config) => {
  // 注入token
  // this.$store.getters
  // store.getters.token => 请求头里面
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, (error) => {
  // 失败执行promise
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
  const { data, message, success } = response.data // 默认json格式
  // 判断是不是Blob
  if (response.data instanceof Blob) return response.data
  // success表示接口返回的数据正确，例如使用手机号密码登录成功
  if (success) {
    return data
  } else {
    // 这里表示不是 success 的情况，这种情况表示接口请求成功，但是响应失败
    // 例如：手机号或者密码错误的情况，请求的HTTP状态码是200，但是响应结果失败
    // 这段代码可以使用卫语句进行优化
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async error => {
  if (error.response.status === 401) {
    Message({ type: 'warning', message: i18n.t('request.timeout') })
    // 说明token超时了
    await store.dispatch('user/logout') // 调用action 退出登录
    //  主动跳到登录页
    router.push('/login') // 跳转到登录页
    return Promise.reject(error)
  }
  // error.message
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})

export default service
