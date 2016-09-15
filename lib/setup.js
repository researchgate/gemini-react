const path = require('path');
const _ = require('lodash');
const wrap = require('../lib/server-suite-wrapper');
const Server = require('./Server');

/**
 * @return {Server}
 */
function setup(gemini) {
    const projectRoot = gemini.config.system.projectRoot;
    const rootRelative = relPath => path.resolve(projectRoot, relPath);
    const plugins = gemini.config.system.plugins;

    const options = plugins['react'] || plugins['gemini-react'];

    if (_.size(options.cssFiles) > 0 && !options.staticRoot) {
        throw new Error('staticRoot option is required when using cssFiles');
    }

    const server = new Server({
        projectRoot: projectRoot,
        port: options.port || 5432,
        hostname: options.hostname || '127.0.0.1',
        staticRoot: options.staticRoot ? rootRelative(options.staticRoot) : null,
        cssFiles: options.cssFiles || [],
        jsModules: options.jsModules ? options.jsModules.map(rootRelative) : [],
        webpackConfig: rootRelative(options.webpackConfig),
        customizeServer: options.customizeServer
            ? require(rootRelative(options.customizeServer))
            : _.noop
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
