'use strict';
const path = require('path');
const wrap = require('./lib/server-suite-wrapper');
const Server = require('./lib/server');

module.exports = function(gemini, options) {
    const server = new Server({
        projectRoot: gemini.config.system.projectRoot,
        port: options.port || 5432,
        hostname: options.hostname || '127.0.0.1',
        webpackConfig: path.resolve(gemini.config.system.projectRoot, options.webpackConfig)
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
