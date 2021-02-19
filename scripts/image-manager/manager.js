'use strict';

import {isImageURL, URL_REGEX} from "./url-checking.js";
import {extractImageFromEvent} from "./image-extraction.js";
import {createPopout} from "./popout-handling.js";
import {messageTemplate, sendMessage, warnThanSendMessage} from "./chat-handling.js";

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
 * @return {string|null}
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
