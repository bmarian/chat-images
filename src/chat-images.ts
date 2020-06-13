// Import TypeScript modules
import {registerSettings} from './module/settings.js';
import {preloadTemplates} from './module/preloadTemplates.js';
import utils from "./module/utils";
import preCreateChatMessageHook from "./module/preCreateChatMessageHook";
import renderSidebarTabHook from "./module/renderSidebarTabHook"

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('chat-images | Initializing chat-images');
    registerSettings();
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
Hooks.on('preCreateChatMessage', function (message) {
    if (message.content) {
        message.content = preCreateChatMessageHook.processMessage(message.content);
    }
});

// Add any additional hooks if necessary
