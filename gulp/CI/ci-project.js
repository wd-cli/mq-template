const ci = require('miniprogram-ci');
const ciConfig = require('./ci-config');
const config = require('../config');

let argv = process.argv[process.argv.length - 1];
module.exports = new ci.Project({
    appid: ciConfig.appid,
    type: 'miniProgram',
    projectPath: argv === 'preivew' ? config.root + '/dist' : config.build,
    privateKeyPath: ciConfig.privateKeyPath,
    ignores: [argv === 'preview' ? config.root + '/dsit/node_modules/**/*' : config.root + '/build/node_modules/**/*'],
})