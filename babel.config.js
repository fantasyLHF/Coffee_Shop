module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [//按需引入vant
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}
