'use strict';

import {isImageURL, URL_REGEX} from "./url-checking";
import {extractImageFromEvent} from "./image-extraction";
import {createPopout} from "./popout-handling";
import {messageTemplate, sendMessage, warnThanSendMessage} from "./chat-handling";


//=============================\\
//   CONVERT FILES TO IMAGES   \\
//=============================\\


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
// // compress a given image (Blob/File) and trigger a callback
// const compress = (file: Blob | File, compression: number): Function =>
//     (sCallback: Function, eCallback: Function): void =>
//         new Compressor(file, {
//             quality: compression,
//             success: sCallback,
//             error: eCallback,
//         });
//
// //============================\\
// //       CHAT MANAGEMENT      \\
// //============================\\
//
// // check if a file is a gif
// const isGif = (image: File): boolean => image?.type?.includes('gif');
//
// // creates a base64 image from a file and creates a new chat message with it
// const displayEmbedded = (toggleChatFun: Function) => (image: File) => {
//     const reader = new FileReader();
//
//     reader.onload = (event: any): Promise<void> =>
//         createChatMessage(messageTemplate( event.target.result), toggleChatFun(false));
//
//     reader.readAsDataURL(image);
// };
//
// // compress an embedded image if successful creates a new chat message with the new compressed file
// const compressEmbedded = (image: File, compression: number, toggleChatFun: Function): void => {
//     const com = compress(image, compression);
//     const sCallback = displayEmbedded(toggleChatFun);
//     const fCallback = (err) => {
//         log(err);
//         toggleChatFun(false)()
//     };
//
//     return com(sCallback, fCallback);
// };
//
// // create a message with an embedded image
// const createMessageWithEmbedded = (image: File, toggleChatFun: Function): void => {
//     toggleChatFun(true)();
//
//     const quality = getSetting('embeddedCompression');
//     return quality !== 1 && !isGif(image) ? compressEmbedded(image, quality, toggleChatFun) : displayEmbedded(toggleChatFun)(image);
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
