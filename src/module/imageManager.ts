import {localize, log, MODULE_NAME} from "./util";
import {getSetting, UPLOAD_FOLDER_PATH} from "./settings";
import Compressor from './compressor/compressor.esm.js'

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


//=============================\\
//   CONVERT FILES TO IMAGES   \\
//=============================\\


// returns the file extension from a given file name
const getFileExtensionFromName = (fileName: string): string => fileName.substring(fileName.lastIndexOf('.'), fileName.length) || null;

// generates a long random string used as a file name
const generateRandomString = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// generates a random file name keeping the file extension
const generateRandomFileName = (fileName: string): string => {
    const fileExtension = getFileExtensionFromName(fileName);
    if (!fileExtension) return fileName;

    return fileExtension ? generateRandomString() + fileExtension : fileName;
};

// compress a given image (Blob/File) and trigger a callback
const compress = (file: Blob | File, compression: number): Function =>
    (sCallback: Function, eCallback: Function): void =>
        new Compressor(file, {
            quality: compression,
            success: sCallback,
            error: eCallback,
        });

// determines if the url is one of the special ones that can't be opened without cookies or other things
// looking at you wiki whatever
const determineIfSpecialCaseURL = (url: string): string => {
    const special = ['static.wikia'];
    return (new RegExp(special.join('|')).test(url)) ? null : url;
}

// if the pasted/dropped data comes from a website it should have an image.src,
// so we just use that instead of generating a new file (this saves A LOT of space)
const extractURLFromData = (data: any): string => {
    const html = data?.getData('text/html');
    if (!html) return null;

    const parsed = DOM_PARSER.parseFromString(html, 'text/html');
    const img = parsed.querySelector('img');

    return img ? determineIfSpecialCaseURL(img.src) : null;
};

// extract the image file from the paste/drop event
const extractFileFromData = (data: any): File => {
    const items = data?.items;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item?.type?.includes('image')) return item.getAsFile();
    }
    return null;
};

// returns an image from a paste/drop event
// this could be a url/blob depending on the available options
const getImageFromEvent = (event: any): string | File => {
    const data = event?.clipboardData || event?.dataTransfer;
    if (!data) return null;

    const url = extractURLFromData(data);
    return url !== null ? url : extractFileFromData(data);
};

// handles the extraction of the image from the event and calls the appropriate
// action: directly send the message in chat or warn the user first
const handleChatInteraction = (showWarning: boolean, chat: HTMLTextAreaElement, event: any): void | Promise<void> => {
    if (!chat || chat.disabled) return;

    const image = getImageFromEvent(event);
    if (image === null) return;

    return showWarning ? warn(chat, image) : sendMessage(chat, image);
};


//============================\\
//       CHAT MANAGEMENT      \\
//============================\\


// determines if the user type has upload permission (default > assistant)
// @ts-ignore
const canUserUpload = (): boolean => game?.permissions?.FILES_UPLOAD?.includes(game?.user?.role);

// check if a file is a gif
const isGif = (image: File): boolean => image?.type?.includes('gif');

// toggle a spinner over the chat element
const toggleSpinner = (chatForm: HTMLFormElement, toggle: boolean): any => {
    const spinnerId = `${MODULE_NAME}-spinner`;
    const spinner = document.querySelector(`#${spinnerId}`);

    if (!toggle && spinner) return chatForm.removeChild(spinner);

    if (toggle && !spinner) {
        const newSpinner = document.createElement('DIV');
        newSpinner.setAttribute('id', spinnerId);
        chatForm.prepend(newSpinner);
    }
};

// toggles the spinner and disables the chat
const toggleChat = (chat: HTMLTextAreaElement) => (toggle: boolean) => (): any => {
    toggleSpinner(<HTMLFormElement>chat.parentNode, toggle);
    if (toggle) return chat.setAttribute('disabled', 'true');

    chat.removeAttribute('disabled');
    chat.focus();
};

// creates a new chat message with a given content, then calls cb if it's a function
const createChatMessage = (content: string, cb: Function): Promise<void> => ChatMessage.create({content}).then(() => typeof cb === 'function' && cb());

// handles the creation of a chat message from an url
const createMessageWithURL = (url: string, toggleChatFun: Function): Promise<void> => {
    toggleChatFun(true)();
    return createChatMessage(buildImageHTML({MODULE_NAME, url}), toggleChatFun(false));
};

