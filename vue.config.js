const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: 'ParseExcel',
        appId: 'com.guakeliao.parseexcel.vue',
        win: {
          icon: './public/favicon.ico',
          target: [
            {
              target: 'nsis',
              arch: ['x64', 'ia32']
            }
          ]
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        mac: {
          icon: './public/favicon.ico'
        },
        linux: {
          icon: './public/favicon.ico',
          target: [
            {
              target: 'AppImage',
              arch: ['x64', 'ia32']
            }
          ]
        },
        files: ['**/*'],
        extraResources: {
          from: './public',
          to: './public',
          filter: ['**/*']
        }
      }
    }
  }
})
