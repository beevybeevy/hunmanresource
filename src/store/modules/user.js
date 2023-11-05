import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRoutes } from '@/router'

const state = {
  token: getToken(), // 从缓存中读取初始值
  userInfo: {}, // 这里有一个空对象，为了放置后面取数据报错
  routes: constantRoutes
}
const mutations = {
  setToken(state, token) {
    state.token = token
    // 同步到缓存
    setToken(token)
  },
  removeToken(state) {
    // 删除Vuex的token
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setRoutes(state, payload) {
    state.routes = [...constantRoutes, ...payload]
  }
}
const actions = {
  // context上下文，传入参数
  async login(context, data) {
    // console.log(context)
    // console.log(data)
    // todo: 调用登录接口
    const token = await login(data)
    // 返回一个token 123456
    context.commit('setToken', token)
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
  },
  // 退出登录的action
  logout(context) {
    context.commit('removeToken') // 删除token
    context.commit('setUserInfo', {}) // 设置用户信息为空对象
  }
}

export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}
