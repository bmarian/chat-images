import {on} from '../utils/JqueryWrappers'
import {getImageQueue, processDropAndPasteImages, removeAllFromQueue} from '../processors/FileProcessor'

let hookIsHandlingTheMessage = false

export const initChatSidebar = (sidebar: JQuery) => {
  const preCreateChatMessageHandler = (chatMessage: ChatMessage, userOptions: never, messageOptions: never) => {
    hookIsHandlingTheMessage = true
    const imageQueue = getImageQueue()
    if (!imageQueue.length) return

    // TODO Implement
    console.log('Hook is handling it')
    removeAllFromQueue(sidebar)
    hookIsHandlingTheMessage = false
  }
  Hooks.on('preCreateChatMessage', preCreateChatMessageHandler)

  const emptyChatEventHandler = (evt: KeyboardEvent) => {
    if (hookIsHandlingTheMessage || (evt.code !== 'Enter' && evt.code !== 'NumpadEnter')) return

    const imageQueue = getImageQueue()
    if (!imageQueue.length) return

    // TODO Implement
    console.log('Enter was pressed')
  }
  // This should only run when there is nothing in the chat
  on(sidebar, 'keyup', emptyChatEventHandler)

  const pastAndDropEventHandler = (evt: any) => {
    const originalEvent: ClipboardEvent | DragEvent = evt.originalEvent
    const eventData: DataTransfer | null = (originalEvent as ClipboardEvent).clipboardData || (originalEvent as DragEvent).dataTransfer
    if (!eventData) return

    processDropAndPasteImages(eventData, sidebar)
  }
  on(sidebar, 'paste drop', pastAndDropEventHandler)
}
