import { find, on } from '../utils/JqueryWrappers'
import { getImageQueue, processDropAndPasteImages, removeAllFromQueue, SaveValueType } from '../processors/FileProcessor'
import { isVeriosnAfter13, t } from '../utils/Utils'
import { getUploadingStates } from './Loader'

let hookIsHandlingTheMessage = false
let eventIsHandlingTheMessage = false

const imageTemplate = (imageProps: SaveValueType): string => `<div class="ci-message-image"><img src="${imageProps.imageSrc}" alt="${imageProps.name || t('unableToLoadImage')}"></div>`

const messageTemplate = (imageQueue: SaveValueType[]) => {
  const imageTemplates: string[] = imageQueue.map((imageProps: SaveValueType): string => imageTemplate(imageProps))
  return `<div class="ci-message">${imageTemplates.join('')}</div>`
}

const preCreateChatMessageHandler = (sidebar: JQuery) => (chatMessage: any, userOptions: never, messageOptions: any) => {
  if (eventIsHandlingTheMessage) return

  hookIsHandlingTheMessage = true
  const imageQueue: SaveValueType[] = getImageQueue()
  if (!imageQueue.length) {
    hookIsHandlingTheMessage = false
    return
  }

  const uploadState = getUploadingStates(sidebar)
  uploadState.on()

  const content = `${messageTemplate(imageQueue)}<div class="ci-notes">${chatMessage.content}</div>`

  chatMessage.content = content
  chatMessage._source.content = content
  messageOptions.chatBubble = false

  removeAllFromQueue(sidebar)
  hookIsHandlingTheMessage = false
  uploadState.off()
}

const emptyChatEventHandler = (sidebar: JQuery) => async (evt: KeyboardEvent) => {
  if (hookIsHandlingTheMessage || (evt.code !== 'Enter' && evt.code !== 'NumpadEnter') || evt.shiftKey) return
  eventIsHandlingTheMessage = true

  const uploadState = getUploadingStates(sidebar)
  const imageQueue: SaveValueType[] = getImageQueue()
  if (!imageQueue.length) {
    eventIsHandlingTheMessage = false
    return
  }
  uploadState.on()

  const chatMessageType = isVeriosnAfter13()
    ? CONST.CHAT_MESSAGE_STYLES.OOC
    : CONST.CHAT_MESSAGE_TYPES.OOC

  const messageData = {
    content: messageTemplate(imageQueue),
    type: typeof chatMessageType !== 'undefined' ? chatMessageType : 1,
    user: (game as Game).user,
  }
  await ChatMessage.create(messageData)
  removeAllFromQueue(sidebar)
  uploadState.off()
  eventIsHandlingTheMessage = false
}

const pastAndDropEventHandler = (sidebar: JQuery) => (evt: any) => {
  const originalEvent: ClipboardEvent | DragEvent = evt.originalEvent
  const eventData: DataTransfer | null = (originalEvent as ClipboardEvent).clipboardData || (originalEvent as DragEvent).dataTransfer
  if (!eventData) return

  processDropAndPasteImages(eventData, sidebar)
}

export const isUploadAreaRendered = (sidebar: JQuery): boolean => {
  const uploadArea = find('#ci-chat-upload-area', sidebar)
  return !!uploadArea.length;
}

export const initChatSidebar = (sidebar: JQuery) => {
  Hooks.on('preCreateChatMessage', preCreateChatMessageHandler(sidebar))

  // This should only run when there is nothing in the chat
  on(sidebar, 'keyup', emptyChatEventHandler(sidebar))

  on(sidebar, 'paste drop', pastAndDropEventHandler(sidebar))
}
