'use strict';
import { versionAfter9 } from "../utils.js";

// regex for determining if an url is an image
const IMAGE_REGEX = /\w+\.(jpg|jpeg|gif|png|tiff|bmp)/ig;

function getUrlRegex() {
    // regex for finding a message that only has an anchor
    return versionAfter9()
        ? /^(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])$/ig
        : /^<a.*>(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])<\/a>$/ig;
}

/**
 * Determines if a message has only an URL
 *
 * @param {string} message - the content of the chat message
 *
 * @return {boolean}
 */
function isURL(message) {
    return !!message.match(getUrlRegex());
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
    getUrlRegex,
    IMAGE_REGEX
}
