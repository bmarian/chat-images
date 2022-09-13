import './styles/chat-images.scss'
import {initUploadArea} from './scripts/components/UploadArea'
import {initUploadButton} from './scripts/components/UploadButton'
import {initChatSidebar} from './scripts/components/ChatSidebar'
import {ORIGIN_FOLDER, UPLOAD_FOLDER} from './scripts/utils/Utils'
import {initChatMessage} from './scripts/components/ChatMessage'
import {find} from './scripts/utils/JqueryWrappers'
import {processMessage} from './scripts/processors/MessageProcessor'

const createUploadFolder = async () => {
  try {
    const location = await FilePicker.browse(ORIGIN_FOLDER, UPLOAD_FOLDER)
    if (location.target === '.') await FilePicker.createDirectory(ORIGIN_FOLDER, UPLOAD_FOLDER, {})
  } catch (e) {
    await FilePicker.createDirectory(ORIGIN_FOLDER, UPLOAD_FOLDER, {})
  }
}

Hooks.once('init', async () => {
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

