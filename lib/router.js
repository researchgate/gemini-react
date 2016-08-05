'use strict';
var path = require('path');

function assetsRoot() {
    return '/assets/';
}
/**
 * @param {String} testPath
 * @param {Number} slotNumber
 * @return {String}
 */
function buildUrl(testPath, slotNumber) {
    return `/${testPathToUrlPath(testPath)}/${encodeURIComponent(slotNumber)}`;
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
function parseUrl(urlPath) {
    var matches = urlPath.match(/\/(.+?)\/(\d+)/);
    if (!matches) {
        return null;
    }

    return {
        testPath: urlPathToTestPath(matches[1]),
        slotNumber: Number(decodeURIComponent(matches[2]))
    };
}

function testPathToUrlPath(testPath) {
    const name = testPath
        .replace(new RegExp(path.sep, 'g'), '-')
        .replace(/\.js$/, '.html');
    return encodeURIComponent(name);
}

function urlPathToTestPath(urlPath) {
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
        const parsed = parseUrl(this.request.path);
        if (parsed && renderer.hasSlot(parsed.testPath, parsed.slotNumber)) {
            const jsUrl = testPathToChunkUrl(parsed.testPath);
            this.status = 200;
            this.body = renderer.render(parsed.testPath, parsed.slotNumber, jsUrl);
        }

        yield next;
    };
}


exports.buildUrl = buildUrl;
exports.testPathToChunkName = testPathToChunkName;
exports.testPathToChunkUrl = testPathToChunkUrl;
exports.assetsRoot = assetsRoot;
exports.middleware = middleware;
