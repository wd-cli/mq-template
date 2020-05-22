const ci = require('miniprogram-ci');
const path = require('path');
const fs = require('fs');
const ora = require('ora');
const { promisify } = require('util');
let ncp = require('ncp');
ncp.limit = 16;
const promisifyNcp = promisify(ncp);
const del = require('del');
const config = require('../config');
const project = require('./ci-project');
;
(async () => {
  let loading;
  let isCache;
  let argv = process.argv[process.argv.length - 1];
  // let project;
  
  loading = ora();
  
  if (!fs.existsSync(config.build)) { // 第一次
    fs.mkdirSync(config.build);
    fs.mkdirSync(config.build + '/node_modules');
    isCache = false;
  } else { // 构建过一次
    if (!fs.existsSync(config.build, + '/node_modules')) {
      fs.mkdirSync(config.build + '/node_modules');
    }
    if (argv === 'init' || argv === 'publish') { // 执行npm run npm:i 重新构建
      if (fs.existsSync(config.build, + '/node_modules')) {
        loading.start('正在清空缓存...');
        del.sync([
          config.build + '/node_modules',
          config.build + '/miniprogram_npm',
          config.build + '/package.json'
        ], { force: true });
        loading.succeed('清空完毕');
        await promisifyNcp(config.root + '/package.json', config.build + '/package.json');
      }
      isCache = false;
    } else {
      isCache = true; // 走缓存
    }
  }
  try {
    if (!isCache) {
      // node_modules拷贝
      loading.start('正在拷贝node_modules...');
      await promisifyNcp(config.root + '/node_modules',config.build + '/node_modules');
      loading.succeed('拷贝完成');

      // 构建npm包
      loading.start('正在构建小程序npm包...');
      await ci.packNpm(project, {
        ignores: [], // 忽略构建的包名
        reporter: (infos) => {
          console.log(infos)
        }
      })
      loading.succeed('构建完成');
    }
    // project = new ci.Project({
    //   appid: ciConfig.appid,
    //   type: 'miniProgram',
    //   projectPath: config.build,
    //   privateKeyPath: ciConfig.privateKeyPath,
    //   ignores: [path.resolve(__dirname, '../build/node_modules/**/*')],
    // })
    
  } catch (error) {
    loading.fail('编译失败');
    console.log(error);
  }
})()