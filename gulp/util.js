// 工具函数
const path = require('path');
const fs = require('fs');
const config = require('./config');

let util = {
    //获取参数
    getArguments: function(config) {
        return {
            //项目名称
            name: config.name,
            //版本号
            version: config.version,
            //当前环境变量
            environment: config.environment,
            //是否是开发环境
            dev: config.dev,
            //1:组件开发模式，2：项目开发模式
            mode: config.mode
        }
    },
    //决定采用函数运行还是字符串运行
    decideRunFunction: function(arg, config) {
        return typeof arg === 'function' ? arg(this.getArguments(config), config) : arg;
    },
    //获取替换串
    getReplaceString: function(name, leftDelimiter, rightDelimiter) {
        return leftDelimiter && rightDelimiter ? leftDelimiter + name + rightDelimiter : name;
    },
    getRelativePath: function(path, config) {
        var reg = new RegExp('.*' + config.name + '\/' + config.src + '\/(.*)$'),
            matchs = path.match(reg),
            length,
            str = '';

        if (matchs && matchs[1]) {
            length = matchs[1].split('/').length - 1;

            if (!length) {
                str = '.';
            }
            for (var i = 0; i < length; i++) {
                str += '..';

                if (i != length - 1) {
                    str += '/';
                }
            }
        }

        return str;
    },
    getResolvePath: function(file, matchstr, matchpath) {
        var parseResult = path.parse(file.path),
            filepath = path.resolve(parseResult.dir, matchpath);

        if (!path.parse(filepath).ext) {
            filepath += parseResult.ext
        }

        if (fs.existsSync(filepath)) {
            return matchstr;
        } else {
            var str = util.getRelativePath(file.path, config);

            str += '/lib/' + matchpath

            return matchstr.replace(matchpath, str);
        }
    }
};

module.exports = util;