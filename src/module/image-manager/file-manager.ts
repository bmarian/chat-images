'use strict';

import Compressor from '../compressor/compressor.esm.js'
import {log} from "../utils";

/**
 * Determines if an image file is a gif
 *
 * @param {File} image
 *
 * @return {boolean}
 */
function isGif(image) {
    return image?.type?.includes('gif');
}

/**
 * Compresses a file then calls a callback
 *
 * @param {File} file
 * @param {number} quality
 * @param {Function} success
 * @param {Function} error
 */
function compress(file, quality, success, error) {
    return new Compressor(file, {
        quality,
        success,
        error,
    });
}

/**
 * Creates an embedded message and calls the sendMessageCb
 *
 * @param {File} image
 * @param {function} sendMessageCb
 */
function sendEmbedded(image, sendMessageCb) {
    const render = new FileReader();
    render.onload = event => sendMessageCb(event.target.result);
    render.readAsDataURL(image);
}

/**
 * Compress an embedded image, if quality is < 1 and then calls the
 * sendMessageCb
 *
 * @param {File} image
 * @param {number} quality
 * @param {function} sendMessageCb
 * @param {function} uploadStateOff
 */
function compressAndSendEmbedded(image, quality, sendMessageCb, uploadStateOff) {
    if (quality === 1) return sendEmbedded(image, sendMessageCb);

    const success = image => sendEmbedded(image, sendMessageCb);
    const error = err => {
        log(err);
        uploadStateOff();
    };

    return compress(image, quality, success, error);
}

export {
    compressAndSendEmbedded,
    isGif,
};
