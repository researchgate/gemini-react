'use strict';
const path = require('path'),
    URLBuilder = require('./url-builder'),
    WebpackBundler = require('./webpack-bundler'),
    koa = require('koa'),
    TmpJsStorage = require('./tmp-js-storage'),
    router = require('./router');

class Server {
    /**
     * @param {Object} options
     * @param {String} options.projectRoot
     * @param {String} options.webpackConfig
     */
    constructor(options) {
        this._app = koa();
        this._lastId = 0;
        this._bundler = new WebpackBundler(options);
        this._tmpJsStorage = new TmpJsStorage(options);
        this._urlBuilder = new URLBuilder();
        this._tmpJsStorage.init();
        this._projectRoot = options.projectRoot;
        this._lastSuitePath = null;
    }

    /**
     * @param {string} name
     */
    pushSuiteName(name) {
        this._urlBuilder.pushSuiteName(name);
    }

    registerRender() {
        return this._urlBuilder.registerUrl();
    }

    /**
     * @param {string} suitePath
     */
    bundleTestFileForBrowser(suitePath) {
        const fileToBundle = this._tmpJsStorage.buildFile(suitePath);
        const rootRelativePath = path.relative(this._projectRoot, suitePath);

        this._bundler.bundle(
            router.testPathToChunkName(rootRelativePath),
            fileToBundle
        );

        this._urlBuilder.setCurrentPageJSUrl(router.testPathToChunkUrl(rootRelativePath));
    }

    popSuiteName() {
        this._urlBuilder.popSuiteName();
    }

    /**
     * @return {Promise.<string>}
     */
    start() {
        return new Promise(resolve => {
            this._app.use(
                router.middleware(this._urlBuilder)
            );
            this._app.use(
                this._bundler.buildMiddlewhare(router.assetsRoot())
            );
            this._app.listen(3001, '127.0.0.1', function() {
                resolve('http://127.0.0.1:3001');
            });
        });
    }

    stop() {
    }
}

module.exports = Server;
