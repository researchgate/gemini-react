'use strict';
const htmlTemplate = require('./html-template');
const log = require('debug')('gemini:react');

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
    return function middleware(req, res, next) {
        log(`request to ${req.path}`);
        if (routeBuilder.isUrlRegistered(req.path)) {
            log('this is a test page url');
            const templateData = routeBuilder.getTemplateDataFromUrl(req.path);
            log('template data', templateData);
            res.send(htmlTemplate(templateData));
        }

        next();
    };
}


exports.testPathToChunkName = testPathToChunkName;
exports.testPathToChunkUrl = testPathToChunkUrl;
exports.assetsRoot = assetsRoot;
exports.middleware = middleware;
