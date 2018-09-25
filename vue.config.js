const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  baseUrl: './',
  lintOnSave: false,
  indexPath: 'index.html',
  chainWebpack: config => {
    config.resolve.alias.set('views', resolve('src/views'))
    if (process.env.NODE_ENV === 'production') {
      // 修改打包模板
      config.plugin('html').tap(args => {
        args[0].template = 'public/index.prod.html'
        // 加上属性引号
        args[0].minify.removeAttributeQuotes = false
        return args
      })
      // 忽略文件设置
      config.plugin('copy').tap(args => {
        args[0][0].ignore = [...args[0][0].ignore, 'index.prod.html']
        return args
      })
    }
  },
  configureWebpack: config => {
    // 打包忽略项
    if (process.env.NODE_ENV === 'production') {
      config.externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'better-scroll': 'BScroll'
      }
    }
  }
}
