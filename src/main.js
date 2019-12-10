// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
// 城市选择
import iviewArea from 'iview-area'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import 'iview/dist/styles/iview.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css'
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css'
import 'ag-grid-community/dist/styles/ag-theme-blue.css'
import './index.less'
import '@/assets/icons/iconfont.css'
// 引入jQuery
import '@/assets/jquery/jquery.min.js'
// Mcake工具集
import '@/assets/Mcake/Mcake.js'
// 全屏滚动
import vueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

// iView 样式与主题
import '@/common/less/iview-theme.less'
import 'babel-polyfill'
import VueClipboard from 'vue-clipboard2'
Vue.use(vueAwesomeSwiper)

Vue.use(VueClipboard)
// 实际打包时应该不引入mock
/* eslint-disable */
// console.log(process.env)
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(iviewArea);
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
