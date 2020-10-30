import {MODULE_NAME} from "./util";

const DOM_PARSER = new DOMParser();
const URL_REGEX = /^<a.*>(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])<\/a>$/ig;
const IMAGE_REGEX = /\w+\.(jpg|jpeg|gif|png|tiff|bmp)/ig;

//============================\\
// CONVERT MESSAGES TO IMAGES \\
//============================\\

// builds a string template for a image message
const buildImageHTML = (options: any): string => `<div class="${options.MODULE_NAME}-container"><img src="${options.url}" alt="${options.MODULE_NAME}"></div>`;

// checks if message has only a url
const isURL = (message: string): boolean => !!message.match(URL_REGEX);

// checks if an url is an image url
const isImageURL = (url: string): boolean => !!url.match(IMAGE_REGEX);

// generates an image message
const genImageHTML = (url: string): string => buildImageHTML({MODULE_NAME, url});

// a handler for .replace that returns a string with the buildImageHTML structure or the original string
const replaceMessageWithImage = (text: string, url: string): string => isImageURL(url) ? genImageHTML(url) : text;

// returns an image template from a message content
const convertMessageToImage = (message: string): any => isURL(message) && message.replace(URL_REGEX, replaceMessageWithImage);


//============================\\
// ADDS POPOUT ON IMAGE CLICK \\
//============================\\

// creates an image popout from an image url
const renderPopout = (url: string): Application =>
    new ImagePopout(url, {editable: false, shareable: true}).render(true);

// the on click event that is added for all the images in the chat
const createPopoutOnClick = (imgHTML: HTMLImageElement): Application => renderPopout(imgHTML.src);


//============================\\
//   CONVERT FILES TO IMAGES  \\
//============================\\

// returns the file extension from a given file name
const getFileExtensionFromName = (fileName: string): string => fileName.substring(fileName.lastIndexOf('.'), fileName.length) || null;

// generates a long random string used as a file name
const generateRandomString = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// generates a random file name keeping the file extension
const generateRandomFileName = (fileName: string): string => {
    const fileExtension = getFileExtensionFromName(fileName);
    if (!fileExtension) return fileName;

    return fileExtension ? generateRandomString() + fileExtension : fileName;
}

export {convertMessageToImage, createPopoutOnClick};
