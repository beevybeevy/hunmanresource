import layout from '@/layout'
export default {
  path: '/role',
  component: layout,
  children: [{
    path: '',
    name: 'role',
    component: () => import('@/views/role'),
    meta: {
      title: 'Role',
      icon: 'setting'
    }
  }]
}
