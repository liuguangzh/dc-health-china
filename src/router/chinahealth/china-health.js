export default [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '知识图谱',
      hideInMenu: false,
      icon: 'ios-apps',
      needLogin: false
    },
    component: () => import('_v/chinahealth/index.vue')
  },
  {
    path: '/searchResult.html',
    name: 'searchResult',
    needLogin: false,
    meta: {
      title: '实体搜索结果',
      hideInMenu: true,
      needLogin: false
    },
    component: () => import('_v/chinahealth/search-result/searchResult.vue')
  },
  {
    path:'/classification.html',
    name:"classification",
    meta:{
      title:"指标分类维护",
      hideInMenu:true,
      needLogin:false
    },
    component:()=>import('_v/chinahealth/classification/classification.vue')
  },
  {
    path:"/indicator.html",
    name:"indicator",
    meta:{
      title:"指标维护",
      hideInMenu:true,
      needLogin:false
    },
    component:()=>import('_v/chinahealth/indicator/indicator.vue')

  }
]
