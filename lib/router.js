'use strict';

function idFromUrl(url) {
    const match = url.match(/^\/(\d+)$/);
    if (!match) {
        return null;
    }
    return match[1];
}

function urlFromId(id) {
    return '/' + id;
}

/**
 * @param {ServerRenderer} renderer
 */
function middleware(renderer) {
    return function* middleware(next) {
        const id = idFromUrl(this.request.path);
        if (!id || !renderer.hasElement(id)) {
            this.status = 404;
            this.body = '<h1>Page not found</h1>';
        } else {
            this.body = renderer.render(id);
        }


        yield next;
    };
}

exports.urlFromId = urlFromId;
exports.middleware = middleware;
