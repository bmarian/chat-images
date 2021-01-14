'use strict';

/**
 * Creates an ImagePopout with a given imageHTML url and renders it immediately
 *
 * @param {HTMLImageElement} imageHTML
 */
function createPopout(imageHTML) {
    return new ImagePopout(imageHTML.src, {
        editable: false,
        shareable: true
    }).render(true);
}

export {
    createPopout
};
