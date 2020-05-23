const ci = require('miniprogram-ci');
const fs = require('fs');
const ora = require('ora');
const { promisify } = require('util');
let ncp = require('ncp');
const promisifyNcp = promisify(ncp);
const exec = promisify(require('child_process').exec);
const del = require('del');
const config = require('../config');
const project = require('./ci-project');
;
(async () => {
  let loading;
  let isCache;
  let packageJson;
  let argv = process.argv[process.argv.length - 1];
  let buildPackageJson = config.build + '/package.json';
  let rootPackageJson = config.root + '/package.json';

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
          buildPackageJson
        ], { force: true });
        loading.succeed('清空完毕');
        await promisifyNcp(rootPackageJson, buildPackageJson);
      }
      isCache = false;
    } else {
      isCache = true; // 走缓存
    }
  }
  try {
    if (!isCache) {
      if (!fs.existsSync(buildPackageJson)) {
        await promisifyNcp(rootPackageJson, buildPackageJson);
      }
      packageJson = require(buildPackageJson);
      delete packageJson.devDependencies;
      fs.writeFileSync(buildPackageJson, JSON.stringify(packageJson), {encoding: 'utf8'});
      
      // 安装npm
      loading.start('正在安装npm包...');
      let { stdout, stderr, error } = await exec('npm install',{
        cwd: config.build
      })
      if (error) {
        loading.fail('安装失败');
        del.sync(config.build + '/*' , {force: true});
        console.log(error);
        return
      } 
      console.log(stdout);
      console.log(stderr);
      loading.succeed('安装完成');

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
  } catch (error) {
    del.sync([config.build + '/*'], {force: true});
    loading.fail('编译失败');
    console.log(error);
  }
})()