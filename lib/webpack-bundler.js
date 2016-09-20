'use strict';
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');

function readWebpackLoaders(filepath) {
    const config = require(filepath);
    if (typeof config === 'function') {
        config = config();
    }
    return config.module.loaders;
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
            resolve: {
                extensions: ['', '.js', '.jsx']
            }
        };
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
            quiet: true
        });
    }
}

module.exports = WebpackBundler;
