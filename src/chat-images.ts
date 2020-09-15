import utils from "./module/Utils";
import preCreateChatMessage from "./module/hooks/PreCreateChatMessage";
import RenderSidebarTab from "./module/hooks/RenderSidebarTab"
import renderChatMessage from "./module/hooks/RenderChatMessage";
import Init from "./module/hooks/Init";

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
 * Adding a hook on renderChatMessage to add events on all the preview buttons when
 * they get rendered
 */
Hooks.on('renderChatMessage', (_0: any, html: any): void => {
    renderChatMessage.addImagePreviewButton(html);
});

Hooks.on('renderSidebarTab', RenderSidebarTab.renderSidebarTabHook.bind(RenderSidebarTab));