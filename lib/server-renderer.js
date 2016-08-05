'use strict';
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
        return `
<!DOCTYPE html>
<html>
    <title>React example</title>
</html>
<body>
    <div data-gemini-react=${id}>
    </div>
    <script src='assets/${id}.js'></script>
</body>`;
    }
}

module.exports = ServerRenderer;
