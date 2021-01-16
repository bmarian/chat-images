'use strict';

import Compressor from '../lib/compressor/compressor.esm.js'
import {log, randomString} from "../utils.js";
import {ORIGIN_FOLDER, UPLOAD_FOLDER_PATH} from "../settings.js";

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

/**
 * Returns an object with the file name and file extension
 *
 * @param {string} fileName
 *
 * @return {Object}
 */
function getFileDetails(fileName) {
    return {
        fileName: fileName.substring(0, fileName.lastIndexOf('.')) || fileName,
        fileExtension: fileName.substring(fileName.lastIndexOf('.'), fileName.length) || '',
    };
}

/**
 * Generates a new file name with a random string to prevent conflicting
 * file names
 *
 * @param {string} oldFileName
 *
 * @return {string}
 */
function generateRandomFileName(oldFileName) {
    const {fileName, fileExtension} = getFileDetails(oldFileName);

    const randomName = randomString();
    const concatFileName = `${fileName}_${randomName}`
    // a small precaution as most OSs have a limit of 260 characters for a file name
    const newFileName = concatFileName.length > 200 ? randomName : concatFileName;

    return `${newFileName}${fileExtension}`;
}

/**
 * Upload a file then trigger a callback
 *
 * @param {function} success
 * @param {function} error
 */
function uploadFile(success, error) {
    return image => FilePicker.upload(ORIGIN_FOLDER, UPLOAD_FOLDER_PATH, image, {})
        .then(success)
        .catch(error);
}

/**
 * Compress a file, if quality is < 1 and then calls the sendMessageCb
 * with that file's path
 *
 * @param {File} image
 * @param {number} quality
 * @param {function} sendMessageCb
 * @param {function} uploadStateOff
 */
function compressAndSendFile(image, quality, sendMessageCb, uploadStateOff) {
    const newName = generateRandomFileName(image.name);
    const newImage = new File([image], newName, {
        type: image.type
    });

    const success = file => {
        const path = file.path;
        if (!path) return uploadStateOff();
        return sendMessageCb(path);
    };
    const error = err => {
        log(err);
        uploadStateOff();
    };
    const upload = uploadFile(success, error)

    if (quality === 1) return upload(newImage);

    return compress(
        newImage,
        quality,
        response => {
            // fixes the case where compressor.js returns a Blob instead of a file
            const fixedBlob = new File([response], newName, {type: response.type});
            return upload(fixedBlob);
        },
        error
    );
}

export {
    compressAndSendEmbedded,
    compressAndSendFile,
    isGif,
};
