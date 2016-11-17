'use strict';

/**
 * @param {String[]} fileList
 */
function renderCss(fileList) {
    return fileList.reduce(
        (html, url) => html + `\n<link rel="stylesheet" href=${url} />`,
        ''
    );
}

/**
 * @param {String[]} fileList
 */
function renderJs(fileList) {
    return fileList.reduce(
        (html, url) => html + `\n<script src=${url}></script>`,
        ''
    );
}

function render(templateData) {
    return (
`<!DOCTYPE html>
<html>
    <title>${templateData.title}</title>
    ${renderCss(templateData.cssList)}
</html>
<body>
    <div data-gemini-react>
    </div>
    ${renderJs(templateData.jsList)}
</body>`
    );
}

exports.render = render;
