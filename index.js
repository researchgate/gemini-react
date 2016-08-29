'use strict';
const path = require('path');
const _ = require('lodash');
const wrap = require('./lib/server-suite-wrapper');
const Server = require('./lib/server');

module.exports = function(gemini, options) {
    const projectRoot = gemini.config.system.projectRoot;
    if (_.size(options.cssFiles) > 0 && !options.staticRoot) {
        throw new Error('staticRoot option is required when using cssFiles');
    }
    const server = new Server({
        projectRoot: projectRoot,
        port: options.port || 5432,
        hostname: options.hostname || '127.0.0.1',
        staticRoot: options.staticRoot ? path.resolve(projectRoot, options.staticRoot) : null,
        cssFiles: options.cssFiles || [],
        webpackConfig: path.resolve(projectRoot, options.webpackConfig)
    });

    gemini.on('startRunner', () => {
        return server.start()
            .then(url => {
                setRootUrl(gemini.config, url);
            });
    });

    gemini.on('beforeFileRead', (fileName) => {
        global.geminiReact = wrap(global.gemini, server);
        server.bundleTestFileForBrowser(fileName);
    });

    gemini.on('afterFileRead', () => {
        delete global.geminiReact;
    });

    gemini.on('endRunner', () => server.stop());
};

function setRootUrl(config, url) {
    config.getBrowserIds().forEach(browserId => {
        config.forBrowser(browserId).rootUrl = url;
    });
}
