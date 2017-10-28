'use strict';
const wrap = require('../lib/server-suite-wrapper');
const assert = require('chai').assert;
const sinon = require('sinon');
const Server = require('../lib/server');
const noop = require('lodash').noop;
const RENDER_TARGET_SELECTOR = wrap.RENDER_TARGET_SELECTOR;

describe('server-suite-wrapper', () => {
    const sandbox = sinon.sandbox.create();
    afterEach(() => {
        sandbox.restore();
    });

    describe('.suite', () => {
        let server, original, geminiReact;
        beforeEach(() => {
            server = sinon.createStubInstance(Server);
            original = {
                suite: sandbox.spy().named('original .suite')
            };

            geminiReact = wrap(original, server);
        });

        it('calls original method', () => {
            geminiReact.suite('example', noop);
            assert.calledWith(original.suite, 'example');
        });

        it('pushes suite name to the server', () => {
            geminiReact.suite('example', noop);
            assert.calledWithExactly(server.pushSuite, 'example');
        });

        it('pops the suite after setup is done', () => {
            geminiReact.suite('example', noop);
            assert.callOrder(original.suite, server.popSuite);
        });
    });

    describe('ServerSuiteWrapper', () => {
        const forwardMethods = [
            'before',
            'after',
            'setTolerance',
            'capture',
            'ignoreElements',
            'skip',
            'browsers'
        ];
        let original, wrapped, server;

        beforeEach(() => {
            original = forwardMethods.reduce((obj, method) => {
                obj[method] = sandbox.spy().named(method);
                return obj;
            }, {});
            original.setUrl = sandbox.spy();
            original.setCaptureElements = sandbox.spy();

            const gemini = {
                suite: sandbox.stub().callsArgWith(1, original)
            };

            server = sinon.createStubInstance(Server);
            wrap(gemini, server).suite('example', wrappedSuite => {
                wrapped = wrappedSuite;
            });
        });

        forwardMethods.forEach((method) => {
            it(`forwards ${method} to original`, () => {
                wrapped[method]('arg');
                assert.calledWithExactly(original[method], 'arg');
            });
        });

        it('disallows calling `setCaptureElements`', () => {
            assert.throws(() => wrapped.setCaptureElements(['.test']));
        });

        it('disallows calling `setUrl`', () => {
            assert.throws(() => wrapped.setUrl('/some/path'));
        });

        describe('render', () => {
            it('sets url to server route', () => {
                const route = '/some/path';
                server.registerRender.returns(route);
                wrapped.render();

                assert.calledWithExactly(original.setUrl, route);
            });

            it('sets capture element render target selector', () => {
                wrapped.render();

                assert.calledWithExactly(original.setCaptureElements, [RENDER_TARGET_SELECTOR]);
            });
        });

        describe('includeCss', () => {
            it('should include css on server', () => {
                const stylesheet = 'style.css';
                wrapped.includeCss(stylesheet);
                assert.calledWithExactly(server.includeCss, stylesheet);
            });
        });

        describe('setExtraCaptureElements', () => {
            it('should work with a string', () => {
                const selector = '.extra-selector';

                wrapped.setExtraCaptureElements(selector);
                wrapped.render();

                assert.calledWithExactly(original.setCaptureElements, [RENDER_TARGET_SELECTOR, selector]);
            });

            it('should work with an array', () => {
                const selector1 = '.selector1';
                const selector2 = '.selector2';

                wrapped.setExtraCaptureElements([selector1, selector2]);
                wrapped.render();

                assert.calledWithExactly(
                    original.setCaptureElements,
                    [RENDER_TARGET_SELECTOR, selector1, selector2]
                );
            });

            it('should throw on non array and non string argument', () => {
                assert.throws(() => {
                    wrapped.setExtraCaptureElements(1234);
                }, 'setExtraCaptureElements accepts an array or string');
            });
        });
    });
});
