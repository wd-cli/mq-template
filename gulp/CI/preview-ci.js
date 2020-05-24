const ci = require('miniprogram-ci');
const ora = require('ora');
const config = require('../config');
const project = require('./ci-project');
;
(async () => {
  let loading;
  loading = ora();
  try {
     // 预览
     loading.start('正在生成预览码...');
     await ci.preview({
       project,
       desc: '预览测试',
       setting: {
         es6: true,
       },
       qrcodeFormat: 'image',
       qrcodeOutputDest: `${config.root}/dist/qrcode.png`, //二维码文件保存路径
       onProgressUpdate: () => {},
       // pagePath: `${config.build}/preview`, // 预览页面
       // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
       // proxy: 'your proxy url',
     })
     loading.succeed('预览码生成成功');
  } catch (error) {
    loading.fail('编译失败');
    console.log(error);
  }
})()
    // await ci.upload({
    //   project,
    //   version: '1.1.1',
    //   desc: 'hello',
    //   setting: {
    //     es6: true,
    //   },
    //   onProgressUpdate: console.log,
    // })