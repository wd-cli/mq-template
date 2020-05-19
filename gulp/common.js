//公用模块
const util = require('./util');
const del = require('del');
const replace = require('gulp.replace');
const config = require('./config');
const { LEFT_DELIMITER, RIGHT_DELIMITER} = require('./constants');

let common =  {
    flag: false,
    //替换变量
    replace: function(stream, replaceSettings) {
        replaceSettings = replaceSettings || []
        // 非组件开发模式进行替换
        !common.flag && config.mode !== 1 && replaceSettings.push({
            name: "path",
            value: function(args, file) {
                return function(search, file) {
                    var str = util.getRelativePath(file.path, config);

                    return str || search;
                }
            }
        });
        common.flag = true;
        replaceSettings && replaceSettings.forEach(function(value) {
            //获取替换字符串
            var replaceString = util.getReplaceString(value.name, LEFT_DELIMITER, RIGHT_DELIMITER);
            //替换变量
            stream = stream.pipe(replace(replaceString, util.decideRunFunction(value.value, config)));
        });
        return stream;
    },
    replaceCssPath: function(stream) {
        var regxp = /@import[^'"]*['"]([^'"]*)['"]/mg;
        if (config.mode !== 1) {
            stream = stream.pipe(replace(regxp, function(file, matchstr, matchpath) {
                return util.getResolvePath.apply(this, arguments)
            }));
        }
        return stream;
    },
    replaceJsPath: function(stream) {
        var regxp = /require[^('"]*\(['"]([^)'"]*)['"]\)/mg;
        if (config.mode !== 1) {
            stream = stream.pipe(replace(regxp, function(file, matchstr, matchpath) {
                return util.getResolvePath.apply(this, arguments)
            }));
        }
        return stream;
    },
    clean: function() {
        del.sync([
            config.build + '/*',
            // '!' + config.build + '/miniprogram_npm',
            // '!' + config.build + '/node_modules',
            '!' + config.build + '/*.json',
        ],{force: true})
    },
};
module.exports = common;