import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: 'Employee',
      icon: 'people'
    }
  }, {
    path: '/employee/detail/:id?', // 员工详情的地址
    component: () => import('@/views/employee/detail.vue'),
    hidden: true, // 表示隐藏在左侧菜单
    meta: {
      title: 'Employee Details' // 显示在导航的文本
    }
  }]
}
