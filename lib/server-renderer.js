'use strict';
const _ = require('lodash');

class ServerRenderer {
    constructor() {
        this._slots = Object.create(null);
    }

    /**
     * @param {String} testPath
     */
    addSlot(testPath) {
        if (!this._slots[testPath]) {
            this._slots[testPath] = 0;
        }
        return ++this._slots[testPath];
    }

    /**
     * @param {String} testPath
     * @param {Number} slotNumber
     */
    hasSlot(testPath, slotNumber) {
        const availableSlots = _.get(this._slots, testPath, 0);
        return slotNumber > 0 && slotNumber <= availableSlots;
    }

    /**
     * @param {String} testPath
     * @param {Number} slotNumber
     * @param {String} jsUrl
     */
    render(testPath, slotNumber, jsPath) {
        return `
<!DOCTYPE html>
<html>
    <title>React example</title>
</html>
<body>
    <div data-gemini-react=${slotNumber}>
    </div>
    <script src='${jsPath}'></script>
</body>`;
    }
}

module.exports = ServerRenderer;
