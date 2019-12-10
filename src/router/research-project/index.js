/**
 * 配置科研管理平台路由
 */
import Main from '@/components/main'

export default [
  { // 科研任务管理
    path: '/research',
    name: 'research',
    component: Main,
    meta: {
      title: '科研任务管理',
      icon: 'md-construct'
    },
    children: [{
      path: '/project.html',
      name: 'project',
      meta: {
        title: '创建科研任务',
        icon: 'md-basket'
      },
      component: () => import('@/view/research-platform/project/create-project.vue')
    }, {
      path: '/project-info.html',
      name: 'projectInfo',
      meta: {
        hideInMenu: true,
        hideInBread: true,
        title: '科研任务详情查看',
        icon: 'md-basket'
      },
      component: () => import('@/view/research-platform/project/project-info.vue')
    }, {
      path: '/project-by-template.html',
      name: 'projectByTemplate',
      meta: {
        hideInMenu: true,
        hideInBread: true,
        title: '按模板创建任务',
        icon: 'md-basket'
      },
      component: () => import('@/view/research-platform/project/create-projectby-template.vue')
    }, {
      path: '/set-research-project.html',
      name: 'setResearchProject',
      meta: {
        title: '设置科研任务',
        icon: 'md-apps'
      },
      component: () => import('@/view/research-platform/project/set-research-project.vue')
    }, {
      path: '/form-manage.html',
      name: 'formManage',
      meta: {
        hideInMenu: true,
        hideInBread: true,
        title: '表单管理',
        icon: 'md-apps'
      },
      component: () => import('@/view/research-platform/form/form-manage.vue')
    }, {
      path: '/fill-list-personnel.html',
      name: 'fillListPersonnel',
      meta: {
        hideInMenu: true,
        hideInBread: true,
        title: '填报人员列表',
        icon: 'md-apps'
      },
      component: () => import('@/view/research-platform/form/fill-list-personnel.vue')
    }, {
      path: '/form-fill-query.html',
      name: 'projectFillFind',
      meta: {
        title: '任务填报查询',
        icon: 'md-apps'
      },
      component: () => import('@/view/research-platform/project/project-fill-find.vue')
    }, {
      path: '/page-info.html',
      name: 'pageInfo',
      meta: {
        hideInMenu: true,
        hideInBread: true,
        title: '查询表单信息',
        icon: 'md-apps'
      },
      component: () => import('@/view/research-platform/form/page-info.vue')
    }, {
      path: '/fill-index.html',
      name: 'fillIndex',
      meta: {
        hideInMenu: true,
        hideInBread: true,
        title: '查看详情',
        icon: 'md-apps'
      },
      component: () => import('@/view/research-platform/form/fill-index.vue')
    }, {
      path: '/project-member.html',
      name: 'projectMemeber',
      meta: {
        hideInMenu: true,
        hideInBread: true,
        title: '项目组成员管理',
        icon: 'md-apps'
      },
      component: () => import('@/view/research-platform/project/project-member.vue')
    }]
  }, { // 科研任务填报
    path: '/fill-research',
    name: 'FillResearch',
    component: Main,
    redirect: '/fill-list.html',
    meta: {
      title: '科研任务填报',
      icon: 'md-desktop'
    },
    children: [{
      path: '/fill-list.html',
      name: 'fillList',
      component: () => import('@/view/research-platform/fill-project/fill-project-list.vue'),
      meta: {
        title: '科研任务填报记录',
        hideInMenu: true
      }
    }, {
      path: '/fill-wait-list.html',
      name: 'waitfillList',
      component: () => import('@/view/research-platform/fill-project/fill-wait-project-list.vue'),
      meta: {
        hideInMenu: true,
        title: '待填报任务'
      }
    }, {
      path: '/appointReport.html',
      name: 'appointReport',
      component: () => import('@/view/research-platform/fill-project/appoint-report.vue'),
      meta: {
        title: '指定填报'
      }
    }, {
      path: '/applyReport.html',
      name: 'applyReport',
      component: () => import('@/view/research-platform/fill-project/apply-report.vue'),
      meta: {
        title: '申请填报'
      }
    }, {
      path: '/publicReport.html',
      name: 'publicReport',
      component: () => import('@/view/research-platform/fill-project/public-report.vue'),
      meta: {
        title: '公开填报'
      }
    }]
  }, { // 数据分析
    path: '/data-analysis',
    name: 'dataAnalysis',
    meta: {
      title: '数据分析',
      icon: 'md-analytics'
    },
    component: Main,
    children: [{
      path: 'data-browse',
      name: 'dataBrowse',
      meta: {
        title: '数据浏览',
        icon: 'md-browsers'
      },
      component: () => import('@/view/research-platform/template-data/data-analysis.vue')
    },
    {
      path: 'data-analysis-sub',
      name: 'dataAnalysisSub',
      meta: {
        title: '数据分析',
        icon: 'md-analytics'
      },
      component: () => import('@/view/research-platform/template-data/data-analysis-sub.vue')
    },
    {
      path: 'data-report-exhibition',
      name: 'dataReportExhibition',
      meta: {
        title: '报告生成及展示',
        icon: 'md-apps'
      },
      component: () => import('@/view/research-platform/template-data/report/data-report-exhibition.vue')
    }
    ]
  }, { // 模板管理
    path: '/template',
    name: 'template',
    meta: {
      hideInMenu: false,
      title: '模板管理',
      icon: 'md-add-circle'
    },
    component: Main,
    children: [{
      path: '/my-template.html',
      name: 'myTemplate',
      meta: {
        title: '我的模板'
      },
      component: () => import('@/view/research-platform/template/my-template.vue')
    }, {
      path: '/sys-template.html',
      name: 'sysTemplate',
      meta: {
        title: '系统模板'
      },
      component: () => import('@/view/research-platform/template/sys-template.vue')
    }, {
      path: '/template-manage.html',
      name: 'templateManage',
      meta: {
        hideInMenu: true,
        hideInBread: true,
        title: '表单管理',
        icon: 'md-apps'
      },
      component: () => import('@/view/research-platform/form/form-manage.vue')
    }, {
      path: '/task-kind.html',
      name: 'taskKind',
      meta: {
        title: '任务分类'
      },
      component: () => import('@/view/research-platform/template/task-kind.vue')
    }]
  }, { // 系统设置
    path: '/system-setup',
    name: 'systemsetup',
    meta: {
      hideInMenu: false,
      title: '系统设置',
      icon: 'md-settings'
    },
    component: Main,
    children: [{
      path: '/user-info.html',
      name: 'userinfo',
      meta: {
        title: '个人信息',
        icon: 'md-person'
      },
      component: () => import('@/view/user/user-info.vue')
    }]
  }, {
    path: '/form-page-design.html',
    name: 'formPageDesign',
    meta: {
      hideInMenu: true,
      hideInBread: true,
      title: '表单设计',
      icon: 'md-apps'
    },
    component: () => import('@/view/research-platform/form/form-page-design.vue')
  }, {
    path: '/print-page.html',
    name: 'printPage',
    meta: {
      hideInMenu: true,
      hideInBread: true,
      title: '表单打印',
      icon: 'md-apps'
    },
    component: () => import('@/view/research-platform/form/print-page.vue')
  }, {
    path: '/form-fill.html',
    name: 'formFill',
    meta: {
      hideInMenu: true,
      hideInBread: true,
      title: '表单填报',
      icon: 'md-apps'
    },
    component: () => import('@/view/research-platform/fill-project/fill-form.vue')
  }, {
    path: '/report/:code',
    name: 'report',
    meta: {
      title: '填报',
      needLogin: false,
      hideInMenu: true
    },
    component: () => import('@/view/research-platform/report/report.vue')
  }, {
    path: '/:resultId/report',
    name: 'report-need-login',
    meta: {
      title: '填报',
      needLogin: false,
      hideInMenu: true
    },
    component: () => import('@/view/research-platform/report/report-need-login.vue')
  }, {
    path: '/edit-report.html',
    name: 'editorReport',
    meta: {
      hideInMenu: true,
      hideInBread: true,
      title: '报告设计',
      icon: 'md-apps'
    },
    component: () => import('@/view/research-platform/template-data/report/edit-report.vue')
  }, {
    path: '/export-report.html',
    name: 'exportReport',
    meta: {
      hideInMenu: true,
      hideInBread: true,
      title: '导出报告',
      icon: 'md-apps'
    },
    component: () => import('@/view/research-platform/template-data/report/export-report.vue')
  }]
