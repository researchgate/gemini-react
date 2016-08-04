'use strict';
const wrap = require('./lib/server-suite-wrapper');
const Server = require('./lib/server');

module.exports = function(gemini, options) {
    const server = new Server(options);
    let geminiReact = null;

    Object.defineProperty(global, 'geminiReact', {
        get() {
            if (!geminiReact) {
                geminiReact = wrap(global.gemini, server);
            }
            return geminiReact;
        }
    });

    gemini.on('startRunner', () => {
        return server.start()
            .then(url => {
                setRootUrl(gemini.config, url);
            });
    });

    gemini.on('endRunner', () => server.stop());
};

function setRootUrl(config, url) {
    config.getBrowserIds().forEach(browserId => {
        config.forBrowser(browserId).rootUrl = url;
    });
}
