import './styles/chat-images.scss'
import {initUploadArea} from './scripts/components/UploadArea'
import {initUploadButton} from './scripts/components/UploadButton'
import {initChatSidebar} from './scripts/components/ChatSidebar'
import {initChatMessage} from './scripts/components/ChatMessage'
import {find} from './scripts/utils/JqueryWrappers'
import {processMessage} from './scripts/processors/MessageProcessor'
import {createUploadFolder, getSettings, registerSetting} from './scripts/utils/Settings'

const registerSettings = () => {
  const settings = getSettings()
  settings.forEach((setting) => registerSetting(setting))
}

Hooks.once('init', async () => {
  registerSettings()
  await createUploadFolder()
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

Hooks.on('renderChatMessage', (_0: never, chatMessage: JQuery) => {
  const ciMessage = find('.ci-message-image', chatMessage)
  if (!ciMessage[0]) return

  initChatMessage(chatMessage)
})

Hooks.on('preCreateChatMessage', (chatMessage: any, userOptions: never, messageOptions: any) => {
  const progressedMessage: string = processMessage(chatMessage.content)

  chatMessage.content = progressedMessage
  chatMessage._source.content = progressedMessage
  messageOptions.chatBubble = false
})

