const path = require('path');
const _ = require('lodash');
const wrap = require('../lib/server-suite-wrapper');
const Server = require('./Server');

/**
 * @return {Server}
 */
function setup(gemini) {
    const projectRoot = gemini.config.system.projectRoot;
    const plugins = gemini.config.system.plugins;

    const options = plugins['react'] || plugins['gemini-react'];

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

    gemini.on('beforeFileRead', (fileName) => {
        global.geminiReact = wrap(global.gemini, server);
        server.bundleTestFileForBrowser(fileName);
    });

    gemini.on('afterFileRead', () => {
        global.geminiReact = wrap(global.gemini, server);
        delete global.geminiReact;
    });

    return server;
}

module.exports = setup;
