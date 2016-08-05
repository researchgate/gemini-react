'use strict';
function render(templateData) {
    return (
`<!DOCTYPE html>
<html>
    <title>${templateData.title}</title>
</html>
<body>
    <div data-gemini-react>
    </div>
    <script src='${templateData.jsUrl}'></script>
</body>`
    );
}

module.exports = render;
