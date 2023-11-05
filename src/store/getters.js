const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // 修改获取用户头像和用户名的方式
  avatar: state => state.user.userInfo.staffPhoto, // 头像
  name: state => state.user.userInfo.username, // 用户名称
  userId: state => state.user.userInfo.userId,
  menus: state => state.user.userInfo.roles?.menus,
  // 操作权限 => 跟按钮绑定
  points: state => state.user.userInfo.roles?.points || [],
  routes: state => state.user.routes
}

export default getters
