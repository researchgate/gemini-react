/* eslint-env browser */
'use strict';
/**
 * This file is included in every test page.
 * Build configuration of the target project is unknown,
 * so we should not make any assumptions about babel availability.
 * This means, no ES2015 here
 */

var ReactDOM = require('react-dom');


function chainNoOp() {
    return this;
}

function SuiteBuilderStub(noOpRender) {
    this.testFileName = '';
    if (noOpRender) {
        this.render = chainNoOp;
    }
}

SuiteBuilderStub.prototype.before = chainNoOp;
SuiteBuilderStub.prototype.after = chainNoOp;
SuiteBuilderStub.prototype.setTolerance = chainNoOp;
SuiteBuilderStub.prototype.capture = chainNoOp;
SuiteBuilderStub.prototype.ignoreElements = chainNoOp;
SuiteBuilderStub.prototype.skip = chainNoOp;
SuiteBuilderStub.prototype.browsers = chainNoOp;

SuiteBuilderStub.prototype.render = function(element) {
    ReactDOM.render(
        element,
        document.querySelector('[data-gemini-react]')
    );
    return this;
};

function suiteNamesFromUrl() {
    var path = window.location.pathname;
    path = path.replace(/^\//, '');
    return path.split('/').map(decodeURIComponent);
}

function buildClientStub() {
    let expectedSuiteNames = suiteNamesFromUrl();

    return {
        suite: function(name, cb) {
            var expectedName = expectedSuiteNames.shift();
            if (name !== expectedName) {
                throw new Error(
                    'Something when wrong: expected sute named"' + expectedName + '", ' +
                    'got "' + name + '" instead'
                );
            }

            // use no-op render util we reach the suite, url points to
            cb(new SuiteBuilderStub(expectedSuiteNames.length > 0));
        }
    };
};

module.exports = buildClientStub;
