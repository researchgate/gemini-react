'use strict';
const path = require('path'),
    http = require('http'),
    url = require('url'),
    RouteBuilder = require('./route-builder'),
    WebpackBundler = require('./webpack-bundler'),
    koa = require('koa'),
    serveStatic = require('koa-static'),
    TmpJsStorage = require('./tmp-js-storage'),
    router = require('./router');

class Server {
    /**
     * @param {Object} options
     * @param {String} options.projectRoot
     * @param {String} options.webpackConfig
     * @param {String} options.hostname
     * @param {String} options.port
     * @param {String?} options.staticRoot
     */
    constructor(options) {
        this._app = koa();
        this._lastId = 0;
        this._bundler = new WebpackBundler(options);
        this._tmpJsStorage = new TmpJsStorage(options);
        this._routeBuilder = new RouteBuilder();
        this._tmpJsStorage.init();
        this._projectRoot = options.projectRoot;
        this._hostname = options.hostname;
        this._staticRoot = options.staticRoot;
        this._port = options.port;
        this._httpServer = null;
        options.cssFiles.forEach(file => this.includeCss(file));
    }

    /**
     * @param {string} name
     */
    pushSuite(name) {
        this._routeBuilder.pushSuite(name);
    }

    popSuite() {
        this._routeBuilder.popSuite();
    }

    registerRender() {
        return this._routeBuilder.buildRoute();
    }

    /**
     * @param {String} reletiveUrl
     */
    includeCss(relativeUrl) {
        if (!this._staticRoot) {
            throw new Error('You must set staticRoot option to be able to include CSS files');
        }
        this._routeBuilder.includeCss(relativeUrl);
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

        this._routeBuilder.setCurrentPageJSUrl(router.testPathToChunkUrl(rootRelativePath));
    }

    /**
     * @return {Promise.<string>}
     */
    start() {
        this._app.use(router.middleware(this._routeBuilder));
        this._app.use(this._bundler.buildMiddlewhare(router.assetsRoot()));
        if (this._staticRoot) {
            this._app.use(serveStatic(this._staticRoot));
        }
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
            if (!this._httpServer) {
                return;
            }
            this._httpServer.close(() => resolve());
        });
    }
}

module.exports = Server;
