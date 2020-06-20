import {registerSettings} from './module/settings.js';
import utils from "./module/utils";
import preCreateChatMessage from "./module/hooks/PreCreateChatMessage";
import renderSidebarTab from "./module/hooks/RenderSidebarTab"
import renderChatMessage from "./module/hooks/RenderChatMessage";

/**
 * Adding a hook on init to register settings
 * // TODO v1.1.0 actually add settings
 */
Hooks.once('init', async () => {
    registerSettings();

    utils.debug('Finished initializing the module.');
});

/**
 * Adding a hook on preCreateChatMessage to get the message before is posted in chat and to
 * manipulate the data
 */
Hooks.on('preCreateChatMessage', (message: any): void => {
    if (message?.content) {
        message.content = preCreateChatMessage.processMessage(message.content);

        utils.debug('Chat content modified.');
    }
});

/**
 * Adding a hook on renderSidebarTab to attach events on the chat input when is rendered
 */
Hooks.on('renderSidebarTab', (_0: any, element: any): void => {
    const htmlElement = element[0];
    if (htmlElement?.id === 'chat') {
        const chat = htmlElement.querySelector("#chat-message");
        renderSidebarTab.handleImagePasteDrop(chat);

        utils.debug('Event added to chat input.');
    }
});

/**
 * Adding a hook on renderChatMessage to add events on all the preview buttons when
 * they get rendered
 */
Hooks.on('renderChatMessage', (_0: any, html: any): void => {
    renderChatMessage.addImagePreviewButton(html);

    utils.debug('Event added to preview button.');
});
