'use strict';
const ReactDOMServer = require('react-dom/server');
const _ = require('lodash');

class ServerRenderer {
    constructor() {
        this._elements = Object.create(null);
    }

    addElement(id, element) {
        this._elements[id] = element;
    }

    hasElement(id) {
        return _.has(this._elements, id);
    }

    render(id) {
        const renederedElement = ReactDOMServer.renderToString(this._elements[id]);
        return `
<!DOCTYPE html>
<html>
    <title>React example</title>
</html>
<body>
    <div data-gemini-react>
        ${renederedElement}
    </div>
</body>`;
    }
}

module.exports = ServerRenderer;
