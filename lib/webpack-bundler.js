'use strict';
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

function readWebpackLoaders(filepath) {
    let config = require(filepath);
    if (typeof config === 'function') {
        config = config();
    }
    return config.module.loaders;
}

function readWebpackResolve(filepath) {
    let config = require(filepath);
    if (typeof config === 'function') {
        config = config();
    }
    return config.resolve;
}

class WebpackBundler {
    constructor(options) {
        this._webpackConfig = {
            module: {
                loaders: readWebpackLoaders(options.webpackConfig)
            },
            entry: {},
            output: {
                path: '/',
                filename: '[name]'
            },
            resolve: readWebpackResolve(options.webpackConfig)
        };
        this._lazy = options.webpackLazyMode;
    }

    bundle(chunkName, jsFilePath) {
        this._webpackConfig.entry[chunkName] = [jsFilePath];
    }

    /**
     * @param {String} mountUrl
     */
    buildMiddlewhare(mountUrl) {
        this._webpackConfig.output.publicPath = mountUrl;
        return webpackMiddleware(webpack(this._webpackConfig), {
            publicPath: mountUrl,
            noInfo: true,
            quiet: true,
            lazy: this._lazy
        });
    }
}

module.exports = WebpackBundler;
