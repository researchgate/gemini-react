'use strict';
var ServerRenderer = require('./server-renderer'),
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

        this._app.use(router.middleware(this._renderer));
    }

    pushSuiteName(name) {
        this._suiteNames.push(name);
    }

    addElement(element, filePath) {
        const fileToBundle = this._tmpJsStorage.buildFile(filePath);
        this._renderer.addElement(++this._lastId, element);
        this._bundler.bundle(this._lastId, fileToBundle);
        return router.urlFromId(this._lastId);
    }

    popSuiteName() {
        this._suiteNames.pop();
    }

    start() {
        return new Promise(resolve => {
            this._app.use(this._bundler.buildMiddlewhare());
            this._app.listen(3001, '127.0.0.1', function() {
                resolve('http://127.0.0.1:3001');
            });
        });
    }

    stop() {
    }
}

module.exports = Server;
