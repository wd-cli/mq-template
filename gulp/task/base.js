const gulp = require('gulp');
const fs = require('fs');
const rename = require('gulp-rename');
const jsonEditor = require('gulp-json-editor');
const less = require('gulp-less');
const del = require('del');
const path = require('path');
const runSequence = require('run-sequence');
const eslint = require('gulp-eslint');
const csslint = require('gulp-csslint');
const modules = require('../common');
let { gobalChangeFileObj, changeFileHandle } = require('../fileWatcher');
const { CSS_SUFFIX, HTML_SUFFIX, LEFT_DELIMITER, RIGHT_DELIMITER, ORIGIN_CSS_SUFFIX, ORIGIN_HTML_SUFFIX, publishIgnore } = require('../constants');

let config = require('../config');

//clean
gulp.task('clean', function() {
    del.sync(config.build, {force: true})
});

// eslint
gulp.task('eslint', function() {
    var source = [path.join(config.src, '/**/*.js'), '!' + path.join(config.src, config.lib, '/**/*.js')];
    return gulp.src(source)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
});
// csslint
gulp.task('csslint', ['default'], function() {
    var source = [path.join(config.build, '/**/*.' + ORIGIN_CSS_SUFFIX)];
    return gulp.src(source)
        .pipe(csslint())
        .pipe(csslint.reporter());
});

gulp.task('json', function() {
    if (config.mode == 1) {
        return null;
    }

    var source = [path.join(config.src, config.pages, '/**/*.' + ORIGIN_HTML_SUFFIX), path.join(config.src, config.lib, '/**/*.' + ORIGIN_HTML_SUFFIX), '!' + path.join(config.src, '/**/', config.ignore)],
        stream,
        temp = path.join(config.build, 'mock/temp'),
        jsonSource = path.join(config.src, 'app.json'),
        files = []

    stream = gulp.src(source, {
        base: config.src
    });

    stream = stream.pipe(rename(function(file) {
        if (file.dirname.indexOf(config.pages) !== -1) {

            var filepath = path.join(config.src, file.dirname, file.basename + '.js')

            // 判断文件是否是页面文件
            fs.exists(filepath, function(exists) {

                if (exists) {
                    var text = fs.readFileSync(filepath, 'utf8');
                    /\bPage\(/gm.test(text) && files.push(path.join(file.dirname, file.basename))
                }
            });
        }
    }))

    return stream.pipe(gulp.dest(temp)).on('end', function() {
        del.sync(temp, {force: true});
        gulp.src(jsonSource)
            .pipe(jsonEditor(function(json) {
                files = (json.pages || []).concat(files);

                // 数组去重
                json.pages = Array.from(new Set(files));
                // subpackage.setPackage(json);

                return json;
            }))
            .pipe(gulp.dest(config.build))
    })
});
// gulp.task('include', function() {
//     if (config.mode == 2) {
//         return null;
//     }

//     var source = [],
//         stream;

//     config.include.forEach(function(name) {
//         source.push(path.join(config.src, config.lib, name, '/**/*'));
//     });

//     stream = gulp.src(source, {
//         base: config.src
//     });

//     return stream.pipe(gulp.dest(config.build));
// });
gulp.task('html', function() {
    if (gobalChangeFileObj) return changeFileHandle();
    var source = [path.join(config.src, '/**/*.' + ORIGIN_HTML_SUFFIX), '!' + path.join(config.src, '/**/', config.ignore)],
        stream;

    !config.dev && config.mode == 1 && source.push('!' + path.join(config.src, config.lib, '/**/*'));

    stream = gulp.src(source);

    //替换变量
    stream = modules.replace(stream, config.replace);

    stream = stream.pipe(rename(function(path) {
        path.extname = "." + HTML_SUFFIX
    }));
    return stream.pipe(gulp.dest(config.build));
});
gulp.task('js', function() {
    if (gobalChangeFileObj) return changeFileHandle();
    var source = [path.join(config.src, '/**/*.js'), '!' + path.join(config.src, '/**/', config.ignore)],
        stream;

    !config.dev && config.mode == 1 && source.push('!' + path.join(config.src, '/**/', publishIgnore));
    !config.dev && config.mode == 1 && source.push('!' + path.join(config.src, config.lib, '/**/*'));

    stream = gulp.src(source);
    //替换变量
    stream = modules.replace(stream, config.replace);
    stream = modules.replaceJsPath(stream);

    return stream.pipe(gulp.dest(config.build));
});
gulp.task('css', function() {
    if (gobalChangeFileObj) return changeFileHandle();
    var source = [path.join(config.src, '/**/*.' + ORIGIN_CSS_SUFFIX), '!' + path.join(config.src, '/**/', config.ignore), '!' + path.join(config.src, config.lib, '/**/*')],
        stream;

    !config.dev && config.mode == 1 && source.push('!' + path.join(config.src, '/**/', publishIgnore));

    stream = gulp.src(source, {
        base: config.src
    });
    //替换变量
    stream = modules.replace(stream, config.replace);
    stream = modules.replaceCssPath(stream);
    stream = stream.pipe(less()).pipe(rename(function(path) {
        path.extname = "." + CSS_SUFFIX
    }));
    //!config.dev && config.compress && (stream = stream.pipe(cleancss()));
    return stream.pipe(gulp.dest(config.build));
});
gulp.task('default', function(cb) {
    var args = [
        'clean', 'copyassets', 'json', ['js', 'css', 'html']
    ];
    //删除目录
    modules.clean();
    //回调函数
    args.push(cb);
    runSequence.apply(null, args);
});

