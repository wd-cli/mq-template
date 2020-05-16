const gulp = require('gulp');
const cleancss = require('gulp-clean-css');
const modules = require('../common');
const { CSS_SUFFIX, HTML_SUFFIX, LEFT_DELIMITER, RIGHT_DELIMITER, ORIGIN_CSS_SUFFIX, ORIGIN_HTML_SUFFIX, publishIgnore } = require('../constants');

let config = require('./config');
let { gobalChangeFileObj, changeFileHandle } = require('../fileWatcher');


gulp.task('copyassets', ['copywxhtml', 'copywxss'], function() {
    if (gobalChangeFileObj) return changeFileHandle();
    //如果assets为空，则直接返回
    if (!config.assets) {
        return null;
    }
    var source = [path.join(config.src, '/**/', config.assets), '!' + path.join(config.src, '/**/', config.ignore)],
        stream;

    !config.dev && config.mode == 1 && source.push('!' + path.join(config.src, '/**/', publishIgnore));

    !config.dev && config.mode == 1 && source.push('!' + path.join(config.src, config.lib, '/**/*'));

    stream = gulp.src(source);

    return stream.pipe(gulp.dest(config.build));
});
gulp.task('copywxhtml', function() {
    if (gobalChangeFileObj) return changeFileHandle();
    if (!config.dev && config.mode == 1) {
        return null;
    }
    var source = [path.join(config.src, config.lib, '/**/*.' + HTML_SUFFIX), '!' + path.join(config.src, '/**/', config.ignore)],
        stream;

    stream = gulp.src(source, {
        base: config.src
    });

    //替换变量
    stream = modules.replace(stream, config.replace);

    !config.dev && config.compress && (stream = stream.pipe(htmlmin()));

    return stream.pipe(gulp.dest(config.build));
});
gulp.task('copywxss', function() {
    if (gobalChangeFileObj) return changeFileHandle();
    if (!config.dev && config.mode == 1) {
        return null;
    }
    var source = [path.join(config.src, config.lib, '/**/*.' + CSS_SUFFIX), '!' + path.join(config.src, '/**/', config.ignore)],
        stream;

    stream = gulp.src(source, {
        base: config.src
    });

    //替换变量
    stream = modules.replace(stream, config.replace);

    stream = modules.replaceCssPath(stream);

    !config.dev && config.compress && (stream = stream.pipe(cleancss()));

    return stream.pipe(gulp.dest(config.build));
});