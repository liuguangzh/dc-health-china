export default {
  // 大数据登录地址
  login_url: 'http://10.1.85.36:8004/login',
  //   大数据主页
  login_home: 'http://10.1.85.36:8004/home',

  // 文件上传地址
  uploadAddress: 'http://10.1.85.34:9999/upload',

  // 文件下载地址
  downLoadAddress: 'http://10.1.85.34:9999/download',

  /**
   * 登錄服務器地址
   */
  loginServicePath: '/da-login',

  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    // dev: 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/',
    // dev: 'http://localhost:8083',
    dev: '',
    pro: ''
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  },
  /**
   * 根据不同的系统加载不同的路由
   * ChinaHealth //健康中国
   * ResearchPlatform //看科研工作平台
   */
  // sysName: 'ChinaHealth',
  sysName: 'ResearchPlatform'
  // sysName: 'ChinaHealth'
}
