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
module.exports = {
    //项目名称
    name: "shop",
    //server端口
    port: 5020,
    src: 'src',
    lib: 'lib',
    build: 'build',
    pages: 'pages',
    //标志环境配置变量，默认为线上环境
    environment: 3,
    //是否是开发环境
    dev: false,
    compress: false,
    mode: 2, //1:组件开发模式，2：项目开发模式
    assets: '*.json',
    ignore: '{bower.json,.bower.json}',
    include: [],
    //replace功能，可替换指定变量
    replace: [{
        //环境变量
        name: "environment",
        value: function(args) {
            return args.mode == 2 ? args.environment : "$$_environment_$$";
        }
    },{
        //埋点A值
        name: "spider_a",
        value: function(args) {
            return args.mode == 2 ? 'ouc4a2' : "$$_spider_a_$$";
        }
    }]
};
