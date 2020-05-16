// 监听当前文件变化实例子

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
        if ( extname === '.js' || extname === '.wxss' || extname === '.wxml') {
            //替换变量
            stream = modules.replace(stream, config.replace);
            stream = modules.replaceJsPath(stream);
        }
        return stream.pipe(gulp.dest(config.build + pathname));
    }
}