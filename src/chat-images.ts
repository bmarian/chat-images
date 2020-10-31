import {createUploadFolderIfMissing, getSetting, registerSettings} from "./module/settings";
import {convertMessageToImage, createPopoutOnClick, handleChatInteraction} from "./module/imageManager";
import {MODULE_NAME} from "./module/util";

Hooks.once('init', async () => {
    registerSettings();
    await createUploadFolderIfMissing();
});

Hooks.on('preCreateChatMessage', (message: any, options: any): void => {
    const content = convertMessageToImage(message.content);
    if (!content) return;

    message.content = content;
    options.chatBubble = false;
});

Hooks.on('renderChatMessage', (_0: any, html: HTMLElement): void => {
    if (!html || !html[0]) return;

    const img = html[0].querySelector(`.${MODULE_NAME}-container`)?.children?.[0];
    if (!img) return;

    img.addEventListener('click', () => createPopoutOnClick(img));
});

Hooks.on('renderSidebarTab', (_0: any, html: HTMLElement): void => {
    const chat = html[0]?.querySelector('#chat-message');
    if (!chat) return;

    chat.addEventListener('paste', (event: any): void | Promise<void> => handleChatInteraction(getSetting('warningOnPaste'), chat, event));
    chat.addEventListener('drop', (event: any): void | Promise<void> => handleChatInteraction(getSetting('warningOnDrop'), chat, event));
});