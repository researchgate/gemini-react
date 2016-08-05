'use strict';
var path = require('path');

function assetsRoot() {
    return '/assets/';
}
/**
 * @param {String} testPath
 * @return {String}
 */
function testPathToUrl(testPath) {
    const name = testPath
        .replace(new RegExp(path.sep, 'g'), '-')
        .replace(/\.js$/, '.html');
    return '/' + encodeURIComponent(name);
}

/**
 * @param {String} testPath
 * @return {String}
 */
function testPathToChunkName(testPath) {
    const name = testPath
        .replace(/\//g, '-')
        .replace(/\.js$/, '.bundle.js');
    return encodeURI(name);
}

function testPathToChunkUrl(testPath) {
    return assetsRoot() + testPathToChunkName(testPath);
}

/**
 * @param {String} urlPath
 */
function urlToTestPath(urlPath) {
    const decoded = decodeURIComponent(urlPath);
    return decoded
        .replace(/^\//, '')
        .replace(/\.html$/, '.js')
        .replace(/-/g, path.sep);
}

/**
 * @param {ServerRenderer} renderer
 */
function middleware(renderer) {
    return function* middleware(next) {
        const testPath = urlToTestPath(this.request.path);
        if (testPath && renderer.hasElement(testPath)) {
            const jsUrl = testPathToChunkUrl(testPath);
            this.status = 200;
            this.body = renderer.render(testPath, jsUrl);
        }

        yield next;
    };
}


exports.testPathToUrl = testPathToUrl;
exports.testPathToChunkName = testPathToChunkName;
exports.testPathToChunkUrl = testPathToChunkUrl;
exports.assetsRoot = assetsRoot;
exports.middleware = middleware;
