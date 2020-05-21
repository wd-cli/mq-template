// 监听当前文件变化实例子
const path = require('path');
const modules = require('./common');
const config = require('./config');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const less = require('gulp-less');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const csslint = require('gulp-csslint');                       
const { CSS_SUFFIX } = require('./constants');

let fileWatcher = {
    gobalChangeFileObj: null, // 当前变化的文件对象
    // 文件变化处理
    changeFileHandle() {
        let rootPath = fileWatcher.gobalChangeFileObj.path;
        let pathname,
            extname,
            stream;
            pathname = rootPath.split(config.src)[1];
        pathname = pathname.match(/(.+)\//) ? pathname.match(/(.+)\//)[1] : '';
        extname = path.extname(rootPath);
        stream = gulp.src(rootPath);
        let extnameArr = ['.js','.ts','.wxss','.less','.wxml'];
        if ( extnameArr.indexOf(extname) > -1) {
            //替换变量
            stream = modules.replace(stream, config.replace);
            if (extname === '.js' || extname === '.ts') {
                stream = modules.replaceJsPath(stream);
                if (extname === '.js') {
                    stream = stream
                            .pipe(babel({
                                presets: ['@babel/env']
                            }))
                }else {
                    let tsProject = ts.createProject(config.root + '/tsconfig.json');
                    stream = stream.pipe(tsProject());
                }
            }
            if (extname === '.wxss' || extname === '.less') {
                stream = modules.replaceCssPath(stream);
                if (extname === '.less') {
                    stream = stream.pipe(less())
                    .pipe(rename(function(path) {
                        path.extname = "." + CSS_SUFFIX
                    }))
                    .pipe(csslint());
                }
            }
        }
        return stream.pipe(gulp.dest(config.build + pathname));
    }
}
module.exports = fileWatcher;