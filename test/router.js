'use strict';

const router = require('../lib/router');
const sinon = require('sinon');
const assert = require('chai').assert;

const RouteBuilder = require('../lib/route-builder');
const htmlTemplate = require('../lib/html-template');

describe('router', () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
        sandbox.restore();
    });

    describe('testPathToChunkName', () => {
        it('should replace extension with .bundle.js', () => {
            assert.equal(
                router.testPathToChunkName('file.js'),
                'file.bundle.js'
            );
        });

        it('should replace path delimeters with dashes', () => {
            assert.equal(
                router.testPathToChunkName('path/to/file.js'),
                'path-to-file.bundle.js'
            );
        });

        it('should urlencode the value', () => {
            assert.equal(
                router.testPathToChunkName('file with spaces.js'),
                'file%20with%20spaces.bundle.js'
            );
        });
    });

    describe('testPathToChunkUrl', () => {
        it('should return root-relative chunk url', () => {
            assert.equal(
                router.testPathToChunkUrl('file.js'),
                '/assets/file.bundle.js'
            );
        });
    });

    describe('middleware', () => {
        let routeBuilder;

        function requestFor(path) {
            return {
                path: path
            };
        }

        function response() {
            return {
                locals: {},
                send: () => {}
            };
        }

        function callMiddleware(params) {
            params = params || {};
            const req = params.req || requestFor('/');
            const res = params.res || response();
            const next = params.next || (() => {});

            const middleware = router.middleware(routeBuilder);
            middleware(req, res, next);
        }

        beforeEach(() => {
            routeBuilder = sinon.createStubInstance(RouteBuilder);
        });

        it('should call `next` if url is unknown', () => {
            const url = '/some/path';
            routeBuilder.isUrlRegistered.withArgs(url).returns(false);
            const next = sandbox.spy().named('next');

            callMiddleware({
                req: requestFor(url),
                next: next
            });

            assert.calledOnce(next);
        });

        function setupSuccessResponse(url, html) {
            html = html || '';

            const data = {};

            routeBuilder.isUrlRegistered
                .withArgs(url)
                .returns(true);
            routeBuilder.getTemplateDataFromUrl
                .withArgs(url)
                .returns(data);
            sandbox.stub(htmlTemplate, 'render')
                .withArgs(data)
                .returns(html);
        }

        it('should render html template if url matches', () => {
            const url = '/some/path';
            const html = '<h1>It works!</h1>';
            const res = response();
            sandbox.spy(res, 'send');
            setupSuccessResponse(url, html);

            callMiddleware({
                req: requestFor(url),
                res: res
            });

            assert.calledWith(res.send, html);
        });

        it('should pick webpacks assets', () => {
            const url = '/some/path';
            const res = response();

            setupSuccessResponse(url);
            res.locals.webpackStats = {
                toJson: () => ({
                    assetsByChunkName: {
                        'test.bundle.js': 'path/to/test.bundle.js',
                        'common.js': 'path/to/common.js'
                    }
                })
            };

            callMiddleware({
                req: requestFor(url),
                res: res
            });

            assert.calledWith(
                routeBuilder.getTemplateDataFromUrl,
                sinon.match.any,
                sinon.match(['/assets/path/to/common.js'])
            );
        });
    });
});
