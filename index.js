'use strict';
const _ = require('lodash');
const setup = require('./lib/setup');

module.exports = function(gemini, options) {
    const server = setup(gemini);
    const replaceRootUrl = _.get(options, 'replaceRootUrl', true);

    gemini.on('startRunner', () => {
        return server.start()
            .then(url => {
                if (replaceRootUrl) {
                    setRootUrl(gemini.config, url);
                }
            });
    });

    gemini.on('endRunner', () => server.stop());
};

function setRootUrl(config, url) {
    config.getBrowserIds().forEach(browserId => {
        config.forBrowser(browserId).rootUrl = url;
    });
}
