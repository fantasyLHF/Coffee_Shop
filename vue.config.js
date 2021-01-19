module.exports = {//配置页面
    //配置打包路径
    publicPath: process.env.NODE_ENV === 'production' ? './' : './',
    // configureWebpack: {//配置代理
    //     devServer: {
    //         proxy: {
    //             "/banner": {
    //                 // target: 'http://api.zhuishushenqi.com',
    //                 target: 'http://www.kangliuyong.com:10002/',
    //                 changeOrigin: true
    //             },

    //         }
    //     }
    // }
}