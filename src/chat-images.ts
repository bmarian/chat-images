import './styles/chat-images.scss'
import {initUploadArea} from './scripts/components/UploadArea'
import {initUploadButton} from './scripts/components/UploadButton'

Hooks.once('init', () => {
  console.log('Init')
})

Hooks.on('renderSidebarTab', (_0: never, sidebarJqueryElement: JQuery) => {
  const sidebarHtmlElement: HTMLElement | null = sidebarJqueryElement[0]
  if (!sidebarHtmlElement) return

  const hasChatElement = sidebarHtmlElement.querySelector('#chat-message')
  if (!hasChatElement) return

  initUploadArea(sidebarJqueryElement)
  initUploadButton(sidebarJqueryElement)
})
