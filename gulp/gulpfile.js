const gulp = require('gulp');
const runSequence = require('run-sequence');
const path = require('path');

let config = require('./config');


require('./task/base');
require('./task/watchTask');
require('./task/copyTask');


//dev 开发环境
gulp.task('dev', function(cb) {
    config.environment = 0;
    config.dev = true;
    runSequence('watch', cb);
});

//dev-daily 开发环境对应测试环境接口
gulp.task('dev-daily', function(cb) {
    config.environment = 1;
    config.dev = true;
    runSequence('watch', cb);
});

//dev-prepare 开发环境对应预发接口
gulp.task('dev-prepare', function(cb) {
    config.environment = 2;
    config.dev = true;
    runSequence('watch', cb);
});

//dev-product 开发环境对应线上接口
gulp.task('dev-product', function(cb) {
    config.environment = 3;
    config.dev = true;
    runSequence('watch', cb);
});

// daily
gulp.task('daily', function(cb) {
    config.environment = 1;
    config.dev = false;
    runSequence('default', cb);
});

// prepare
gulp.task('prepare', function(cb) {
    config.environment = 2;
    config.dev = false;
    runSequence('default', cb);
});

// product
gulp.task('product', function(cb) {
    config.environment = 3;
    config.dev = false;
    runSequence('default', cb);
});

// publish 命令为发布组件
gulp.task('publish', function(cb) {
    config.environment = 3;
    config.dev = false;
    config.mode = 1;
    config.build = path.resolve(__dirname, '../dist');
    runSequence('default', cb);
});