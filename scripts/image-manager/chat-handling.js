'use strict';

import {compressAndSendEmbedded, compressAndSendFile, isGif} from "./file-manager.js";
import {getUploadPermissionStatus, localize, isAfterFoundry8, MODULE_NAME} from "../utils.js";
import {getSetting} from "../settings.js";

/**
 * Creates an HTML template with an image wrapped in the module's container
 *
 * @param {string} URL
 *
 * @return {string}
 */
function messageTemplate(URL) {
    return `<div class="${MODULE_NAME}-container"><img src="${URL}" alt="${MODULE_NAME}"></div>`;
}

/**
 * Creates a OOC message with a given content, then calls a callback
 *
 * @param {string} content
 * @param {function} cb
 *
 * @return {Promise<*>}
 */
function createChatMessage(content, cb) {
    const messageData = {
        content: messageTemplate(content),
        // fix for #20: added a `type OOC`, so the message will
        // appear in the OOC tab with tabbed chat
        type: CONST.CHAT_MESSAGE_TYPES.OOC || 1,
    };
    if (isAfterFoundry8()) messageData['user'] = game.user;

    return ChatMessage.create(messageData).then(cb);
}

/**
 * Toggles on/off the chat
 *
 * @param {HTMLElement} chat
 * @param {boolean} toggle
 */
function toggleChat(chat, toggle) {
    if (!toggle) return chat.setAttribute('disabled', 'true');
    chat.removeAttribute('disabled');
    chat.focus();
}

/**
 * Toggle on/off the spinner
 *
 * @param {HTMLElement} chatForm
 * @param {boolean} toggle
 */
function toggleSpinner(chatForm, toggle) {
    const spinnerId = `${MODULE_NAME}-spinner`;
    const spinner = document.querySelector(`#${spinnerId}`);

    if (!toggle && spinner) return chatForm.removeChild(spinner);

    if (toggle && !spinner) {
        const newSpinner = document.createElement('DIV');
        newSpinner.setAttribute('id', spinnerId);
        chatForm.prepend(newSpinner);
    }
}

/**
 * Returns functions for toggling the chat on/off
 *
 * @param {HTMLElement} chat
 *
 * @return {Object}
 */
function getUploadingStates(chat) {
    return {
        on() {
            toggleChat(chat, false);
            toggleSpinner(chat.parentNode, true);
        },
        off() {
            toggleChat(chat, true);
            toggleSpinner(chat.parentNode, false);
        },
    };
}

/**
 * Creates a chat message from an embedded file
 *
 * @param {File} image
 * @param {Function} uploadStateOff
 */
function createMessageWithEmbedded(image, uploadStateOff) {
    const gif = isGif(image);
    const quality = gif ? 1 : getSetting('embeddedCompression');
    const sendMessageCb = image => createChatMessage(image, uploadStateOff);

    return compressAndSendEmbedded(image, quality, sendMessageCb, uploadStateOff);
}

/**
 * Creates a chat message from an file
 *
 * @param {File} image
 * @param {Function} uploadStateOff
 *
 * @return {Promise<*>}
 */
function createMessageWithFile(image, uploadStateOff) {
    const gif = isGif(image);
    const quality = gif ? 1 : getSetting('uploadCompression');
    const sendMessageCb = image => createChatMessage(image, uploadStateOff);

    return compressAndSendFile(image, quality, sendMessageCb, uploadStateOff);
}

/**
 * Creates a chat message from an url
 *
 * @param {string} image
 * @param {Function} uploadStateOff
 *
 * @return {Promise<*>}
 */
function createMessageWithURL(image, uploadStateOff) {
    return createChatMessage(image, uploadStateOff);
}

/**
 * Determines what type of chat message should be created
 * URL       - typeof image === 'string'
 * Blob      - whereToSave === database || !uploadPermission && saveFallback
 * File path - whereToSave !== database && uploadPermission
 *
 * @param {string | File} image
 * @param {Object} uploadState
 * @param {Function} uploadState.on
 * @param {Function} uploadState.off
 *
 * @return {function}
 */
function determineSendFunction(image, uploadState) {
    if (typeof image === 'string') return createMessageWithURL;

    const whereToSave = getSetting('whereToSavePastedImages');
    if (whereToSave === 'database') return createMessageWithEmbedded;

    const canUpload = getUploadPermissionStatus();
    if (canUpload) return createMessageWithFile;

    const saveFallback = getSetting('saveAsBlobIfCantUpload');
    if (saveFallback) return createMessageWithEmbedded;

    return () => {
        ui.notifications.warn(localize('imageManager.noPermissionWarning'));
        uploadState.off();
    }
}

/**
 * Sends a chat message
 *
 * @param {HTMLElement} chat
 * @param {string | File} image
 */
function sendMessage(chat, image) {
    const uploadState = getUploadingStates(chat);
    const sendFn = determineSendFunction(image, uploadState);

    uploadState.on();
    sendFn(image, uploadState.off)
}

/**
 * Display a dialog with a warning first, then if the user agrees
 * send a chat message with an image
 *
 * @param {HTMLElement} chat
 * @param {string | File} image
 */
function warnThanSendMessage(chat, image) {
    const uploadState = getUploadingStates(chat);
    uploadState.on();

    let tookAction = false;
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
                    return uploadState.off();
                }
            }
        },
        default: 'ok',
        close: () => !tookAction && uploadState.off(),
    }).render(true);
}

export {
    getUploadingStates,
    messageTemplate,
    warnThanSendMessage,
    sendMessage,
};
