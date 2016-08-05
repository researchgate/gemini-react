'use strict';
const webpack = require('webpack');
const webpackMiddleware = require('koa-webpack-dev-middleware');
const _ = require('lodash');

function readWebpackConfig(filepath) {
    const config = require(filepath);
    if (typeof config === 'function') {
        return config();
    }
    return config;
}

class WebpackBundler {
    constructor(options) {
        this._webpackConfig = readWebpackConfig(
            options.webpackConfig
        );
        this._webpackConfig.entry = {};
        this._webpackConfig.output = _.merge(this._webpackConfig.output, {
            filename: '[name].js',
            publicPath: '/assets/'

        });
    }

    bundle(id, jsFilePath) {
        this._webpackConfig.entry[id] = [jsFilePath];
    }

    buildMiddlewhare() {
        return webpackMiddleware(webpack(this._webpackConfig), {
            publicPath: '/assets/',
            quiet: true
        });
    }
}

module.exports = WebpackBundler;
