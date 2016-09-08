'use strict';
/**
 * @param {String[]} fileList
 */
function renderCss(fileList) {
    return fileList.reduce(
        (html, url) => html + `\n<link rel="stylesheet" href=${url}>`,
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
    <div data-gemini-react style="display: inline-block;">
    </div>
    <script src='${templateData.jsUrl}'></script>
</body>`
    );
}

module.exports = render;
