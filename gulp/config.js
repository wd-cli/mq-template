/**

# 与项目相关的配置

## `environment`变量说明

    0 : 开发
    1 : 测试
    2 : 预发
    3 : 线上

## `args`对象包含的数据

    name: 项目名称
    version: 版本号
    environment: 当前环境变量
    dev: 是否是开发环境
 */
const path = require('path');

let config =  {
    name: "shop",  //项目名称
    port: 5020,  //server端口
    lib: 'lib',
    pages: 'pages',
    environment: 3,  //标志环境配置变量，默认为线上环境
    dev: false,  //是否是开发环境
    compress: false,
    mode: 2, //1:组件开发模式，2：项目开发模式
    assets: '*.{json,png,jpg,gif}',
    ignore: '{bower.json,.bower.json}',
    root: path.resolve(__dirname, '../'),
    src: path.resolve(__dirname, '../src'),
    build: path.resolve(__dirname, '../build'),
    // alias: { // 配置别名
    //     '@@common': function() {

    //     }
    // },
    dependencies: function() {   // 依赖列表
        let packageJson = require(config.root + '/package.json');
        let { dependencies } = packageJson;
        dependencies = Object.keys(dependencies);
        return dependencies;
    },
    replace: [
        {   //replace功能，可替换指定变量
            //环境变量
            name: "environment",
            value: function(args) {
                return args.mode == 2 ? args.environment : "$$_environment_$$";
            }
        },
        {
            //埋点A值
            name: "spider_a",
            value: function(args) {
                return args.mode == 2 ? 'ouc4a2' : "$$_spider_a_$$";
            }
        }
    ],
};
module.exports = config;

