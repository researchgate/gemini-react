/* eslint-env browser */
'use strict';
/**
 * This file is included in every test page.
 * Build configuration of the target project is unknown,
 * so we should not make any assumptions about babel availability.
 * This means, no ES2015 here
 */

var ReactDOM = require('react-dom');
function SuiteBuilderStub() {
    this.testFileName = '';
}


function chainNoOp() {
    return this;
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

var clientStub = {
    suite: function(name, cb) {
        cb(new SuiteBuilderStub());
    }
};

module.exports = clientStub;
