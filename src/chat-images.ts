import PreCreateChatMessage from "./module/hooks/PreCreateChatMessage";
import RenderSidebarTab from "./module/hooks/RenderSidebarTab"
import RenderChatMessage from "./module/hooks/RenderChatMessage";
import {createUploadFolderIfMissing, registerSettings} from "./module/settings";

Hooks.once('init', async () => {
    registerSettings();
    await createUploadFolderIfMissing();
});
Hooks.on('renderSidebarTab', RenderSidebarTab.renderSidebarTabHook.bind(RenderSidebarTab));
Hooks.on('preCreateChatMessage', PreCreateChatMessage.preCreateChatMessageHook.bind(PreCreateChatMessage));
Hooks.on('renderChatMessage', RenderChatMessage.RenderChatMessageHook.bind(RenderChatMessage));