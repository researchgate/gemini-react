'use strict';
const path = require('path'),
    ServerRenderer = require('./server-renderer'),
    WebpackBundler = require('./webpack-bundler'),
    koa = require('koa'),
    TmpJsStorage = require('./tmp-js-storage'),
    router = require('./router');

class Server {
    constructor(options) {
        this._suiteNames = [];
        this._renderer = new ServerRenderer();
        this._app = koa();
        this._lastId = 0;
        this._bundler = new WebpackBundler(options);
        this._tmpJsStorage = new TmpJsStorage(options);
        this._tmpJsStorage.init();
        this._projectRoot = options.projectRoot;

        this._app.use(router.middleware(this._renderer));
    }

    pushSuiteName(name) {
        this._suiteNames.push(name);
    }

    addElement(element, filePath) {
        const fileToBundle = this._tmpJsStorage.buildFile(filePath);
        const rootRelativePath = path.relative(this._projectRoot, filePath);
        this._renderer.addElement(rootRelativePath, element);
        this._bundler.bundle(
            router.testPathToChunkName(rootRelativePath),
            fileToBundle
        );
        return router.testPathToUrl(rootRelativePath);
    }

    popSuiteName() {
        this._suiteNames.pop();
    }

    start() {
        return new Promise(resolve => {
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
