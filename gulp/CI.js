const ci = require('miniprogram-ci');
const path = require('path');
const ora = require('ora');
const { promisify } = require('util');
const ncp = require('ncp');
const promisifyNcp = promisify(ncp);
const config = require('./config');

;
(async () => {
  let loading;
  try {
    loading = ora('正在拷贝node_modules...');
    loading.start();
    await promisifyNcp(path.resolve(__dirname, '../node_modules'), config.build + '/node_modules');
    loading.succeed('拷贝完成');
    loading.start('正在构建小程序npm包...');
    const project = new ci.Project({
      appid: 'wx4b74228baa15489a',
      type: 'miniProgram',
      projectPath: config.build,
      privateKeyPath: path.resolve(__dirname, './private.wx14656bb4e9966e9f.key'),
      ignores: [path.resolve(__dirname, '../build/node_modules/**/*')],
    })
    // 构建npm包
    await ci.packNpm(project, {
      ignores: [], // 忽略构建的包名
      reporter: (infos) => {
        console.log(infos)
      }
    })
    loading.succeed('构建完成');
    // 完成构建npm之后，可用ci.preview或者ci.upload
    // await ci.preview({
    //   project,
    //   desc: '预览测试',
    //   setting: {
    //     es6: true,
    //   },
    //   qrcodeFormat: 'image',
    //   qrcodeOutputDest: `${config.build}/qrcode`, //二维码文件保存路径
    //   onProgressUpdate: console.log,
    //   // pagePath: `${config.build}/preview`, // 预览页面
    //   // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
    //   // proxy: 'your proxy url',
    // })
  } catch (error) {
    loading.fail('构建失败');
    console.log(error);
  }
})()