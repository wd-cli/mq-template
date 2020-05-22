const ci = require('miniprogram-ci');
const ciConfig = require('./ci-config');
const config = require('../config');
const path = require('path');

module.exports = new ci.Project({
    appid: ciConfig.appid,
    type: 'miniProgram',
    projectPath: config.build,
    privateKeyPath: ciConfig.privateKeyPath,
    ignores: [path.resolve(__dirname, '../build/node_modules/**/*')],
})