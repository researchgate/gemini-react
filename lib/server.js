'use strict';
const path = require('path'),
    http = require('http'),
    url = require('url'),
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
     * @param {String} options.hostname
     * @param {String} options.port
     */
    constructor(options) {
        this._app = koa();
        this._lastId = 0;
        this._bundler = new WebpackBundler(options);
        this._tmpJsStorage = new TmpJsStorage(options);
        this._urlBuilder = new URLBuilder();
        this._tmpJsStorage.init();
        this._projectRoot = options.projectRoot;
        this._hostname = options.hostname;
        this._port = options.port;
        this._httpServer = null;
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
        this._app.use(router.middleware(this._urlBuilder));
        this._app.use(this._bundler.buildMiddlewhare(router.assetsRoot()));
        this._httpServer = http.createServer(this._app.callback());
        return new Promise(resolve => {
            this._httpServer.listen(this._port, this._host, () => {
                resolve(url.format({
                    protocol: 'http',
                    hostname: this._hostname,
                    port: this._port
                }));
            });
        });
    }

    /**
     * @return {Promise}
     */
    stop() {
        return this._tmpJsStorage.cleanup()
            .then(() => this._closeServer());
    }

    _closeServer() {
        return new Promise((resolve) => {
            this._httpServer.close(() => resolve());
        });
    }
}

module.exports = Server;
