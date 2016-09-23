'use strict';
const _ = require('lodash');
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
        const commonAssetsObj = _.omitBy(
            res.locals.webpackStats.toJson().assetsByChunkName,
            value => /\.bundle.js$/.test(value)
        );
        const commonAssets = Object.keys(commonAssetsObj).reduce((result, item) => {
            result.push(assetsRoot() + commonAssetsObj[item]);
            return result;
        }, []);

        log(`request to ${req.path}`);
        if (routeBuilder.isUrlRegistered(req.path)) {
            log('this is a test page url');
            const templateData = routeBuilder.getTemplateDataFromUrl(req.path, commonAssets);
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
