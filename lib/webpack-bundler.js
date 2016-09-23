'use strict';
const _ = require('lodash');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

function readWebpackConfig(filepath) {
    let config = require(filepath);
    if (typeof config === 'function') {
        config = config();
    }
    return config;
}

class WebpackBundler {
    constructor(options) {
        this._webpackConfig = _.assign({}, readWebpackConfig(options.webpackConfig), {
            entry: {},
            output: {
                path: '/',
                filename: '[name]'
            }
        });
        this._lazy = options.webpackLazyMode;
    }

    bundle(chunkName, jsFilePath) {
        this._webpackConfig.entry[chunkName] = [jsFilePath];
    }

    /**
     * @param {String} mountUrl
     */
    buildMiddleware(mountUrl) {
        this._webpackConfig.output.publicPath = mountUrl;
        return webpackMiddleware(webpack(this._webpackConfig), {
            serverSideRender: true,
            publicPath: mountUrl,
            noInfo: true,
            quiet: true,
            lazy: this._lazy
        });
    }
}

module.exports = WebpackBundler;
