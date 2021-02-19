'use strict';


import {createUploadFolderIfMissing, getSetting, registerSettings, UPLOAD_FOLDER_PATH} from "./settings.js";
import {convertMessageToImage, createPopoutOnClick, handleChatInteraction} from "./image-manager/manager.js";
import {freezeGif} from "./image-manager/gif-freez.js";
import {isFoundry8, log, MODULE_NAME} from "./utils.js";

Hooks.once('init', () => {
    // register all the module's settings
    registerSettings();
    // create the folder for uploading images if it doesn't exist
    createUploadFolderIfMissing()
        .then(() => log(`Folder ${UPLOAD_FOLDER_PATH} is ready.`));
});

Hooks.on('preCreateChatMessage', (message, options) => {
    const messageSource = isFoundry8() ? message.data._source : message;

    // if a message has only an url and it's an image url convert it to an img tag
    const content = convertMessageToImage(messageSource.content);
    if (!content) return;

    messageSource.content = content;
    // this is used to prevent the message from showing as a bubble
    // because it will not be rendered correctly
    options.chatBubble = false;
});

Hooks.on('renderChatMessage', (_0, html) => {
    const img = html?.[0]?.querySelector(`.${MODULE_NAME}-container`)?.children?.[0];
    if (!img) return;

    // everytime a message is rendered in chat, if it's a chat-images message we add
    // the popout on click
    img.addEventListener('click', () => createPopoutOnClick(img));

    // try to freeze the gif so it's not so unpleasant when a short
    // one loops
    freezeGif(img);
});

Hooks.on('renderSidebarTab', (_0, html) => {
    // we need a special case to handle the markdown editor module because
    // it changes the chat textarea with an EasyMDEContainer
    const hasMeme = game.modules.get('markdown-editor')?.active;
    const chat = html[0]?.querySelector(hasMeme ? '.EasyMDEContainer' : '#chat-message');

    if (!chat) return;
    // we add events on paste and drop to get the info from the user's clipboard, if it's an image
    // we upload it to the chat or show an warning message
    chat.addEventListener('paste', event => handleChatInteraction(getSetting('warningOnPaste'), chat, event));
    // KNOWN ISSUE: on windows if using the standalone application without opening it in admin mode
    // you can't upload images by dragging and dropping
    chat.addEventListener('drop', event => handleChatInteraction(getSetting('warningOnDrop'), chat, event));
});
