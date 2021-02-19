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

    const isEmbeddedGif = src.startsWith('data:image/gif');
    // @ts-ignore
    if (isEmbeddedGif) return new Freezeframe(img, options);

    const isGifUrl = src.endsWith('gif');
    // @ts-ignore
    if (isGifUrl) return new Freezeframe(img, options);
}

export {
    freezeGif,
};
