import './styles/chat-images.scss'
import { initUploadArea } from './scripts/components/UploadArea'
import { initUploadButton } from './scripts/components/UploadButton'
import { initChatSidebar, isUploadAreaRendered } from './scripts/components/ChatSidebar'
import { initChatMessage } from './scripts/components/ChatMessage'
import { create, find } from './scripts/utils/JqueryWrappers'
import { processMessage } from './scripts/processors/MessageProcessor'
import { createUploadFolder, getSettings, registerSetting } from './scripts/utils/Settings'
import { isVeriosnAfter13 } from './scripts/utils/Utils'

const registerSettings = () => {
  const settings = getSettings()
  settings.forEach((setting) => registerSetting(setting))
}

Hooks.once('init', async () => {
  CONFIG.debug.hooks = true

  registerSettings()
  registerHooks()

  await createUploadFolder()
})

const registerHooks = () => {
  if (isVeriosnAfter13()) {
    Hooks.on('renderChatMessageHTML', (_0: never, chatMessageElement: HTMLElement) => {
      const chatMessage = create(chatMessageElement)

      const ciMessage = find('.ci-message-image', chatMessage)
      if (!ciMessage[0]) return

      initChatMessage(chatMessage)
    })

    const initEvents = (sidebar: JQuery) => {
      // Prevent adding events multiple times
      if (isUploadAreaRendered(sidebar)) return

      initUploadArea(sidebar)
      // Removed in version 13 
      // initUploadButton(sidebar)
      initChatSidebar(sidebar)
    }

    Hooks.on('collapseSidebar', (sidebar: any, collapsed: boolean) => {
      if (!sidebar || collapsed) return

      const sidebarElement = sidebar.element
      if (!sidebarElement) return

      const hasChatElement = sidebarElement.querySelector('#chat-message')
      if (!hasChatElement) return

      const sidebarJq = $(sidebarElement)
      initEvents(sidebarJq)
    })

    Hooks.on('activateChatLog', (chatLog: any) => {
      if (!chatLog) return

      const chatLogElement = chatLog.element
      if (!chatLogElement) return

      const hasChatElement = chatLogElement.querySelector('#chat-message')
      if (!hasChatElement) return

      const chatLogJq = $(chatLogElement)
      initEvents(chatLogJq)
    })
  } else {
    Hooks.on('renderChatMessage', (_0: never, chatMessage: JQuery) => {
      const ciMessage = find('.ci-message-image', chatMessage)
      if (!ciMessage[0]) return

      initChatMessage(chatMessage)
    })

    Hooks.on('renderSidebarTab', (_0: never, sidebar: JQuery) => {
      const sidebarElement: HTMLElement | null = sidebar[0]
      if (!sidebarElement) return

      const hasChatElement = sidebarElement.querySelector('#chat-message')
      if (!hasChatElement) return

      initUploadArea(sidebar)
      initUploadButton(sidebar)
      initChatSidebar(sidebar)
    })
  }

  Hooks.on('preCreateChatMessage', (chatMessage: any, userOptions: never, messageOptions: any) => {
    const processedMessage: string = processMessage(chatMessage.content)
    if (chatMessage.content === processedMessage) return

    chatMessage.content = processedMessage
    chatMessage._source.content = processedMessage
    messageOptions.chatBubble = false
  })
}
