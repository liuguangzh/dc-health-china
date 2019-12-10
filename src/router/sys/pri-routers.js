/**
 * 系统设置相关路由
 **/

import Main from '@/components/main'

export default [
  {
    path: '/system',
    name: 'system',
    component: Main,
    meta: {
      title: '系统管理',
      icon: 'md-settings',
      access: ['user:user:findAll']
    },

    children: [
      {
        path: '/role.html',
        name: 'role_manager',
        meta: {
          title: '角色管理',
          icon: 'md-person'
        },
        component: () => import('@/view/role/role')
      },
      {
        path: '/resource.html',
        name: 'resource_manager',
        meta: {
          title: '资源管理',
          icon: 'md-basket'
        },
        component: () => import('@/view/resource/resource')
      },
      {
        path: '/user-info.html',
        name: 'user_info',
        meta: {
          title: '个人信息',
          icon: 'md-person',
          hideInBread: true
        },
        component: () => import('@/view/user/user-info.vue')
      }
    ]
  }
]
