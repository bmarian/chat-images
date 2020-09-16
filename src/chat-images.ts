import PreCreateChatMessage from "./module/hooks/PreCreateChatMessage";
import RenderSidebarTab from "./module/hooks/RenderSidebarTab"
import RenderChatMessage from "./module/hooks/RenderChatMessage";
import Init from "./module/hooks/Init";

Hooks.once('init', Init.initHook.bind(Init));
Hooks.on('renderSidebarTab', RenderSidebarTab.renderSidebarTabHook.bind(RenderSidebarTab));
Hooks.on('preCreateChatMessage', PreCreateChatMessage.preCreateChatMessageHook.bind(PreCreateChatMessage));
Hooks.on('renderChatMessage', RenderChatMessage.RenderChatMessageHook.bind(RenderChatMessage));