'use strict';
const path = require('path'),
    url = require('url'),
    http = require('http'),
    log = require('debug')('gemini:react'),
    RouteBuilder = require('./route-builder'),
    WebpackBundler = require('./webpack-bundler'),
    express = require('express'),
    TmpJsStorage = require('./tmp-js-storage'),
    router = require('./router');

function promisifyCall(fn, context, args) {
    args = args || [];
    return new Promise((resolve, reject) => {
        const callback = (error, result) => {
            if (error) {
                return reject(error);
            }

            resolve(result);
        };
        const argsWithCallback = args.concat(callback);
        fn.apply(context, argsWithCallback);
    });
}

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
        this._app = express();
        this._lastId = 0;
        this._bundler = new WebpackBundler(options);
        this._tmpJsStorage = new TmpJsStorage(options);
        this._routeBuilder = new RouteBuilder();
        this._tmpJsStorage.init();
        this._projectRoot = options.projectRoot;
        this._listenHost = options.listenHost;
        this._publicHost = options.publicHost;
        this._staticRoot = options.staticRoot;
        this._port = options.port;
        this._httpServer = null;
        this._customizeServer = options.customizeServer;
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
        this._setupMiddleware();
        this._httpServer = http.createServer(this._app);
        return promisifyCall(
                this._httpServer.listen,
                this._httpServer,
                [this._port, this._listenHost]
            )
            .then(() => url.format({
                protocol: 'http',
                hostname: this._publicHost,
                port: this._port
            }));
    }

    _setupMiddleware() {
        this._app.use(router.middleware(this._routeBuilder));
        this._bundlerMiddleware = this._bundler.buildMiddlewhare(router.assetsRoot());
        this._app.use(this._bundlerMiddleware);
        this._customizeServer(this._app, express);
        if (this._staticRoot) {
            this._app.use(express.static(this._staticRoot));
        }
    }

    /**
     * @return {Promise}
     */
    stop() {
        return this._tmpJsStorage.cleanup()
            .then(() => this._stopWatch())
            .then(() => this._closeServer())
            .then(() => log('stopped server'));
    }

    _stopWatch() {
        if (!this._bundlerMiddleware) {
            return Promise.resolve();
        }
        return promisifyCall(
            this._bundlerMiddleware.close,
            this._bundlerMiddleware
        );
    }

    _closeServer() {
        if (!this._httpServer) {
            return Promise.resolve();
        }
        return promisifyCall(
            this._httpServer.close,
            this._httpServer
        );
    }
}

module.exports = Server;
