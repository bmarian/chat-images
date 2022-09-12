import './styles/chat-images.scss'
import {initUploadArea} from './scripts/components/UploadArea'
import {initUploadButton} from './scripts/components/UploadButton'
import {initChatSidebar} from './scripts/components/ChatSidebar'

Hooks.once('init', () => {
  console.log('Init')
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
