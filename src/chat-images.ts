import utils from "./module/Utils";
import preCreateChatMessage from "./module/hooks/PreCreateChatMessage";
import renderSidebarTab from "./module/hooks/RenderSidebarTab"
import renderChatMessage from "./module/hooks/RenderChatMessage";
import Init from "./module/hooks/Init";

/**
 * Adding a hook on init to register settings
 */
Hooks.once('init', Init.initHook.bind(Init));

/**
 * Adding a hook on preCreateChatMessage to get the message before is posted in chat and to
 * manipulate the data
 */
Hooks.on('preCreateChatMessage', (message: any, options: any): void => {
    if (!message?.content) return;

    const {content, changed} = preCreateChatMessage.processMessage(message.content);
    if (!changed) return;

    message.content = content;
    options.chatBubble = !changed;
    utils.debug('ChatMessage content modified.');
});

/**
 * Adding a hook on renderSidebarTab to attach events on the chat input when is rendered
 */
Hooks.on('renderSidebarTab', (_0: any, element: any): void => {
    const htmlElement = element[0];
    if (htmlElement?.id === 'chat') {
        const chat = htmlElement.querySelector("#chat-message");
        renderSidebarTab.handleImagePasteDrop(chat);
        utils.debug('Event added to chat input.', false);
    }
});

/**
 * Adding a hook on renderChatMessage to add events on all the preview buttons when
 * they get rendered
 */
Hooks.on('renderChatMessage', (_0: any, html: any): void => {
    renderChatMessage.addImagePreviewButton(html);
});