const RouteBuilder = require('../lib/route-builder');
const assert = require('chai').assert;

describe('RouteBuilder', () => {
    it('should return a route url, based on a suite name', () => {
        const routeBuilder = new RouteBuilder();

        routeBuilder.pushSuite('example');

        assert.equal(
            routeBuilder.buildRoute(),
            '/example'
        );
    });

    it('should combine multiple suites into single url', () => {
        const routeBuilder = new RouteBuilder();

        routeBuilder.pushSuite('first');
        routeBuilder.pushSuite('second');

        assert.equal(
            routeBuilder.buildRoute(),
            '/first/second'
        );
    });

    it('should URL-encode the suite names', () => {
        const routeBuilder = new RouteBuilder();

        routeBuilder.pushSuite('suite with space');

        assert.equal(
            routeBuilder.buildRoute(),
            '/suite%20with%20space'
        );
    });

    it('should go back to previous suite after popSuite', () => {
        const routeBuilder = new RouteBuilder();

        routeBuilder.pushSuite('first');
        routeBuilder.pushSuite('second');
        routeBuilder.popSuite();

        assert.equal(
            routeBuilder.buildRoute(),
            '/first'
        );
    });

    describe('isUrlRegistered', () => {
        it('should return false for non-existing route', () => {
            const routeBuilder = new RouteBuilder();

            assert.isFalse(
                routeBuilder.isUrlRegistered('non existing')
            );
        });

        it('should return false for non-built route', () => {
            const routeBuilder = new RouteBuilder();

            routeBuilder.pushSuite('incomplete');

            assert.isFalse(
                routeBuilder.isUrlRegistered('/incomplete')
            );
        });

        it('should return true for build route', () => {
            const routeBuilder = new RouteBuilder();

            routeBuilder.pushSuite('example');

            const url = routeBuilder.buildRoute();

            assert.isTrue(
                routeBuilder.isUrlRegistered(url)
            );
        });
    });

    describe('template data', () => {
        const getTemplateData = (setupBuilder, commonJs) => {
            const routeBuilder = new RouteBuilder();
            setupBuilder(routeBuilder);
            const url = routeBuilder.buildRoute();
            return routeBuilder.getTemplateDataFromUrl(url, commonJs);
        };

        it('should have a title based on suite name', () => {
            const data = getTemplateData((routeBuilder) => {
                routeBuilder.pushSuite('example');
            });

            assert.equal(
                data.title,
                'example'
            );
        });


        it('should have a title based on full name of nested suites', () => {
            const data = getTemplateData((routeBuilder) => {
                routeBuilder.pushSuite('first');
                routeBuilder.pushSuite('second');
            });

            assert.equal(
                data.title,
                'first second'
            );
        });

        it('should contain included stylesheet', () => {
            const data = getTemplateData((routeBuilder) => {
                routeBuilder.pushSuite('example');
                routeBuilder.includeCss('/stylesheet.css');
            });

            assert.include(data.cssList, '/stylesheet.css');
        });


        it('should contain multiple included stylesheets', () => {
            const data = getTemplateData((routeBuilder) => {
                routeBuilder.pushSuite('example');
                routeBuilder.includeCss('/first.css');
                routeBuilder.includeCss('/second.css');
            });

            assert.include(data.cssList, '/first.css');
            assert.include(data.cssList, '/second.css');
        });


        it('should inherit stylesheets from parent', () => {
            const data = getTemplateData((routeBuilder) => {
                routeBuilder.pushSuite('parent');
                routeBuilder.includeCss('/parent.css');
                routeBuilder.pushSuite('child');
                routeBuilder.includeCss('/child.css');
            });

            assert.include(data.cssList, '/parent.css');
        });

        it('should include top-level stylesheets', () => {
            const data = getTemplateData((routeBuilder) => {
                routeBuilder.includeCss('/top-level.css');
                routeBuilder.pushSuite('example');
                routeBuilder.includeCss('/example.css');
            });

            assert.include(data.cssList, '/top-level.css');
        });

        it('should include current js file name', () => {
            const data = getTemplateData((routeBuilder) => {
                routeBuilder.setCurrentPageJSUrl('/example.js');
            });

            assert.include(data.jsList, '/example.js');
        });

        it('should include common scripts', () => {
            const data = getTemplateData(
                (routeBuilder) => routeBuilder.setCurrentPageJSUrl('/test.js'),
                ['/common.js']
            );

            assert.deepEqual(data.jsList, ['/common.js', '/test.js']);
        });
    });
});
