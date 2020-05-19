// 监听当前文件变化实例子
const path = require('path');
const modules = require('./common');

module.exports = {
    gobalChangeFileObj: null, // 当前变化的文件对象
    // 文件变化处理
    changeFileHandle() {
        var pathname,
            extname,
            stream;
            pathname = this.gobalChangeFileObj.path.split(config.src)[1];
        pathname = pathname.match(/(.+)\//) ? pathname.match(/(.+)\//)[1] : '';
        extname = path.extname(gobalChangeFileObj.path);
        stream = gulp.src(gobalChangeFileObj.path);
        if ( extname === '.js' || extname === '.wxss' ||  extname === '.less'  || extname === '.wxml') {
            //替换变量
            stream = modules.replace(stream, config.replace);
            if (extname === '.js') {
                stream = modules.replaceJsPath(stream);
            }
            if (extname === '.wxss' || extname === '.less') {
                stream = modules.replaceCssPath(stream);
                if (extname === '.less') {
                    stream = stream.pipe(less()).pipe(rename(function(path) {
                        path.extname = "." + CSS_SUFFIX
                    }));
                }
            }
        }
       
        return stream.pipe(gulp.dest(config.build + pathname));
    }
}