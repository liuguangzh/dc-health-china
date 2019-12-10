const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/'
  : '/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: BASE_URL,
  assetsDir: 'static',
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_a', resolve('src/assets'))
      .set('_v', resolve('src/view'))
      .set('common', resolve('src/common'))
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: {
      // 健康中国
      //  '/api': {
      //    target: 'http://10.1.85.35:8083'
      //  },
      // //科研课题管理
      '/dr-api': {
        // target: 'http://10.33.17.50:8083'
        // target: 'http://192.168.31.181:8188'
        target: 'http://10.1.85.34:88'
        // pathRewrite的作用相当于是替代'/api'，如果接口中是没有api的，那就直接置空，如果接口中有api，那就得写成{'^/api':'/api'}，
        // 可以理解为一个重定向或者重新赋值的功能。
      },
      '/da-': {
        target: 'http://10.1.85.34:88'
        // changeOrigin: true,
        // pathRewrite: {
        //   '^/da-api': 'da-api'
        // }
      }
      // '/da-api': {
      //   target: 'http://10.1.85.34:88',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/da-api/': '/da-'
      //   }
      // }
      // '/register': {
      //   target: 'http://192.168.31.181:8088'
      // },
      // '/logout': {
      //   target: 'http://10.1.85.22:8099'
      // }
      // '/login': {
      //   target: 'http://192.168.31.181:8088'
      // },
      // '/da-': {
      //   target: 'http://192.168.31.181:8088'
      // }
    }
  }
}
