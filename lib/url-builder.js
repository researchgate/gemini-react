'use strict';
const _ = require('lodash');

class URLBuilder {
    constructor() {
        this._existingRoutes = Object.create(null);
        this._currentJsUrl = null;
        this._namesStack = [];
    }

    /**
     * @param {String} currentJsUrl
     */
    setCurrentPageJSUrl(jsUrl) {
        this._currentJsUrl = jsUrl;
    }

    /**
     * @param {String} name
     */
    pushSuiteName(name) {
        this._namesStack.push(name);
    }

    /**
     * @return {String}
     */
    registerUrl() {
        const url = '/' + this._namesStack
            .map((name) => encodeURIComponent(name))
            .join('/');

        this._existingRoutes[url] = {
            title: this._namesStack.join(' '),
            jsUrl: this._currentJsUrl
        };

        return url;
    }

    popSuiteName() {
        this._namesStack.pop();
    }

    /**
     * @param {String} url
     * @returns {Boolean}
     */
    isUrlRegistered(url) {
        return _.has(this._existingRoutes, url);
    }

    /**
     * @param {String} url
     */
    getTemplateDataFromUrl(url) {
        return this._existingRoutes[url];
    }
}

module.exports = URLBuilder;
