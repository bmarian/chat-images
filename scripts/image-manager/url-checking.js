'use strict';

// regex for finding a message that only has an anchor
const URL_REGEX = /^<a.*>(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])<\/a>$/ig,
    // regex for determining if an url is an image
    IMAGE_REGEX = /\w+\.(jpg|jpeg|gif|png|tiff|bmp)/ig;

/**
 * Determines if a message has only an URL
 *
 * @param {string} message - the content of the chat message
 *
 * @return {boolean}
 */
function isURL(message) {
    return !!message.match(URL_REGEX);
}

/**
 * Determines if an URL is for an image
 *
 * @param {string} URL
 *
 * @return {boolean}
 */
function isImageURL(URL) {
    return isURL(URL) && !!URL.match(IMAGE_REGEX);
}

export {
    isURL,
    isImageURL,
    URL_REGEX,
    IMAGE_REGEX
}
