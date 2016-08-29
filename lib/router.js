'use strict';
const htmlTemplate = require('./html-template');

function assetsRoot() {
    return '/assets/';
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
 * @param {RouteBuilder} routeBuilder
 */
function middleware(routeBuilder) {
    return function* middleware(next) {
        if (routeBuilder.isUrlRegistered(this.request.path)) {
            const templateData = routeBuilder.getTemplateDataFromUrl(this.request.path);
            this.status = 200;
            this.body = htmlTemplate(templateData);
        }

        yield next;
    };
}


exports.testPathToChunkName = testPathToChunkName;
exports.testPathToChunkUrl = testPathToChunkUrl;
exports.assetsRoot = assetsRoot;
exports.middleware = middleware;
