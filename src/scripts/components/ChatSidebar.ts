import {on} from '../utils/JqueryWrappers'
import {getImageQueue, processDropAndPasteImages, removeAllFromQueue, SaveValueType} from '../processors/FileProcessor'
import {t} from '../utils/Utils'

let hookIsHandlingTheMessage = false

const imageTemplate = (imageProps: SaveValueType): string => `<div class="ci-message-image"><img src="${imageProps.imageSrc}" alt="${imageProps.name || t('unableToLoadImage')}"></div>`
const messageTemplate = (imageQueue: SaveValueType[]) => {
  const imageTemplates: string[] = imageQueue.map((imageProps: SaveValueType): string => imageTemplate(imageProps))
  return `<div class="ci-message">${imageTemplates.join('')}</div>`
}

const preCreateChatMessageHandler = (sidebar: JQuery) => (chatMessage: any, userOptions: any, messageOptions: any) => {
  hookIsHandlingTheMessage = true
  const imageQueue: SaveValueType[] = getImageQueue()
  if (!imageQueue.length) {
    hookIsHandlingTheMessage = false
    return
  }

  const content = `${messageTemplate(imageQueue)}<div class="ci-notes">${chatMessage.content}</div>`

  chatMessage.content = content
  chatMessage._source.content = content
  messageOptions.chatBubble = false

  removeAllFromQueue(sidebar)
  hookIsHandlingTheMessage = false
}

const emptyChatEventHandler = (sidebar: JQuery) => (evt: KeyboardEvent) => {
  if (hookIsHandlingTheMessage || (evt.code !== 'Enter' && evt.code !== 'NumpadEnter')) return

  const imageQueue: SaveValueType[] = getImageQueue()
  if (!imageQueue.length) return

  const messageData = {
    content: messageTemplate(imageQueue),
    type: CONST.CHAT_MESSAGE_TYPES.OOC || 1,
    user: (game as Game).user,
  }
  ChatMessage.create(messageData)
  removeAllFromQueue(sidebar)
}

const pastAndDropEventHandler = (sidebar: JQuery) => (evt: any) => {
  const originalEvent: ClipboardEvent | DragEvent = evt.originalEvent
  const eventData: DataTransfer | null = (originalEvent as ClipboardEvent).clipboardData || (originalEvent as DragEvent).dataTransfer
  if (!eventData) return

  processDropAndPasteImages(eventData, sidebar)
}

export const initChatSidebar = (sidebar: JQuery) => {
  Hooks.on('preCreateChatMessage', preCreateChatMessageHandler(sidebar))

  // This should only run when there is nothing in the chat
  on(sidebar, 'keyup', emptyChatEventHandler(sidebar))

  on(sidebar, 'paste drop', pastAndDropEventHandler(sidebar))
}
