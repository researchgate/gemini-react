'use strict';

const htmlTemplate = require('../lib/html-template');
const jsdom = require('jsdom');
const assert = require('chai').assert;
const _ = require('lodash');

describe('html template', () => {
    function renderTemplateAsDom(templateData) {
        templateData = templateData || {};
        _.defaults(templateData, {
            name: '',
            jsList: [],
            cssList: []
        });
        return jsdom.jsdom(htmlTemplate(templateData));
    }

    it('should have a test name as a title', () => {
        const document = renderTemplateAsDom({
            title: 'some title'
        });

        assert.equal(document.title, 'some title');
    });


    it('should have a mount point', () => {
        const document = renderTemplateAsDom();

        assert.isOk(
            document.querySelector('[data-gemini-react]'),
            'Expected to have element with data-gemini-react attribute'
        );
    });

    it('should include js from js list', () => {
        const path = '/some/file.js';

        const document = renderTemplateAsDom({
            jsList: [path]
        });

        assert.isOk(
            document.querySelector(`script[src='${path}']`),
            'Expected to render script tag'
        );
    });


    it('should include css from css list', () => {
        const path = '/some/file.css';

        const document = renderTemplateAsDom({
            cssList: [path]
        });

        assert.isOk(
            document.querySelector(`link[rel=stylesheet][href='${path}']`),
            'Expected to render link[rel=stylesheet] tag'
        );
    });
});
