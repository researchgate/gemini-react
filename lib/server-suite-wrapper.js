'use strict';
class ServerSuireWrapper {
    /**
     * @param {Suite} suite
     * @param {Server} serverRenderer
     */
    constructor(suite, serverRenderer) {
        this._original = suite;
        this._server = serverRenderer;
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

    /**
     * @param {ReactElement} element
     */
    render(element) {
        const url = this._server.addElement(element);
        this._original.setUrl(url);
        this._original.setCaptureElements(['[data-gemini-react]']);
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
            gemini.suite(name, function(suite) {
                callback(new ServerSuireWrapper(suite, server));
            });
        }
    };
}


module.exports = wrap;
