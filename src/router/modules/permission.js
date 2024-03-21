import layout from '@/layout'
export default {
  path: '/permission',
  component: layout,
  children: [{
    path: '',
    name: 'permission',
    component: () => import('@/views/permission'),
    meta: {
      title: 'Permission',
      icon: 'lock'
    }
  }]
}
