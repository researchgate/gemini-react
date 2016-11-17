/* eslint-env browser */
'use strict';

const React = require('react');
const path = require('path');
const ReactDOM = require('react-dom');
const sinon = require('sinon');
const assert = require('chai').assert;
const injectDom = require('jsdom-global');

describe('client wrapper', () => {
    const sandbox = sinon.sandbox.create();
    let cleanupDom;

    function setupDom(urlPathName) {
        urlPathName = urlPathName || '';
        cleanupDom = injectDom(null, {
            url: `http://example.com/${urlPathName}`
        });
    }

    function loadWrapper() {
        const absPath = path.resolve(__dirname, '..', 'lib', 'client-wrapper.js');
        delete require.cache[absPath];
        return require(absPath);
    }

    afterEach(() => {
        sandbox.restore();
        cleanupDom();
    });

    describe('render', () => {
        let wrapped;


        function setupDomAndSuites(options) {
            setupDom(options.urlPathName);

            const createWrapper = loadWrapper();
            const geminiReact = createWrapper();

            geminiReact.suite(options.parentSuite, () => {
                geminiReact.suite(options.childSuite, (suite) => {
                    wrapped = suite;
                });
            });
        }

        describe('when suite path matches the URL', () => {
            function checkIfRendersTheElement() {
                const element = React.createElement('span', null, 'Example');
                sandbox.stub(ReactDOM, 'render');

                wrapped.render(element);

                assert.calledWith(ReactDOM.render, element);
            }

            it('should render react element', () => {
                setupDomAndSuites({
                    urlPathName: 'some/suite',
                    parentSuite: 'some',
                    childSuite: 'suite'
                });
                checkIfRendersTheElement();
            });

            it('should account for url encoding', () => {
                setupDomAndSuites({
                    urlPathName: 'some%20suite%20with%20spaces/suite',
                    parentSuite: 'some suite with spaces',
                    childSuite: 'suite'
                });

                checkIfRendersTheElement();
            });
        });


        describe('when suite path matches URL incomletely', () => {
            it('should not render element', () => {
                setupDomAndSuites({
                    urlPathName: 'some/suite/name',
                    parentSuite: 'some',
                    childSuite: 'suite'
                });

                const element = React.createElement('span', null, 'Example');
                sandbox.stub(ReactDOM, 'render');

                wrapped.render(element);

                assert.notCalled(ReactDOM.render);
            });
        });

        describe('when suite path does not matches the URL', () => {
            it('should not call children callback', () => {
                setupDom('some/path');
                const spy = sandbox.spy().named('suite callback');

                const geminiReact = require('../lib/client-wrapper')();
                geminiReact.suite('other name', spy);

                assert.notCalled(spy);
            });
        });
    });

    describe('error hanlder', () => {
        function triggerFakeError(options) {
            const message = 'Something bad happened';
            options = options || {stacktrace: false};
            const fakeError = {
                message: message
            };
            if (options.stacktrace) {
                fakeError.stack = [
                    `Error: ${message}`,
                    ' at some-file.js:12:34'
                ].join('\n');
            }
            const errorEvent = new ErrorEvent('error', {message: message, error: fakeError});

            window.dispatchEvent(errorEvent);
            return fakeError;
        }

        beforeEach(() => {
            setupDom();
            loadWrapper();
        });

        it('should create DOM element', () => {
            triggerFakeError();

            assert.isOk(document.querySelector('.stack'), 'Expected stacktrace element to exist');
        });

        it('should display a stacktrace', () => {
            const error = triggerFakeError({stacktrace: true});
            const element = document.querySelector('.stack');

            assert.equal(element.textContent, error.stack);
        });

        it('should display a message if stacktrace is unavailable', () => {
            const error = triggerFakeError({stacktrace: false});
            const element = document.querySelector('.stack');

            assert.equal(element.textContent, error.message);
        });
    });
});