// creates a base64 image from a file and creates a new chat message with it
const displayEmbedded = (toggleChatFun: Function) => (image: File) => {
    const reader = new FileReader();

    reader.onload = (event: any): Promise<void> =>
        createChatMessage(buildImageHTML({MODULE_NAME, url: event.target.result}), toggleChatFun(false));

    reader.readAsDataURL(image);
};

// compress an embedded image if successful creates a new chat message with the new compressed file
const compressEmbedded = (image: File, compression: number, toggleChatFun: Function): void => {
    const com = compress(image, compression);
    const sCallback = displayEmbedded(toggleChatFun);
    const fCallback = (err) => {
        log(err);
        toggleChatFun(false)()
    };

    return com(sCallback, fCallback);
};

// create a message with an embedded image
const createMessageWithEmbedded = (image: File, toggleChatFun: Function): void => {
    toggleChatFun(true)();

    const quality = getSetting('embeddedCompression');
    return quality !== 1 && !isGif(image) ? compressEmbedded(image, quality, toggleChatFun) : displayEmbedded(toggleChatFun)(image);
};

// upload a file
const uploadFile = (source: string, uploadFolder: string, options: {}, sCb: any, fCb: any) => (file: File): void => {
    FilePicker.upload(source, uploadFolder, file, options).then(sCb).catch(fCb);
};

// compress a file and upload it afterwords if successfully compressed
const compressFile = (image: File, compression: number, uploadCallback: Function, toggleChatFun: Function): void => {
    const com = compress(image, compression);
    const sCallback = (response: Blob) => {
        // Fix for when the response from compression.js comes as a Blob
        const newImage = new File([response], image.name, {type: response.type});
        uploadCallback(newImage);
    };
    const fCallback = (err) => {
        log(err);
        toggleChatFun(false)()
    };
    return com(sCallback, fCallback);
};

// create a message with a file path
const createMessageWithFilePath = (image: File, toggleChatFun: Function): void => {
    toggleChatFun(true)();

    const fileName = generateRandomFileName(image.name);
    const newImage = new File([image], fileName, {type: image.type});

    const sCb = (response: any): Promise<void> => {
        const path = response.path;
        if (!path) return toggleChatFun(false)();
        return createChatMessage(buildImageHTML({MODULE_NAME, url: path}), toggleChatFun(false));
    };
    const fCb = (): void => toggleChatFun(false)();
    const upload = uploadFile('data', UPLOAD_FOLDER_PATH, {}, sCb, fCb);

    const quality = getSetting('uploadCompression');
    return quality !== 1 && !isGif(newImage) ? compressFile(newImage, quality, upload, toggleChatFun) : upload(newImage);
};

// create a chat message with the image
// url - typeof image === 'string'
// blob - whereToSave = database || !uploadPermission && saveFallback
// file path - whereToSave != database && uploadPermission
const sendMessage = (chat: HTMLTextAreaElement, image: string | File): void | Promise<void> => {
    const toggleChatFun = toggleChat(chat);

    if (typeof image === 'string') return createMessageWithURL(<string>image, toggleChatFun);

    const whereToSave = getSetting('whereToSavePastedImages');
    if (whereToSave === 'database') return createMessageWithEmbedded(<File>image, toggleChatFun);

    const saveFallback = getSetting('saveAsBlobIfCantUpload');
    const uploadPermission = canUserUpload();

    if (uploadPermission) return createMessageWithFilePath(<File>image, toggleChatFun);
    if (saveFallback) return createMessageWithEmbedded(<File>image, toggleChatFun);

    ui?.notifications?.warn(localize('imageManager.noPermissionWarning'));
    toggleChatFun(false)(); // just in case
};

// warn the user before creating a chat message
const warn = (chat: HTMLTextAreaElement, image: string | File): void => {
    const toggleChatFun = toggleChat(chat);
    toggleChatFun(true)();

    let tookAction = false;
    const toggleChatFunFalse = toggleChatFun(false);
    new Dialog({
        title: localize('imageManager.warn.title'),
        content: localize('imageManager.warn.content'),
        buttons: {
            ok: {
                icon: '<i class="fas fa-check"></i>',
                label: localize('imageManager.warn.buttons.ok'),
                callback: () => {
                    tookAction = true;
                    return sendMessage(chat, image);
                }
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: localize('imageManager.warn.buttons.cancel'),
                callback: () => {
                    tookAction = true;
                    return toggleChatFunFalse();
                }
            }
        },
        default: 'ok',
        close: () => !tookAction && toggleChatFunFalse(),
    }).render(true);
};

export {convertMessageToImage, createPopoutOnClick, handleChatInteraction};
