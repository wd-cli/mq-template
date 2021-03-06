
const gulp = require('gulp');
const path = require('path');
const childProcess = require('child_process');
const config = require('../config');
const runSequence = require('run-sequence');
const { ORIGIN_CSS_SUFFIX, CSS_SUFFIX, ORIGIN_HTML_SUFFIX } = require('../constants');

let fileWatcher = require('../fileWatcher');

//server
function startServer() {
    var child = childProcess.spawn('node', ['server']);

    child.on('error', function(e) {
        console.log('server error');
    });
    child.on('exit', function(e) {
        console.log('server exit');
    });
    child.stderr.on('data', function(data) {
        console.log(data.toString());
    });
    process.once('exit', function() {
        console.log('process exit');
        child && child.kill();
    });
    process.once('error', function() {
        console.log('process error');
        child && child.kill();
    });
    console.log('服务启动。地址 http://h5.dev.weidian.com:' + config.port);
}

gulp.task('watch', ['default'], function(cb) {
    startServer();
    //watch html
    var source = [path.join(config.src, '/**/*.' + ORIGIN_HTML_SUFFIX)];
    gulp.watch(source, function(event) {
        fileWatcher.gobalChangeFileObj = event;
        gulp.start('html');
    });
    //watch less wxss
    source = [path.join(config.src, '/**/*.' + `{${ORIGIN_CSS_SUFFIX},${CSS_SUFFIX}}`)];
    gulp.watch(source, function(event) {
        fileWatcher.gobalChangeFileObj = event;
        gulp.start('css');
    });
    //watch assets
    source = [path.join(config.src, '/**/', String(config.assets))];
    gulp.watch(source, function(event) {
        fileWatcher.gobalChangeFileObj = event;
        runSequence('copyassets', 'json');
    });
    //watch js
    source = [path.join(config.src, '/**/*.js')];
    gulp.watch(source, function(event) {
        fileWatcher.gobalChangeFileObj = event;
        gulp.start('js');
    });
    //watch ts
    source = [path.join(config.src, '/**/*.ts')];
    gulp.watch(source, function(event) {
        fileWatcher.gobalChangeFileObj = event;
        gulp.start('ts');
    });
});