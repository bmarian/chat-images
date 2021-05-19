'use strict';

/**
 * Freezes the gifs in the chat
 *
 * @param {HTMLElement} img
 */
function freezeGif(img) {
    const src = img.src;
    const options = {
        warnings: false,
        overlay: true,
    };

    if (src.startsWith('data:image/gif') || src.endsWith('gif')) return new Freezeframe(img, options);
}

export {
    freezeGif,
};
