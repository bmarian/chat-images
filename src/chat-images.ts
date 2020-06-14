// Import TypeScript modules
import {registerSettings} from './module/settings.js';
import {preloadTemplates} from './module/preloadTemplates.js';
import utils from "./module/utils";
import preCreateChatMessageHook from "./module/preCreateChatMessageHook";
import renderSidebarTabHook from "./module/renderSidebarTabHook"
import renderChatMessageHook from "./module/renderChatMessageHook";

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async () => {
    registerSettings();

    await preloadTemplates();
});

//
// /* ------------------------------------ */
// /* Setup module							*/
// /* ------------------------------------ */
// Hooks.once('setup', function () {
//     // Do anything after initialization but before
//     // ready
//     utils.debug('Setup done');
// });

// /* ------------------------------------ */
// /* When ready							*/
// /* ------------------------------------ */
// Hooks.once('ready', function () {
//     // Do anything once the module is ready
//     utils.debug('Ready');
// });

/* ------------------------------------ */
/* Before creating a chat message		*/
/* ------------------------------------ */
Hooks.on('preCreateChatMessage', (message) => {
    if (message.content) {
        message.content = preCreateChatMessageHook.processMessage(message.content);
    }
});

/* ------------------------------------ */
/* When rendering sidebar tab   		*/
/* ------------------------------------ */
Hooks.on('renderSidebarTab', (chatLog, element) => {
    if (element[0] && element[0].id === 'chat') {
        const chat = element[0].querySelector("#chat-message");

        renderSidebarTabHook.handleImagePaste(chat);
    }
});

/* ------------------------------------ */
/* When rendering a chat message   		*/
/* ------------------------------------ */
Hooks.on('renderChatMessage', (message, html, data) => {
    renderChatMessageHook.addImagePreviewButton(message, html, data);
});
