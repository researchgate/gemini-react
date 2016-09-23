'use strict';
const _ = require('lodash');

/**
 * @param {String} parentName
 * @param {String} suiteName
 * @return {String}
 */
function getFullName(parentName, suiteName) {
    if (!parentName) {
        return suiteName;
    }
    return `${parentName} ${suiteName}`;
}

class RouteBuilder {
    constructor() {
        this._existingRoutes = Object.create(null);
        this._currentJsUrl = null;
        this._suiteStack = [{
            name: '',
            url: '',
            js: [],
            css: []
        }];
    }

    /**
     * @param {String} currentJsUrl
     */
    setCurrentPageJSUrl(jsUrl) {
        this._currentJsUrl = jsUrl;
    }

    /**
     * @param {String} cssUrl
     */
    includeCss(cssUrl) {
        this._getStackTop().css.push(cssUrl);
    }

    /**
     * @param {String} name
     */
    pushSuite(name) {
        this._suiteStack.push(
            this._nextSuite(name)
        );
    }


    popSuite() {
        this._suiteStack.pop();
    }

    /**
     * @param {String} name
     */
    _nextSuite(name) {
        const top = this._getStackTop();

        return {
            fullName: getFullName(top.fullName, name),
            url: `${top.url}/${encodeURIComponent(name)}`,
            js: _.clone(top.js),
            css: _.clone(top.css)
        };
    }

    _getStackTop() {
        return _.last(this._suiteStack);
    }

    /**
     * @return {String}
     */
    buildRoute() {
        const top = this._getStackTop();

        this._existingRoutes[top.url] = {
            title: top.fullName,
            jsUrl: this._currentJsUrl,
            jsList: top.js.concat(this._currentJsUrl),
            cssList: top.css
        };

        return top.url;
    }

    /**
     * @param {String} url
     * @return {Boolean}
     */
    isUrlRegistered(url) {
        return _.has(this._existingRoutes, url);
    }

    /**
     * @param {String} url
     * @param {Object} assets
     * @return {Object}
     */
    getTemplateDataFromUrl(url, commonAssets) {
        this._existingRoutes[url].jsList = _.union(commonAssets, this._existingRoutes[url].jsList);

        return this._existingRoutes[url];
    }
}

module.exports = RouteBuilder;
