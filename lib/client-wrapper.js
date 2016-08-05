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

function getTargetSlot() {
    var match = window.location.pathname.match(/\/(\d+)$/);
    return Number(match[1]);
}

function buildClientStub() {
    var currentSlot = 0;
    var targetSlot = getTargetSlot();

    function SuiteBuilderStub() {
        this.testFileName = '';
    }

    SuiteBuilderStub.prototype.before = chainNoOp;
    SuiteBuilderStub.prototype.after = chainNoOp;
    SuiteBuilderStub.prototype.setTolerance = chainNoOp;
    SuiteBuilderStub.prototype.capture = chainNoOp;
    SuiteBuilderStub.prototype.ignoreElements = chainNoOp;
    SuiteBuilderStub.prototype.skip = chainNoOp;
    SuiteBuilderStub.prototype.browsers = chainNoOp;

    SuiteBuilderStub.prototype.render = function(element) {
        currentSlot++;
        if (targetSlot !== currentSlot) {
            return this;
        }
        ReactDOM.render(
            element,
            document.querySelector('[data-gemini-react]')
        );
        return this;
    };

    return {
        suite: function(name, cb) {
            cb(new SuiteBuilderStub());
        }
    };
};

module.exports = buildClientStub;
