import {on} from '../utils/JqueryWrappers'
import {getImageQueue, removeAllFromQueue} from '../processors/FileProcessor'

let hookIsHandlingTheMessage = false

export const initChatSidebar = (sidebar: JQuery) => {
  const preCreateChatMessageHandler = (chatMessage: ChatMessage, userOptions: never, messageOptions: never) => {
    hookIsHandlingTheMessage = true
    const imageQueue = getImageQueue()
    if (!imageQueue.length) return

    console.log('Hook is handling it')
    removeAllFromQueue(sidebar)
    hookIsHandlingTheMessage = false
  }
  Hooks.on('preCreateChatMessage', preCreateChatMessageHandler)

  const emptyChatEventHandler = (evt: KeyboardEvent) => {
    if (hookIsHandlingTheMessage || (evt.code !== 'Enter' && evt.code !== 'NumpadEnter')) return

    const imageQueue = getImageQueue()
    if (!imageQueue.length) return

    console.log('Enter was pressed')
  }
  // This should only run when there is nothing in the chat
  on(sidebar, 'keyup', emptyChatEventHandler)
}
