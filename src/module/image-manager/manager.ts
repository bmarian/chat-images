'use strict';

import {isImageURL, URL_REGEX} from "./url-checking";
import {extractImageFromEvent} from "./image-extraction";
import {createPopout} from "./popout-handling";
import {messageTemplate, sendMessage, warnThanSendMessage} from "./chat-handling";


//
// // returns the file extension from a given file name
// const getFileExtensionFromName = (fileName: string): string => fileName.substring(fileName.lastIndexOf('.'), fileName.length) || null;
//
// // generates a random file name keeping the file extension
// const generateRandomFileName = (fileName: string): string => {
//     const fileExtension = getFileExtensionFromName(fileName);
//     if (!fileExtension) return fileName;
//
//     return fileExtension ? randomString() + fileExtension : fileName;
// };
//
// // upload a file
// const uploadFile = (source: string, uploadFolder: string, options: {}, sCb: any, fCb: any) => (file: File): void => {
//     FilePicker.upload(source, uploadFolder, file, options).then(sCb).catch(fCb);
// };
//
// // compress a file and upload it afterwords if successfully compressed
// const compressFile = (image: File, compression: number, uploadCallback: Function, toggleChatFun: Function): void => {
//     const com = compress(image, compression);
//     const sCallback = (response: Blob) => {
//         // Fix for when the response from compression.js comes as a Blob
//         const newImage = new File([response], image.name, {type: response.type});
//         uploadCallback(newImage);
//     };
//     const fCallback = (err) => {
//         log(err);
//         toggleChatFun(false)()
//     };
//     return com(sCallback, fCallback);
// };
//
// // create a message with a file path
// const createMessageWithFilePath = (image: File, toggleChatFun: Function): void => {
//     toggleChatFun(true)();
//
//     const fileName = generateRandomFileName(image.name);
//     const newImage = new File([image], fileName, {type: image.type});
//
//     const sCb = (response: any): Promise<void> => {
//         const path = response.path;
//         if (!path) return toggleChatFun(false)();
//         return createChatMessage(messageTemplate(path), toggleChatFun(false));
//     };
//     const fCb = (): void => toggleChatFun(false)();
//     const upload = uploadFile('data', UPLOAD_FOLDER_PATH, {}, sCb, fCb);
//
//     const quality = getSetting('uploadCompression');
//     return quality !== 1 && !isGif(newImage) ? compressFile(newImage, quality, upload, toggleChatFun) : upload(newImage);
// };

/**
 * Calls the appropriate action depending on the showWarning:
 * directly send the message in chat or warn the user first
 *
 * @param {boolean} showWarning - determines if a warning should be sent first
 * @param {HTMLElement} chat
 * @param {Event} event
 */
function handleChatInteraction(showWarning, chat, event) {
    if (chat.disabled) return;

    const image = extractImageFromEvent(event);
    if (!image) return;

    const action = showWarning ? warnThanSendMessage : sendMessage;
    action(chat, image);
}

/**
 * If the message is an img url returns an HTML template with an actual img tag
 *
 * @param {string} message - the content of a chat message
 *
 * @return {string}
 */
function convertMessageToImage(message) {
    if (!isImageURL(message)) return null;
    return message.replace(URL_REGEX, (_0, URL) => messageTemplate(URL));
}

/**
 * Creates an ImagePopout with a given imageHTML url and renders it immediately
 *
 * @param {HTMLImageElement} imageHTML
 */
function createPopoutOnClick(imageHTML) {
    return createPopout(imageHTML);
}

export {
    convertMessageToImage,
    handleChatInteraction,
    createPopoutOnClick,
};
