'use strict';
var ServerRenderer = require('./server-renderer.js'),
    koa = require('koa'),
    router = require('./router');

class Server {
    constructor() {
        this._suiteNames = [];
        this._renderer = new ServerRenderer();
        this._app = koa();
        this._lastId = 0;

        this._app.use(router.middleware(this._renderer));
    }

    pushSuiteName(name) {
        this._suiteNames.push(name);
    }

    addElement(element) {
        this._renderer.addElement(++this._lastId, element);
        return router.urlFromId(this._lastId);
    }

    popSuiteName() {
        this._suiteNames.pop();
    }

    start() {
        return new Promise(resolve => {
            this._app.listen(3001, '127.0.0.1', function() {
                resolve('http://127.0.0.01:3001');
            });
        });
    }

    stop() {

    }
}

module.exports = Server;
