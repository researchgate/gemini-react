'use strict';
const RENDER_TARGET_SELECTOR = '[data-gemini-react]';
class ServerSuireWrapper {
    /**
     * @param {Suite} suite
     * @param {Server} server
     */
    constructor(suite, server) {
        this._original = suite;
        this._server = server;
        let _this = this; // can't use arrow functions for forwarding the call
        Object.keys(suite).forEach((key) => {
            if (!(key in this)) {
                this[key] = function() {
                    suite[key].apply(suite, arguments);
                    return _this;
                };
            }
        });
    }

    render() {
        const url = this._server.registerRender();
        this._original.setUrl(url);
        this._original.setCaptureElements([RENDER_TARGET_SELECTOR]);
        this._original.before(function(actions, find) {
            this.renderedComponent = find(RENDER_TARGET_SELECTOR);
        });
        return this;
    }

    includeCss(cssUrl) {
        this._server.includeCss(cssUrl);
        return this;
    }

    setUrl() {
        throw new Error('Do not call setUrl manually, use render(<ReactComponent />) instead');
    }

    setCaptureElements() {
        throw new Error('Do not call setCaptureElements manually, use render(<ReactComponent />) instead');
    }
}

function wrap(gemini, server) {
    return {
        suite(name, callback) {
            server.pushSuite(name);
            gemini.suite(name, function(suite) {
                callback(new ServerSuireWrapper(suite, server));
            });
            server.popSuite();
        }

    };
}


module.exports = wrap;
