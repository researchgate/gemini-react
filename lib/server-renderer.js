'use strict';
const _ = require('lodash');

class ServerRenderer {
    constructor() {
        this._elements = Object.create(null);
    }

    /**
     * @param {String} testPath
     * @param {ReactElement} element
     */
    addElement(testPath, element) {
        this._elements[testPath] = element;
    }

    /**
     * @param {String} testPath
     */
    hasElement(testPath) {
        return _.has(this._elements, testPath);
    }

    /**
     * @param {String} testPath
     * @param {String} jsUrl
     */
    render(testPath, jsPath) {
        return `
<!DOCTYPE html>
<html>
    <title>React example</title>
</html>
<body>
    <div data-gemini-react>
    </div>
    <script src='${jsPath}'></script>
</body>`;
    }
}

module.exports = ServerRenderer;
